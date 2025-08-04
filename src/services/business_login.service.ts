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
		user_id: number
		email: string | undefined
		name: string
		phone: string
		business_account_name?: string
		business_address?: string
		business_outlet_id?: number
	}> {
		// Check if user exists and has business role (role_id = 3)
		const user = await User.findOne({
			include: [
				{
					model: RoleUser,
					as: 'role_users',
					include: [
						{
							model: Role,
							as: 'Role',
							where: { id: 3 }, // Business role
						},
					],
				},
			],
			where: {
				phone_number,
			},
		})

		if (!user) {
			throw new AuthorizationError("Account doesn't exist.")
		}

		// Check if user has business role
		const hasBusinessRole = await RoleUser.findOne({
			where: {
				user_id: user.get('id'),
				role_id: 3, // Business role
			},
		})

		if (!hasBusinessRole) {
			throw new AuthenticationError("Account doesn't exist.")
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

		// Get business outlet information
		const businessOutlet = await BusinessOutlet.findOne({
			where: {
				assign_to: user.get('id'),
			},
		})

		// Generate JWT token
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

		return {
			token,
			user_id: user.get('id'),
			email: user.get('email'),
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
							where: { id: 3 }, // Business role
						},
					],
				},
			],
			where: {
				email,
			},
		})

		if (!user) {
			throw new AppError('Please enter your registered email address.', 400)
		}

		// Check if user has business role
		const hasBusinessRole = await RoleUser.findOne({
			where: {
				user_id: user.get('id'),
				role_id: 3, // Business role
			},
		})

		if (!hasBusinessRole) {
			throw new AuthenticationError("Account doesn't exist.")
		}

		const password = generateRandomPassword(8)
		await user.update({ password: password })
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
		const user = await User.findByPk(userId)
		if (!user) throw new AppError('User not found', 400)

		const isMatch = await UserService.comparePassword(
			old_password,
			user.get('password') || '',
		)
		if (!isMatch) throw new AppError('Not a valid old Password', 400)
		await user.update({ password: new_password })
	}
}
