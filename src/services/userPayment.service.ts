import db from '@/config/database'
import { PaymentRequestBody } from '@/types/payment'
import { createOrder, fetchPayment } from '@/utils/razorpay'
import { addToEmailQueue } from '@/queues/email.queue'
import { User } from '@/models/user.model'
import { UserPayment } from '@/models/userPayment.model'
import { UserPaymentHistory } from '@/models/userPaymentHistory.model'
import { Plan } from '@/models/plan.model'

interface PaymentStatus {
	method?: string
	status: string
}

interface PaymentValidationData {
	user: User
	payment: UserPayment
	plan: Plan | null
	paymentStatus: PaymentStatus & { order_id: string }
}

interface PaymentProcessingData {
	userId: number
	payment: UserPayment
	paymentStatus: PaymentStatus & { order_id: string }
	quantity: number
	planExpDate: Date
	paymentId: string
	user: User
}

interface EmailData {
	quantity: number
	amount: number
	couponCode: string
	offerTitle: string
	month_year: string
}

export class UserPaymentService {
	static async createUserPayment(
		userId: number,
		data: PaymentRequestBody,
	): Promise<Record<string, unknown>> {
		const {
			plan_id,
			coupon_id,
			offer_id,
			currency,
			amount,
			number_of_valid_years,
			plan_exp_date,
			billing_instrument,
		} = data
		const razorpayOrder = await createOrder(amount, currency)
		const user = await db.User.findByPk(userId)
		const payment = await db.UserPayment.create({
			user_id: userId,
			plan_id,
			amount,
			num_of_valid_years: number_of_valid_years ?? 1,
			plan_exp_date: plan_exp_date ? new Date(plan_exp_date) : new Date(),
		})
		await db.UserPaymentHistory.create({
			user_id: userId,
			plan_id,
			amount,
			num_of_valid_years: number_of_valid_years ?? 1,
			plan_exp_date: plan_exp_date ? new Date(plan_exp_date) : new Date(),
			payment_id: razorpayOrder.id,
			billing_instrument: billing_instrument ?? '-',
			phone: user?.phone_number ?? '-',
			status: 'success',
			coupon_id: coupon_id ?? null,
			offer_id: offer_id ?? null,
		})
		return {
			...payment.toJSON(),
			razorpay_order_id: razorpayOrder.id,
			razorpay_amount: razorpayOrder.amount,
			currency: razorpayOrder.currency,
		}
	}

	private static async validatePaymentData(
		userId: number,
		paymentId: string,
	): Promise<PaymentValidationData> {
		const user = await db.User.findByPk(userId)
		if (!user) throw new Error('User not found')

		const paymentStatus = (await fetchPayment(paymentId)) as PaymentStatus & {
			order_id: string
		}
		if (!paymentStatus.order_id)
			throw new Error('Order ID not found in Razorpay payment')

		const payment = await db.UserPayment.findOne({
			where: { user_id: userId },
		})
		if (!payment) throw new Error('Payment record not found')

		const plan = await db.Plan.findByPk(payment.plan_id)

		return { user, payment, plan, paymentStatus }
	}

	private static async calculatePlanExpirationDate(
		userId: number,
	): Promise<Date> {
		const latestHistory = await db.UserPaymentHistory.findOne({
			where: { user_id: userId },
			order: [['createdAt', 'DESC']],
		})

		const currentDate = latestHistory?.plan_exp_date
			? new Date(latestHistory.plan_exp_date)
			: new Date()

		const planExpDate = new Date(currentDate)
		planExpDate.setFullYear(planExpDate.getFullYear() + 1)

		if (isNaN(planExpDate.getTime())) {
			throw new Error('Invalid plan expiration date calculated')
		}

		return planExpDate
	}

	private static async processPaymentHistory(
		data: PaymentProcessingData,
	): Promise<UserPaymentHistory> {
		const { userId, payment, paymentStatus, quantity, planExpDate } = data

		return await db.UserPaymentHistory.create({
			user_id: userId,
			plan_id: payment.plan_id,
			amount: payment.amount,
			payment_id: data.paymentId,
			num_of_valid_years: quantity,
			plan_exp_date: planExpDate,
			email: data.user.email ?? '',
			phone: data.user.phone_number ?? '',
			billing_instrument: paymentStatus.method || '-',
			coupon_id: null,
			offer_id: null,
			status: paymentStatus.status,
		})
	}

