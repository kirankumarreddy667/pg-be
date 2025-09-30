export interface PaymentData {
	plan_id: number
	coupon_id?: number
	offer_id?: number
	amount: number
	quantity?: number
}

export interface PaymentVerify {
	razorpay_order_id: string
	razorpay_payment_id: string
	razorpay_signature: string
}
