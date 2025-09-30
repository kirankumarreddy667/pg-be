import { config } from 'dotenv'
config()

export const razorpayConfig = {
	key_id: process.env.RAZORPAY_KEY_ID || '',
	key_secret: process.env.RAZORPAY_KEY_SECRET || '',
	callback_url: process.env.RAZORPAY_CALLBACK_URL || '',
	currency: 'INR',
} as const

if (!razorpayConfig.key_id || !razorpayConfig.key_secret) {
	throw new Error('Missing Razorpay config values')
}
