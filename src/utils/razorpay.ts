import Razorpay from 'razorpay'
import { razorpayConfig } from '@/config/razorpay.config'

const razorpay = new Razorpay({
	key_id: razorpayConfig.key_id,
	key_secret: razorpayConfig.key_secret,
})
export interface RazorpayCallbackParams {
	razorpay_payment_id?: string
	razorpay_payment_link_id?: string
	razorpay_signature?: string
	plan_id?: number | string
	quantity?: number | string
	offer_id?: number | string
	coupon_id?: number | string
	amount?: number | string
}

export interface CreatePaymentLinkResponse {
	id: string
	short_url: string
	status: string
}

export const createPaymentLink = async (options: {
	amount: number
	user: { name: string; email: string; phone: string }
	plan_id: number
	notes: {
		user_id: string
		plan_id: string
		amount: string
		quantity: string
		phone: string
		email: string
		offer_id: string
		coupon_id: string
		name: string
	}
}): Promise<CreatePaymentLinkResponse> => {
	const paymentLink = await razorpay.paymentLink.create({
		amount: options.amount,
		currency: 'INR',
		description: `Plan purchase (ID: ${options.plan_id})`,
		customer: {
			name: options.user.name,
			email: options.user.email,
			contact: options.user.phone,
		},
		notify: {
			sms: false,
			email: true,
		},
		reminder_enable: true,
		callback_method: 'get',
		notes: options.notes,
	})

	return {
		id: paymentLink.id,
		short_url: paymentLink.short_url,
		status: paymentLink.status,
	}
}
export const fetchPayment = async (paymentId: string): Promise<unknown> => {
	return await razorpay.payments.fetch(paymentId)
}
export default razorpay
