import crypto from 'node:crypto'
import { PaymentData, PaymentVerify } from '@/types/payment'
import razorpay from '@/utils/razorpay'
import { UserPaymentHistory } from '@/models/userPaymentHistory.model'
import db from '@/config/database'
import { NotFoundError } from '@/utils/errors'
import moment from 'moment'
import { addToEmailQueue } from '@/queues/email.queue'
import { logger } from '@/config/logger'

interface EmailData {
	name: string
	quantity?: number
	amount: number
	coupon: string
	coupon_code: string
	offer: string
	offer_name: string
	month_year: string
}

interface AdminEmailData extends EmailData {
	plan_name: string
	email: string
	phone: string
}

export class UserPaymentService {
	// 1. CREATE PAYMENT ORDER
	static async createPaymentOrder(
		user_id: number,
		data: PaymentData,
	): Promise<{
		success: boolean
		data: {
			order_id: string
			amount: number
			currency: string
			key_id: string
			name: string
			phone: string
			email: string
		}
	}> {
		const { plan_id, amount, quantity, coupon_id, offer_id } = data

		const user = await db.User.findOne({
			where: { id: user_id, deleted_at: null },
			attributes: ['name', 'email', 'phone_number'],
		})
		if (!user) {
			throw new NotFoundError('User not found')
		}

		const orderOptions = {
			amount: amount * 100,
			currency: 'INR',
			receipt: `order_${user_id}_${Date.now()}`,
			notes: {
				user_id: user_id.toString(),
				plan_id: plan_id.toString(),
				amount: amount.toString(),
				quantity: (quantity || 1).toString(),
				phone: user.get('phone_number') || '',
				offer_id: offer_id ? offer_id.toString() : '',
				coupon_id: coupon_id ? coupon_id.toString() : '',
				name: user.get('name') || '',
				email: user.get('email') || '',
			},
		}

		try {
			const order = await razorpay.orders.create(orderOptions)
			return {
				success: true,
				data: {
					order_id: order.id,
					amount: order.amount as number,
					currency: order.currency,
					key_id: process.env.RAZORPAY_KEY_ID || '',
					name: user.get('name'),
					phone: user.get('phone_number'),
					email: user.get('email') || '',
				},
			}
		} catch {
			throw new Error('Failed to create payment order')
		}
	}

	// 2. VERIFY AND PROCESS PAYMENT
	public static async verifyAndProcessPayment(
		user_id: number,
		data: PaymentVerify,
	): Promise<{ success: boolean; message: string; data: unknown }> {
		try {
			const user = await db.User.findOne({
				where: { id: user_id, deleted_at: null },
			})
			if (!user) {
				return { success: false, message: 'User not found', data: [] }
			}

			// Verify payment signature
			const isValidPayment = this.verifyPaymentSignature(data)
			if (!isValidPayment) {
				return {
					success: false,
					message: 'Invalid payment signature',
					data: [],
				}
			}

			// Fetch payment and order details from Razorpay
			const [payment, order] = await Promise.all([
				razorpay.payments.fetch(data.razorpay_payment_id),
				razorpay.orders.fetch(data.razorpay_order_id),
			])

			const notes = this.parseOrderNotes(
				order.notes as {
					user_id: string
					plan_id: string
					amount: string
					quantity: string
					name: string
					email: string
					phone: string
					offer_id: string
					coupon_id: string
				},
			)

			// Validate order belongs to user
			if (Number.parseInt(notes.user_id) !== user_id) {
				return { success: false, message: 'Invalid order', data: [] }
			}

			// Process based on payment status
			if (payment.status === 'captured') {
				return await this.processSuccessfulPayment(
					user_id,
					order.id,
					user.get('payment_status'),
					{
						id: payment.id,
						amount: payment.amount.toString(),
						status: payment.status,
						method: payment.method,
					},
					notes,
				)
			} else {
				return await this.processFailedPayment(
					user_id,
					{
						id: payment.id,
						amount: payment.amount.toString(),
						status: payment.status,
						method: payment.method,
					},
					notes,
				)
			}
		} catch {
			return {
				success: false,
				message: 'Payment verification failed',
				data: [],
			}
		}
	}

