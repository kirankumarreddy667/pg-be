import { env } from './env'

export const msg91Config = {
	authKey: env.MSG91_AUTH_KEY,
	templateId: env.MSG91_TEMPLATE_ID,
	senderId: env.MSG91_SENDER_ID,
	endpoint: env.MSG91_ENDPOINT,
}
