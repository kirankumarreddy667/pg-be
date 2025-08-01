import { Otp } from '@/models/otp.model'
import { Transaction } from 'sequelize'
import { randomInt } from 'crypto'
import db from '@/config/database'

export class OtpService {
	static async generateOtp(
		userId: number,
		transaction?: Transaction,
	): Promise<Otp> {
		const otpCode = randomInt(100000, 1000000).toString()
		// Always delete any existing OTP for this user
		await Otp.destroy({ where: { user_id: userId }, transaction })
		// Create a new OTP
		const otp = await Otp.create(
			{ user_id: userId, otp: otpCode },
			{ transaction },
		)
		return otp
	}

	static async verifyOtp(
		userId: number,
		otpCode: string,
		createdAt: Date,
		transaction?: Transaction,
	): Promise<{ success: boolean; message: string }> {
		const OTP_EXPIRE_SECONDS = 1800
		if (db.Otp.isExpired(createdAt, OTP_EXPIRE_SECONDS)) {
			return { success: false, message: 'OTP code expired' }
		}
		await db.Otp.destroy({
			where: { user_id: userId, otp: otpCode },
			transaction,
		})
		// Note: User update is now handled in the calling method with transaction
		return { success: true, message: 'OTP matched successfully' }
	}

	static async deleteOtp(
		userId: number,
		otpCode: string,
		transaction?: Transaction,
	): Promise<void> {
		await Otp.destroy({ where: { user_id: userId, otp: otpCode }, transaction })
	}
}