	// 3. WEBHOOK HANDLER
	public static async handleWebhook(
		webhookSignature: string,
		body: Buffer,
	): Promise<{ success: boolean; message: string; data: [] }> {
		try {
			const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

			if (!webhookSecret) {
				logger.error('RAZORPAY_WEBHOOK_SECRET is not configured')
				return {
					success: false,
					message: 'Webhook configuration error',
					data: [],
				}
			}

			if (!webhookSignature || !webhookSecret) {
				return {
					success: false,
					message: 'Missing webhook signature or secret',
					data: [],
				}
			}

			const isValidSignature = this.verifyWebhookSignature(
				body,
				webhookSignature,
				webhookSecret,
			)

			if (!isValidSignature) {
				return {
					success: false,
					message: 'Invalid webhook signature',
					data: [],
				}
			}

			const { event, payload } = JSON.parse(body.toString()) as {
				event: string
				payload: {
					payment: {
						entity: {
							id: string
							order_id: string
							amount: string
							status: string
							method: string
						}
					}
				}
			}

			// Log webhook event for audit
			logger.info('Processing webhook event', {
				event,
				paymentId: payload.payment.entity.id,
				timestamp: new Date().toISOString(),
			})

			switch (event) {
				case 'payment.captured':
					await this.handlePaymentCapturedWebhook(payload.payment.entity)
					break

				case 'payment.failed':
					await this.handlePaymentFailedWebhook(payload.payment.entity)
					break
				default:
					logger.error('Unhandled webhook event', { event })
			}

			return {
				success: true,
				message: 'Webhook processed successfully',
				data: [],
			}
		} catch (error) {
			logger.error('Webhook processing failed', {
				error: error instanceof Error ? error.message : 'Unknown error',
				stack: error instanceof Error ? error.stack : undefined,
			})
			return {
				success: false,
				message: 'Webhook processing failed',
				data: [],
			}
		}
	}

	// 4. GET PAYMENT HISTORY
	public static async getPlanPaymentHistory(
		userId: number,
	): Promise<UserPaymentHistory[]> {
		return await db.UserPaymentHistory.findAll({
			where: { user_id: userId },
			include: [{ model: db.Plan, as: 'plan', attributes: ['id', 'name'] }],
			order: [['created_at', 'DESC']],
		})
	}

