import { Otp } from '@/models/otp.model'
import { TIME } from '@/constants/time'
import { Transaction } from 'sequelize'

export class OtpService {
	static async generateOtp(
		userId: number,
		transaction?: Transaction,
	): Promise<Otp> {
		const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
		// Always delete any existing OTP for this user
		await Otp.destroy({ where: { user_id: userId }, transaction })
		// Create a new OTP
		const otp = await Otp.create({ user_id: userId, otp: otpCode }, { transaction })
		return otp
	}

	static async verifyOtp(userId: number, otpCode: string): Promise<boolean> {
		const otpInstance = await Otp.findOne({
			where: {
				user_id: userId,
				otp: otpCode,
			},
		})

		if (!otpInstance) {
			return false
		}

		return !this.isOtpExpired(otpInstance)
	}

	private static isOtpExpired(otp: Otp): boolean {
		const OTP_EXPIRATION_MINUTES = 10
		const expirationTimeInMillis = OTP_EXPIRATION_MINUTES * TIME.MINUTE

		if (!otp.get('created_at')) {
			return true
		}

		const createdAt = new Date(otp.get('created_at')).getTime()
		const now = Date.now()

		return now - createdAt > expirationTimeInMillis
	}

	static async deleteOtp(
		userId: number,
		otpCode: string,
		transaction?: Transaction,
	): Promise<void> {
		await Otp.destroy({ where: { user_id: userId, otp: otpCode }, transaction })
	}
}