	private static async updateUserPayment(
		userId: number,
		payment: UserPayment,
		quantity: number,
		planExpDate: Date,
		paymentHistory: UserPaymentHistory,
	): Promise<void> {
		const existingPlan = await db.UserPayment.findOne({
			where: { user_id: userId },
		})

		if (existingPlan) {
			await existingPlan.update({
				plan_id: payment.plan_id,
				num_of_valid_years: quantity,
				plan_exp_date: planExpDate,
				amount: payment.amount,
				payment_history_id: paymentHistory.id,
			})
		} else {
			await db.UserPayment.create({
				user_id: userId,
				plan_id: payment.plan_id,
				num_of_valid_years: quantity,
				plan_exp_date: planExpDate,
				amount: payment.amount,
				payment_history_id: paymentHistory.id,
			})
		}
	}

	private static prepareEmailData(payment: UserPayment): EmailData {
		return {
			quantity: 1,
			amount: payment.amount,
			couponCode: '-',
			offerTitle: '-',
			month_year: 'Year',
		}
	}

	private static sendPaymentEmails(
		user: User,
		plan: Plan | null,
		emailData: EmailData,
	): void {
		const { quantity, amount, couponCode, offerTitle, month_year } = emailData

		// Send email to user
		addToEmailQueue({
			to: user.email || '',
			subject: `Thank you ${user.name}, for updating your Powergotha plan`,
			template: 'planPaymentSuccess',
			data: {
				name: user.getDataValue('name'),
				quantity,
				amount,
				coupon: couponCode !== '-' ? 'Yes' : 'No',
				coupon_code: couponCode,
				offer: offerTitle !== '-' ? 'Yes' : 'No',
				offer_name: offerTitle,
				month_year,
			},
		})

		// Send email to admin
		addToEmailQueue({
			to: 'saniya8537@gmail.com',
			subject: `Powergotha plan update details of ${user.name}`,
			template: 'adminPlanPaymentSuccess',
			data: {
				plan_name: plan?.name || 'Premium Subscription',
				quantity,
				name: user.getDataValue('name'),
				email: user.getDataValue('email') ?? '',
				phone: user.getDataValue('phone_number'),
				amount,
				coupon_code: couponCode,
				offer_name: offerTitle,
				month_year,
			},
		})
	}

	private static validateUserDetails(user: User): void {
		if (
			!user?.getDataValue('name') ||
			!user?.getDataValue('email') ||
			!user?.getDataValue('phone_number')
		) {
			throw new Error('User details incomplete — cannot send admin email.')
		}
	}

	static async getUserPaymentDetails(
		userId: number,
		paymentId: string,
	): Promise<{ payment: UserPayment; expDate: Date }> {
		const { user, payment, plan, paymentStatus } =
			await this.validatePaymentData(userId, paymentId)

		const planExpDate = await this.calculatePlanExpirationDate(userId)
		const quantity = 1

		const paymentHistory = await this.processPaymentHistory({
			userId,
			payment,
			paymentStatus,
			quantity,
			planExpDate,
			paymentId,
			user,
		})

		await this.updateUserPayment(
			userId,
			payment,
			quantity,
			planExpDate,
			paymentHistory,
		)
		await user.update({ payment_status: 'premium' })

		const emailData = this.prepareEmailData(payment)
		this.sendPaymentEmails(user, plan, emailData)
		this.validateUserDetails(user)

		return {
			payment,
			expDate: planExpDate,
		}
	}

	static async getPlanPaymentHistory(
		userId: number,
	): Promise<UserPaymentHistory[]> {
		return await db.UserPaymentHistory.findAll({
			where: { user_id: userId },
			include: [{ model: db.Plan, as: 'plan', attributes: ['id', 'name'] }],
			order: [['createdAt', 'DESC']],
		})
	}
}
