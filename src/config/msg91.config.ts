import { env } from './env'

export const MSG91_OTP_ENDPOINT = 'https://api.msg91.com/api/v5/otp'

export const msg91Config = {
	authKey: env.MSG91_AUTH_KEY,
	templateId: env.MSG91_TEMPLATE_ID,
	senderId: env.MSG91_SENDER_ID,
	otpEndpoint: MSG91_OTP_ENDPOINT,
}
