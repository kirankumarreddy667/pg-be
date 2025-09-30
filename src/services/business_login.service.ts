import { User } from '@/models/user.model'
import { TokenService } from './token.service'
import {
	AuthorizationError,
	AppError,
	AuthenticationError,
} from '@/utils/errors'
import { generateRandomPassword } from '@/utils/password'
import { addToEmailQueue } from '@/queues/email.queue'
import { RoleUser } from '@/models/role_user.model'
import { Role } from '@/models/role.model'
import { UserService } from './user.service'
import { getApiBaseUrl } from '@/utils/url'
import { BusinessOutlet } from '@/models/business_outlet.model'

export class BusinessLoginService {
	static async businessUserLogin(
		phone_number: string,
		password: string,
	): Promise<{
		token: string
		refresh_token: string
		user_id: number
		email: string | null
		name: string
		phone: string
		business_account_name?: string
		business_address?: string
		business_outlet_id?: number
	}> {
		const user = await User.findOne({
			include: [
				{
					model: RoleUser,
					as: 'role_users',
					include: [
						{
							model: Role,
							as: 'Role',
							where: { id: 3, deleted_at: null }, // Business role
						},
					],
				},
			],
			where: {
				phone_number,
				deleted_at: null,
			},
		})

		if (!user) {
			throw new AuthorizationError("Account doesn't exist.")
		}

		if (!user.get('password')) {
			throw new AuthenticationError('Invalid credentials!!')
		}

		const isMatch = await UserService.comparePassword(
			password,
			user.get('password') || '',
		)

		if (!isMatch) {
			throw new AuthorizationError('Invalid credentials!!')
		}

		const businessOutlet = await BusinessOutlet.findOne({
			where: {
				assign_to: user.get('id'),
				deleted_at: null,
			},
		})

		let token: string
		try {
			token = await TokenService.generateAccessToken(
				{ id: user.get('id') },
				`${getApiBaseUrl()}/business/login`,
			)
		} catch (error) {
			if (error instanceof AuthenticationError) {
				throw new AuthenticationError('Invalid credentials!!')
			}
			throw error
		}

		// --- New refresh token generation ---
		const refresh_token = await TokenService.generateRefreshToken({
			id: user.get('id'),
		})

		// Save refresh token in DB
		await User.update(
			{ remember_token: refresh_token },
			{ where: { id: user.get('id') } },
		)

		return {
			token,
			refresh_token,
			user_id: user.get('id'),
			email: user.get('email') || null,
			name: user.get('name'),
			phone: user.get('phone_number'),
			business_account_name: businessOutlet?.get('business_name'),
			business_address: businessOutlet?.get('business_address'),
			business_outlet_id: businessOutlet?.get('id'),
		}
	}

	static async businessForgotPassword(email: string): Promise<void> {
		const user = await User.findOne({
			include: [
				{
					model: RoleUser,
					as: 'role_users',
					include: [
						{
							model: Role,
							as: 'Role',
							where: { id: 3, deleted_at: null },
						},
					],
				},
			],
			where: {
				email,
				deleted_at: null,
			},
		})

		if (!user) {
			throw new AppError('Please enter your registered email address.', 400)
		}

		const password = generateRandomPassword(8)
		await User.update({ password }, { where: { id: user.get('id') } })
		addToEmailQueue({
			to: email,
			subject: 'Login Details',
			template: 'businessCredentials',
			data: {
				name: user.get('name'),
				phone: user.get('phone_number'),
				password,
			},
		})
	}

	static async changePassword(
		userId: number,
		old_password: string,
		new_password: string,
	): Promise<void> {
		const user = await User.findOne({
			where: { id: userId, deleted_at: null },
		})
		if (!user) throw new AppError('User not found', 400)

		const isMatch = await UserService.comparePassword(
			old_password,
			user.get('password') || '',
		)
		if (!isMatch) throw new AppError('Not a valid old Password', 400)
		await user.update({ password: new_password })
	}
}
