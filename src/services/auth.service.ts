import db from '@/config/database'
import type { User, UserAttributes } from '@/models/user.model'
import type { Role } from '@/models/role.model'
import {
	AppError,
	AuthenticationError,
	AuthorizationError,
	ConflictError,
	NotFoundError,
	DatabaseError,
} from '@/utils/errors'
import { OtpService } from './otp.service'
import { TokenService } from './token.service'
import { UserService } from './user.service'
import { SmsService } from './sms.service'
import { Transaction } from 'sequelize'

export class AuthService {
	public static async userRegistration(
		userData: Pick<UserAttributes, 'name' | 'phone_number' | 'password'>,
	): Promise<{ user: User; otp: string }> {
		let transaction: Transaction | undefined
		try {
			transaction = await db.sequelize.transaction()
			const existingUser = await db.User.findOne({
				where: { phone_number: userData.phone_number },
				transaction,
			})

			if (existingUser) {
				await transaction.rollback()
				transaction = undefined
				throw new ConflictError('Phone number already registered.')
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
				where: { name: 'User' },
				transaction,
			})
			if (userRole) {
				await db.RoleUser.create(
					{
						user_id: user.id,
						role_id: userRole.get('id'),
					},
					{ transaction },
				)
			} else {
				await transaction.rollback()
				throw new AppError(
					"Default user role not found. Can't register user.",
					500,
				)
			}

			const otp = await OtpService.generateOtp(user.id, transaction)

			await transaction.commit()
			await SmsService.sendOtpLegacy(userData.phone_number, otp.get('otp'))
			return { user, otp: otp.get('otp') }
		} catch (error) {
			if (transaction) await transaction.rollback()
			if (error instanceof AppError) throw error
			throw new DatabaseError(
				'Error during user registration.',
				error instanceof Error ? [error.message] : [],
			)
		}
	}

	public static async login(
		phone_number: string,
		password: string,
	): Promise<{
		token: string
		user_id: number
		email: string | undefined
		name: string
		phone: string
		farm_name: string | undefined
		payment_status: 'free' | 'paid' | undefined
		plan_expires_on: Date | null
		otp_status: boolean
	}> {
		try {
			const user = await db.User.findOne({
				where: { phone_number },
				attributes: { include: ['password'] },
			})

			if (!user) {
				throw new AuthenticationError('mobile number is not registered')
			}

			if (!user.get('otp_status')) {
				throw new AuthenticationError('Please verify OTP before logging in.')
			}

			const isPasswordMatch = await UserService.comparePassword(
				password,
				user.get('password') || '',
			)

			if (!isPasswordMatch) {
				throw new AuthenticationError('Invalid credentials.')
			}

			const roles: Role[] = await UserService.getUserRoles(user.get('id'))
			const roleNames = roles.map((role: Role) => role.get('name'))

			if (!roleNames.includes('User') && !roleNames.includes('SuperAdmin')) {
				throw new AuthorizationError('User does not have a valid role.')
			}

			await user.save()

			const token = await TokenService.generateAccessToken({
				id: user.get('id'),
			})

			return {
				token,
				user_id: user.get('id'),
				email: user.get('email'),
				name: user.get('name'),
				phone: user.get('phone_number'),
				farm_name: user.get('farm_name'),
				payment_status: user.get('payment_status'),
				plan_expires_on: null,
				otp_status: !!user.get('otp_status'),
			}
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new DatabaseError(
				'Login failed',
				error instanceof Error ? [error.message] : [],
			)
		}
	}

	public static async verifyOtp(userId: number, otp: string): Promise<void> {
		try {
			const user = await db.User.findByPk(userId)
			if (!user) {
				throw new NotFoundError('User not found.')
			}
			const isValid = await OtpService.verifyOtp(userId, otp)
			if (!isValid) {
				throw new AppError('Invalid or expired OTP.', 400)
			}

			user.set('otp_status', true) // Set verified
			await user.save()
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new DatabaseError(
				'Error verifying OTP.',
				error instanceof Error ? [error.message] : [],
			)
		}
	}

	public static async resendOtp(userId: number): Promise<void> {
		try {
			const user = await db.User.findByPk(userId)
			if (!user) {
				throw new NotFoundError('User not found.')
			}

			const newOtp = await OtpService.generateOtp(userId)
			await SmsService.sendOtpLegacy(
				user.get('phone_number'),
				newOtp.get('otp'),
			)
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new DatabaseError(
				'Error resending OTP.',
				error instanceof Error ? [error.message] : [],
			)
		}
	}

	static async forgotPassword(phoneNumber: string): Promise<void> {
		// Find user by phone number and role_id = 2 (standard User)
		const user: User | null = await UserService.findUserByPhone(phoneNumber)
		if (!user) {
			throw new NotFoundError("We can't find a user with that phone number.")
		}

		// Generate and save OTP
		const otp = await OtpService.generateOtp(user.get('id'))

		// Send OTP via SMS
		await SmsService.sendOtpLegacy(user.get('phone_number'), otp.get('otp'))
	}

	static async resetPassword(
		phoneNumber: string,
		otp: string,
		password: string,
	): Promise<void> {
		// Find user by phone number
		const user: User | null = await UserService.findUserByPhone(phoneNumber)
		if (!user) {
			// It's generally better not to reveal if a user exists
			throw new NotFoundError('Invalid OTP or phone number.')
		}

		// Verify OTP
		const isValidOtp = await OtpService.verifyOtp(user.get('id'), otp)

		if (!isValidOtp) {
			throw new NotFoundError('Invalid OTP or phone number.')
		}

		// Update password
		await UserService.updatePassword(user.get('id'), password)

		// Invalidate the OTP
		await OtpService.deleteOtp(user.get('id'), otp)
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
		const token = await TokenService.generateAccessToken({ id: user.id })
		return {
			token,
			user,
		}
	}

	public static async buildOAuthResponse(
		user: User,
	): Promise<{ token: string; user: User }> {
		const token = await TokenService.generateAccessToken({ id: user.id })
		return { token, user }
	}
}
