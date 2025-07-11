import axios, { isAxiosError } from 'axios'
import { logger } from '@/config/logger'
import { msg91Config, MSG91_OTP_ENDPOINT } from '@/config/msg91.config'

// Define the shape of the MSG91 API response for type safety
interface Msg91Response {
	type: 'success' | 'error'
	message: string
}

export class SmsService {
	/**
	 * Sends an OTP using the dedicated MSG91 OTP API.
	 * @param phoneNumber The mobile number to send the OTP to (without country code).
	 * @param otp The OTP code to be sent.
	 */
	static async sendOtp(phoneNumber: string, otp: string): Promise<void> {
		// Ensure the phone number is correctly formatted with the country code

		const payload = {
			DLT_TE_ID: msg91Config.templateId,
			message: `Your Powergotha OTP:${otp}`,
			mobile: phoneNumber, // must include country code, e.g., 919999999999
			authkey: msg91Config.authKey,
			sender: msg91Config.senderId,
			otp: otp,
		}

		// In non-production environments, we can just log the OTP
		// if (env.NODE_ENV !== 'production') {
		// 	logger.info(`====================\nOTP for ${phoneNumber}: ${otp}\n====================`)
		// 	return
		// }

		try {
			logger.info(
				`Sending OTP via MSG91 API v5. Payload: ${JSON.stringify(payload)}`,
			)

			const response = await axios.post<Msg91Response>(
				MSG91_OTP_ENDPOINT,
				payload,
				{
					headers: { 'Content-Type': 'application/json' },
				},
			)

			logger.info(
				`Response from MSG91 API v5. Status: ${response.status}. Data:`,
				response.data,
			)

			if (response.data?.type !== 'success') {
				throw new Error(
					response.data?.message || 'MSG91 returned a non-success status.',
				)
			}
		} catch (error) {
			if (isAxiosError<Msg91Response>(error)) {
				const errorMessage =
					error.response?.data?.message || 'No specific error message from API.'
				logger.error(`Failed to send OTP via API v5. Error: ${errorMessage}`, {
					status: error.response?.status,
					data: error.response?.data,
				})
			} else {
				logger.error('Failed to send OTP. Unexpected Error:', error)
			}
			throw new Error('SMS service failed.')
		}
	}

	/**
	 * Sends an OTP using the legacy MSG91 OTP API.
	 * @param phoneNumber The mobile number to send the OTP to (with country code, e.g., 919999999999).
	 * @param otp The OTP code to be sent.
	 */
	static async sendOtpLegacy(phoneNumber: string, otp: string): Promise<void> {
		const params = {
			country: '91',
			sender: msg91Config.senderId,
			route: '4',
			mobiles: phoneNumber,
			authkey: msg91Config.authKey,
			encrypt: '',
			message: `Your Powergotha OTP:${otp}`,
			response: 'json',
			DLT_TE_ID: msg91Config.templateId,
		}
		try {
			logger.info(
				`Sending OTP via MSG91 Legacy HTTP API. Params: ${JSON.stringify(params)}`,
			)
			const response = await axios.get<Msg91Response>(
				'http://api.msg91.com/api/sendhttp.php',
				{ params },
			)
			logger.info(
				`Response from MSG91 Legacy HTTP API. Status: ${response.status}. Data:`,
				response.data,
			)
			if (response.data?.type && response.data.type !== 'success') {
				throw new Error(
					`MSG91 Legacy HTTP API did not return success: ${JSON.stringify(response.data)}`,
				)
			}
		} catch (error) {
			logger.error('Failed to send OTP via legacy MSG91 HTTP API:', error)
			throw new Error('Legacy SMS service failed.')
		}
	}
}
