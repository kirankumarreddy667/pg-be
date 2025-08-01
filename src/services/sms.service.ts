import axios, { isAxiosError } from 'axios'
import { logger } from '@/config/logger'
import { msg91Config } from '@/config/msg91.config'

// Define the shape of the MSG91 API response for type safety
interface Msg91Response {
	type: 'success' | 'error'
	message: string
}

// Define SMS template types
export interface SmsTemplate {
	template_id: string
	short_url?: string
}

// Define recipient data interface
export interface SmsRecipient {
	mobiles: string
	[key: string]: unknown
}

// Define SMS request data interface
export interface SmsRequestData {
	template_id: string
	short_url?: string
	recipients: SmsRecipient[]
}

export class SmsService {
	/**
	 * Generic method to send SMS using MSG91 API
	 * @param template The SMS template configuration
	 * @param recipients Array of recipients with their data
	 * @returns Promise<void>
	 */
	static async sendSms(
		template: SmsTemplate,
		recipients: SmsRecipient[],
	): Promise<void> {
		const options = {
			method: 'POST',
			url: msg91Config.endpoint,
			headers: {
				accept: 'application/json',
				authkey: msg91Config.authKey,
				'content-type': 'application/json',
			},
			data: {
				template_id: template.template_id,
				short_url: template.short_url || '0',
				recipients: recipients,
			} as SmsRequestData,
		}

		try {
			const response = await axios.request<Msg91Response>(options)

			logger.info('SMS sent successfully', {
				template_id: template.template_id,
				recipients_count: recipients.length,
			})

			if (response.data?.type !== 'success') {
				throw new Error(
					response.data?.message || 'MSG91 returned a non-success status.',
				)
			}
		} catch (error) {
			if (isAxiosError<Msg91Response>(error)) {
				const errorMessage =
					error.response?.data?.message || 'No specific error message from API.'
				logger.error(`Failed to send SMS via API v5. Error: ${errorMessage}`, {
					status: error.response?.status,
					data: error.response?.data,
					template_id: template.template_id,
				})
			} else {
				logger.error('Failed to send SMS. Unexpected Error:', error)
			}
			throw new Error('SMS service failed.')
		}
	}

	/**
	 * Send OTP SMS using the generic sendSms method
	 * @param phoneNumber The mobile number to send the OTP to
	 * @param otp The OTP code to be sent
	 * @returns Promise<void>
	 */
	static async sendOtp(phoneNumber: string, otp: string): Promise<void> {
		const otpTemplate: SmsTemplate = {
			template_id: '68888a05d6fc0537ae52b462',
			short_url: '0',
		}

		const recipients: SmsRecipient[] = [
			{
				mobiles: phoneNumber,
				otp: otp,
			},
		]

		return this.sendSms(otpTemplate, recipients)
	}
}
