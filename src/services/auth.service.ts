import db from '@/config/database'
import type { User, UserAttributes } from '@/models/user.model'
import {
	AppError,
	AuthenticationError,
	ValidationRequestError,
} from '@/utils/errors'
import { OtpService } from './otp.service'
import { TokenService } from './token.service'
import { UserService } from './user.service'
import { SmsService } from './sms.service'
import { getApiBaseUrl } from '@/utils/url'

export class AuthService {
	public static async userRegistration(
		userData: Pick<
			UserAttributes,
			'name' | 'phone_number' | 'password' | 'email'
		>,
	): Promise<{ user: User; otp: string; sms: unknown }> {
		const transaction = await db.sequelize.transaction()
		try {
			const existingUser = await db.User.findOne({
				where: { phone_number: userData.phone_number, deleted_at: null },
				include: [
					{
						model: db.RoleUser,
						as: 'role_users',
						where: { role_id: 2 },
					},
				],
				transaction,
			})

			if (userData.email) {
				const existingEmail = await db.User.findOne({
					where: { email: userData.email, deleted_at: null },
					transaction,
				})
				if (existingEmail) {
					throw new ValidationRequestError({
						email: ['The email has already been taken.'],
					})
				}
			}

			if (existingUser) {
				throw new ValidationRequestError({
					phone_number: ['The phone number has already been taken.'],
				})
			}

			const user = await db.User.create(
				{
					...userData,
					otp_status: false,
					provider: ['local'],
				},
				{ transaction },
			)

			// Assign the 'USER' role
			const userRole = await db.Role.findOne({
				where: { name: 'User', deleted_at: null },
				transaction,
			})
			if (!userRole) {
				await transaction.rollback()
				throw new AppError(
					"Default user role not found. Can't register user.",
					400,
				)
			}
			await db.RoleUser.create(
				{
					user_id: user.id,
					role_id: userRole.get('id'),
				},
				{ transaction },
			)

			const otp = await OtpService.generateOtp(user.id, transaction)
			await transaction.commit()

			const sms = await SmsService.sendOtp(
				userData.phone_number,
				otp.get('otp'),
			)
			return { user, otp: otp.get('otp'), sms }
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}

	public static async login(
		phone_number: string,
		password: string,
	): Promise<{
		token: string
		refresh_token: string
		user_id: number
		email: string | null
		name: string
		phone: string
		farm_name: string | null
		payment_status: 'free' | 'premium'
		plan_expires_on: Date | null
		otp_status: boolean
	}> {
		// const roleId = phone_number === '7207063149' ? 1 : 2
		const roleId = (phone_number === '7207063149' || phone_number === '9588474088') ? 1 : 2;


		const userWithRole = await db.User.findOne({
			where: { phone_number, deleted_at: null },
			include: [
				{
					model: db.RoleUser,
					as: 'role_users',
					where: { role_id: roleId },
					required: true,
				},
			],
			attributes: { include: ['password'] },
		})
		if (!userWithRole) {
			throw new AuthenticationError('The mobile number is not registered yet')
		}

		// Check password
		const isPasswordMatch = await UserService.comparePassword(
			password,
			userWithRole.get('password') || '',
		)

		if (!isPasswordMatch) {
			throw new AuthenticationError('Invalid credentials!!')
		}

		// Check OTP status
		const otpStatus = Boolean(userWithRole.get('otp_status'))

		// Get plan expiry date
		let planExpDate: Date | null = null
		if (userWithRole.get('payment_status') !== 'free') {
			const planPayment = await db.UserPayment.findOne({
				where: { user_id: userWithRole.get('id'), deleted_at: null },
				order: [['created_at', 'DESC']],
			})
			planExpDate = planPayment?.get('plan_exp_date') || null
		}

		// Generate token with proper issuer
		const token = await TokenService.generateAccessToken(
			{
				id: userWithRole.get('id'),
			},
			`${getApiBaseUrl()}/login`,
		)

		// Generate refresh token and save in remember_token column
		const refreshToken = await TokenService.generateRefreshToken({
			id: userWithRole.get('id'),
		})

		await db.User.update(
			{ remember_token: refreshToken },
			{ where: { id: userWithRole.get('id') } },
		)

		return {
			token,
			refresh_token: refreshToken,
			user_id: userWithRole.get('id'),
			email: userWithRole?.get('email') || null,
			name: userWithRole.get('name'),
			phone: userWithRole.get('phone_number'),
			farm_name: userWithRole?.get('farm_name') || null,
			payment_status: userWithRole.get('payment_status'),
			plan_expires_on: planExpDate,
			otp_status: otpStatus,
		}
	}

	public static async verifyOtp(
		userId: number,
		otp: string,
	): Promise<{ success: boolean; message: string }> {
		const transaction = await db.sequelize.transaction()
		try {
			const user = await db.User.findOne({
				where: { id: userId, deleted_at: null },
				transaction,
			})
			if (!user) {
				throw new ValidationRequestError({
					user_id: ['The selected user id is invalid.'],
				})
			}

			const otpInstance = await db.Otp.findOne({
				where: {
					user_id: userId,
					otp,
				},
			})

			if (!otpInstance) {
				throw new AppError('Not a valid OTP', 400)
			}

			const createdAt = otpInstance.get('created_at')

			const result = await OtpService.verifyOtp(
				userId,
				otp,
				createdAt as Date,
				transaction,
			)
			if (result.success) {
				await db.User.update(
					{ otp_status: true },
					{ where: { id: userId }, transaction },
				)
			}

			await transaction.commit()
			return result
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}

	public static async resendOtp(
		phone: string,
		user_id: number,
	): Promise<{
		id: number
		otp: string
		user_id: number
		created_at: string | null
		updated_at: string | null
	}> {
		const transaction = await db.sequelize.transaction()
		try {
			const otp = await OtpService.generateOtp(user_id, transaction)
			await SmsService.sendOtp(phone, otp.get('otp'))

			await transaction.commit()

			const data = {
				id: otp.id,
				otp: otp.get('otp'),
				user_id: otp.get('user_id'),
				created_at: otp.get('created_at')
					? (otp.get('created_at') as Date)
							.toISOString()
							.slice(0, 19)
							.replace('T', ' ')
					: null,
				updated_at: otp.get('updated_at')
					? (otp.get('updated_at') as Date)
							.toISOString()
							.slice(0, 19)
							.replace('T', ' ')
					: null,
			}
			return data
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}

	static async forgotPassword(
		otp: string,
		password: string,
		user_id: number,
	): Promise<void> {
		const transaction = await db.sequelize.transaction()
		try {
			const expireTime = 1800

			// Find OTP and check if it's valid
			const otpData = await db.Otp.findOne({
				where: {
					otp: otp,
					user_id,
				},
				attributes: [
					'user_id',
					'created_at',
					[
						db.sequelize.literal('TIME_TO_SEC(TIMEDIFF(NOW(), created_at))'),
						'opt_created',
					],
				],
				transaction,
			})

			if (!otpData) {
				throw new AppError('Not a valid OTP', 400)
			}

			// Check if OTP is expired
			const optCreated = otpData.get('opt_created') as number
			if (optCreated >= expireTime) {
				throw new AppError('OTP code expired', 400)
			}

			// Delete the OTP after successful verification
			await db.Otp.destroy({
				where: {
					user_id,
					otp: otp,
				},
				transaction,
			})

			// Update user password using UserService
			await UserService.updatePassword(user_id, password, transaction)

			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}

	/**
	 * Handles OAuth callback logic: builds token and user response
	 * @param user The authenticated user instance
	 * @returns An object with token and user
	 */
	public static async handleOAuthCallback(
		user: User,
	): Promise<{ token: string; user: User }> {
		if (!user) {
			throw new AuthenticationError('Unauthorized')
		}
		const token = await TokenService.generateAccessToken(
			{ id: user.id },
			`${getApiBaseUrl()}/login`,
		)

		return {
			token,
			user,
		}
	}

	public static async refreshToken(
		oldRefreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		// Verify the token
		const decoded = await TokenService.verifyRefreshToken(oldRefreshToken)

		const sub = decoded?.sub
		if (!sub || (typeof sub !== 'string' && typeof sub !== 'number')) {
			throw new Error('Invalid token payload')
		}

		const userId = Number(sub)
		if (Number.isNaN(userId)) {
			throw new TypeError('Invalid user ID in token')
		}

		// Find user with matching remember_token
		const user = await db.User.findOne({
			where: { id: userId, remember_token: oldRefreshToken, deleted_at: null },
		})
		if (!user) throw new Error('Refresh token invalid or rotated')

		// Convert to plain object to access fields
		const userData = user.toJSON()

		// 3. Generate new tokens
		const newAccessToken = await TokenService.generateAccessToken({
			id: userData.id!,
		})
		const newRefreshToken = await TokenService.generateRefreshToken({
			id: userData.id!,
		})

		// 4. Rotate refresh token in DB
		await db.User.update(
			{ remember_token: newRefreshToken },
			{ where: { id: userData.id } },
		)
		return { accessToken: newAccessToken, refreshToken: newRefreshToken }
	}

	public static async logout(userId: number): Promise<boolean> {
		await db.User.update({ remember_token: null }, { where: { id: userId } })
		return true
	}
}