	// HELPER METHODS
	private static verifyPaymentSignature(data: PaymentVerify): boolean {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data
		const body = `${razorpay_order_id}|${razorpay_payment_id}`
		const expectedSignature = crypto
			.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
			.update(body.toString())
			.digest('hex')
		return expectedSignature === razorpay_signature
	}
	private static verifyWebhookSignature(
		body: Buffer,
		signature: string,
		secret: string,
	): boolean {
		const expectedSignature = crypto
			.createHmac('sha256', secret)
			.update(body)
			.digest('hex')
		return expectedSignature === signature
	}
	private static parseOrderNotes(notes: {
		user_id: string
		plan_id: string
		amount: string
		quantity: string
		name: string
		email: string
		phone: string
		offer_id: string
		coupon_id: string
	}): {
		user_id: string
		plan_id: string
		amount: string
		quantity: string
		name: string
		email: string
		phone: string
		offer_id: string
		coupon_id: string
	} {
		return {
			user_id: notes.user_id || '0',
			plan_id: notes.plan_id || '0',
			amount: notes.amount || '0',
			quantity: notes.quantity || '1',
			name: notes.name || '',
			email: notes.email || '',
			phone: notes.phone || '',
			offer_id: notes.offer_id || '',
			coupon_id: notes.coupon_id || '',
		}
	}
	private static async processSuccessfulPayment(
		user_id: number,
		order_id: string,
		user_payment_status: string,
		payment: {
			id: string
			amount: string
			status: string
			method: string
		},
		notes: {
			user_id: string
			plan_id: string
			amount: string
			quantity: string
			name: string
			email: string
			phone: string
			offer_id: string
			coupon_id: string
		},
	): Promise<{
		success: boolean
		message: string
		data: {
			payment: {
				id: string
				amount: number
				status: string
				method: string
			}
			expDate: string
			planDetails: number
		}
	}> {
		const transaction = await db.sequelize.transaction()

		try {
			// Check if already processed
			const existingPayment = await db.UserPaymentHistory.findOne({
				where: { payment_id: payment.id },
				transaction,
			})

			if (existingPayment && existingPayment.get('status') === '1') {
				await transaction.commit()

				return {
					success: true,
					message: 'Success',
					data: {
						payment: {
							id: payment.id,
							amount: Number(payment.amount) / 100,
							status: payment.status,
							method: payment.method,
						},
						expDate: moment(existingPayment.get('plan_exp_date')).format(
							'YYYY-MM-DD',
						),
						planDetails: existingPayment.get('id'),
					},
				}
			} else {
				// Calculate plan expiration
				const planExpDate = await this.calculatePlanExpiration(
					user_id,
					user_payment_status,
					{
						user_id: Number.parseInt(notes.user_id),
						plan_id: Number.parseInt(notes.plan_id),
						amount: Number.parseInt(notes.amount),
						quantity: Number.parseInt(notes.quantity),
						name: notes.name,
						email: notes.email,
						phone: notes.phone,
						offer_id: notes.offer_id ? Number.parseInt(notes.offer_id) : null,
						coupon_id: notes.coupon_id
							? Number.parseInt(notes.coupon_id)
							: null,
					},
				)

				// Prepare payment data
				const insertPaymentData = {
					user_id: user_id,
					plan_id: Number.parseInt(notes.plan_id),
					amount: Number(payment.amount) / 100,
					payment_id: payment.id,
					order_id: order_id,
					num_of_valid_years: Number.parseInt(notes.quantity) || 1,
					plan_exp_date: planExpDate,
					email: notes.email,
					phone: notes.phone,
					billing_instrument: payment.method,
					offer_id: notes.offer_id ? Number.parseInt(notes.offer_id) : null,
					coupon_id: notes.coupon_id ? Number.parseInt(notes.coupon_id) : null,
					status: '1',
				}

				let paymentDetails
				const existingUserPlan = await db.UserPayment.findOne({
					where: { user_id },
					transaction,
					raw: true,
				})

				if (existingPayment) {
					// Update existing payment record
					await db.UserPaymentHistory.update(insertPaymentData, {
						where: { id: existingPayment.get('id') },
						transaction,
					})
					paymentDetails = {
						id: existingPayment.get('id'),
						...insertPaymentData,
					}
				} else {
					// Create new payment record
					paymentDetails = await db.UserPaymentHistory.create(
						insertPaymentData,
						{
							transaction,
						},
					)
				}

				// Update or create user payment plan
				if (existingUserPlan) {
					await db.UserPayment.update(
						{
							num_of_valid_years: insertPaymentData.num_of_valid_years,
							plan_exp_date: planExpDate,
							payment_history_id: paymentDetails.id,
							amount: insertPaymentData.amount,
							plan_id: Number.parseInt(notes.plan_id),
							updated_at: new Date(),
						},
						{ where: { user_id }, transaction },
					)
				} else {
					await db.UserPayment.create(
						{
							user_id: user_id,
							plan_id: Number.parseInt(notes.plan_id) || 1,
							amount: insertPaymentData.amount,
							payment_history_id: paymentDetails.id,
							num_of_valid_years: insertPaymentData.num_of_valid_years,
							plan_exp_date: planExpDate,
						},
						{ transaction },
					)
				}

				// Update user status
				await db.User.update(
					{ payment_status: 'premium' },
					{ where: { id: user_id }, transaction },
				)

				await transaction.commit()

				// Queue emails asynchronously
				this.queuePaymentEmails({
					user_id: Number.parseInt(notes.user_id),
					plan_id: Number.parseInt(notes.plan_id),
					amount: Number.parseInt(notes.amount),
					quantity: Number.parseInt(notes.quantity),
					name: notes.name,
					email: notes.email,
					phone: notes.phone,
					offer_id: notes.offer_id ? Number.parseInt(notes.offer_id) : null,
					coupon_id: notes.coupon_id ? Number.parseInt(notes.coupon_id) : null,
				}).catch((error) => console.error('Email queue error:', error))

				return {
					success: true,
					message: 'Success',
					data: {
						payment: {
							id: payment.id,
							amount: Number(payment.amount) / 100,
							status: payment.status,
							method: payment.method,
						},
						expDate: moment(planExpDate).format('YYYY-MM-DD'),
						planDetails: paymentDetails.id,
					},
				}
			}
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}
	private static async processFailedPayment(
		user_id: number,
		payment: {
			id: string
			amount: string
			status: string
			method: string
		},
		notes: {
			user_id: string
			plan_id: string
			amount: string
			quantity: string
			name: string
			email: string
			phone: string
			offer_id: string
			coupon_id: string
		},
	): Promise<{
		success: boolean
		message: string
		data: {
			payment: {
				id: string
				amount: number
				status: string
				method: string
			}
			expDate: string
		}
	}> {
		const currentDate = moment()
		const quantity = Number.parseInt(notes.quantity) || 1
		const planExpDate = currentDate.add(quantity, 'years').toDate()

		const existingPayment = await db.UserPaymentHistory.findOne({
			where: { payment_id: payment.id },
		})

		if (existingPayment?.get('status') === '0') {
			return {
				success: false,
				message: 'Payment failed',
				data: {
					payment: {
						id: payment.id,
						amount: Number(payment.amount) / 100,
						status: payment.status,
						method: payment.method,
					},
					expDate: moment(planExpDate).format('YYYY-MM-DD'),
				},
			}
		}

		const insertPaymentData = {
			user_id: user_id,
			plan_id: Number.parseInt(notes.plan_id) || 1,
			amount: Number(payment.amount) / 100,
			payment_id: payment.id,
			num_of_valid_years: quantity,
			plan_exp_date: planExpDate,
			email: notes.email,
			phone: notes.phone,
			billing_instrument: payment.method || '',
			offer_id: notes.offer_id ? Number.parseInt(notes.offer_id) : null,
			coupon_id: notes.coupon_id ? Number.parseInt(notes.coupon_id) : null,
			status: '0',
		}

		await db.UserPaymentHistory.create(insertPaymentData)

		return {
			success: false,
			message: 'Payment failed',
			data: {
				payment: {
					id: payment.id,
					amount: Number(payment.amount) / 100,
					status: payment.status,
					method: payment.method,
				},
				expDate: moment(planExpDate).format('YYYY-MM-DD'),
			},
		}
	}

	// WEBHOOK EVENT HANDLERS
	private static async handlePaymentCapturedWebhook(payment: {
		id: string
		order_id: string
		amount: string
		status: string
		method: string
	}): Promise<void> {
		try {
			const order = await razorpay.orders.fetch(payment.order_id)
			const notes = this.parseOrderNotes(
				order.notes as {
					user_id: string
					plan_id: string
					amount: string
					quantity: string
					name: string
					email: string
					phone: string
					offer_id: string
					coupon_id: string
				},
			)
			const user_id = Number.parseInt(notes.user_id)

			if (!user_id) {
				return
			}

			const user = await db.User.findOne({
				where: { id: user_id },
			})

			if (!user) {
				return
			}

			await this.processSuccessfulPayment(
				user_id,
				payment.order_id,
				user.get('payment_status'),
				payment,
				notes,
			)
		} catch (error) {
			logger.error('Error handling payment.captured webhook:', error)
			throw new Error('Error handling payment.captured webhook')
		}
	}
	private static async handlePaymentFailedWebhook(payment: {
		id: string
		order_id: string
		amount: string
		status: string
		method: string
	}): Promise<void> {
		try {
			const order = await razorpay.orders.fetch(payment.order_id)
			const notes = this.parseOrderNotes(
				order.notes as {
					user_id: string
					plan_id: string
					amount: string
					quantity: string
					name: string
					email: string
					phone: string
					offer_id: string
					coupon_id: string
				},
			)
			const user_id = Number.parseInt(notes.user_id)

			if (!user_id) {
				return
			}

			const user = await db.User.findOne({
				where: { id: user_id },
			})

			if (!user) {
				return
			}
			await this.processFailedPayment(
				user_id,
				{
					id: payment.id,
					amount: payment.amount.toString(),
					status: payment.status,
					method: payment.method,
				},
				notes,
			)
		} catch (error) {
			logger.error('Error handling payment.failed webhook:', error)
			throw new Error('Error handling payment.failed webhook')
		}
	}

	// EMAIL METHODS
	private static async queuePaymentEmails(notes: {
		user_id: number
		plan_id: number
		amount: number
		quantity: number
		name: string
		email: string
		phone: string
		offer_id: number | null
		coupon_id: number | null
	}): Promise<void> {
		const emailDataResult = await this.prepareEmailData(notes)
		const { emailData, adminEmailData } = emailDataResult

		// Queue user success email
		addToEmailQueue({
			to: notes.email,
			subject: `Thank you ${notes.name}, for updating your powergotha plan`,
			template:
				'planPaymentSuccess' as keyof import('../utils/emailTemplates').EmailTemplateMap,
			data: emailData,
		})

		// Queue admin notification email
		addToEmailQueue({
			to: 'powergotha@gmail.com',
			subject: `Powergotha plan update details of ${notes.name}`,
			template:
				'adminPlanPaymentSuccess' as keyof import('../utils/emailTemplates').EmailTemplateMap,
			data: adminEmailData,
		})
	}
	private static async prepareEmailData(data: {
		user_id: number
		plan_id: number
		amount: number
		quantity: number
		name: string
		email: string
		phone: string
		offer_id: number | null
		coupon_id: number | null
	}): Promise<{ emailData: EmailData; adminEmailData: AdminEmailData }> {
		let quantity
		let monthYear = 'Year'

		const [offerData, couponData] = await Promise.all([
			data.offer_id
				? db.Offer.findOne({
						where: { id: data.offer_id, deleted_at: null },
						attributes: ['additional_months', 'additional_years', 'title'],
					})
				: Promise.resolve(null),
			data.coupon_id
				? db.Coupon.findOne({
						where: { id: data.coupon_id, deleted_at: null },
						attributes: ['coupon_code'],
					})
				: Promise.resolve(null),
		])

		if (offerData) {
			if (offerData.additional_months && offerData.additional_months > 0) {
				quantity = offerData.additional_months
				monthYear = 'Months'
			}
			
			else if (offerData.additional_years && offerData.additional_years > 0) {
				quantity = offerData.additional_years
				monthYear = 'Year'
			}
		} else {
			quantity = data.quantity || 1
			monthYear = 'Year'
		}

		const baseEmailData = {
			name: data.name,
			quantity,
			amount: data.amount,
			month_year: monthYear,
		}

		const emailData: EmailData = {
			...baseEmailData,
			coupon: couponData ? 'Yes' : 'No',
			coupon_code: couponData?.coupon_code || '-',
			offer: offerData ? 'Yes' : 'No',
			offer_name: offerData?.title || '-',
		}

		const adminEmailData: AdminEmailData = {
			plan_name: '1 year premium subscription',
			email: data.email,
			phone: data.phone,
			...emailData,
		}

		return { emailData, adminEmailData }
	}
	private static async calculatePlanExpiration(
		user_id: number,
		user_payment_status: string,
		notes: {
			user_id: number
			plan_id: number
			amount: number
			quantity: number
			name: string
			email: string
			phone: string
			offer_id: number | null
			coupon_id: number | null
		},
	): Promise<Date> {
		let currentDate
		const quantity = notes.quantity || 1

		if (user_payment_status?.toLowerCase() === 'premium') {
			const latestPlan = await db.UserPayment.findOne({
				where: { user_id: user_id },
				order: [['created_at', 'DESC']],
			})

			currentDate = latestPlan ? moment(latestPlan.plan_exp_date) : moment()
		} else {
			currentDate = moment()
		}

		if (notes.offer_id) {
			const offer = await db.Offer.findOne({
				where: { id: notes.offer_id, deleted_at: null },
			})
			if (offer) {
				if (offer.additional_months) {
					return currentDate.add(offer.additional_months, 'months').toDate()
				}
				if (offer.additional_years) {
					return currentDate.add(offer.additional_years, 'years').toDate()
				}
			}
		}

		return currentDate.add(quantity, 'years').toDate()
	}
}
