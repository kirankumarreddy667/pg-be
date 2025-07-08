import { User } from '@/models/user.model'
import bcrypt from 'bcryptjs'
import { TokenService } from './token.service'
import { AuthorizationError } from '@/utils/errors'
import { generateRandomPassword } from '@/utils/password'
import { addToEmailQueue } from '@/queues/email.queue'
import { RoleUser } from '@/models/role_user.model'
import { Role } from '@/models/role.model'
import { UserService } from './user.service'

export class BusinessLoginService {
	static async businessUserLogin(
		email: string,
		password: string,
	): Promise<{
		token: string
		user_id: number
		email: string | undefined
		name: string
		phone: string
		farm_name: string | undefined
		payment_status: 'free' | 'premium'
		plan_expires_on: Date | null
		otp_status: boolean
	}> {
		const user = await User.findOne({ where: { email } })
		if (!user) {
			throw new AuthorizationError('Invalid email or password')
		}

		if (!user.get('password')) {
			throw new AuthorizationError('Invalid email or password')
		}

		const isMatch = await UserService.comparePassword(
			password,
			user.get('password') || '',
		)

		if (!isMatch) {
			throw new AuthorizationError('Invalid email or password')
		}
		const token = await TokenService.generateAccessToken({ id: user.get('id') })
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
	}

	static async businessForgotPassword(email: string): Promise<void> {
		const user = await User.findOne({ where: { email } })
		if (!user) throw new AuthorizationError('No user found with this email')
		const businessRole = await Role.findOne({ where: { name: 'Business' } })
		if (!businessRole) throw new AuthorizationError('Business role not found')
		const hasBusinessRole = await RoleUser.findOne({
			where: { user_id: user.get('id'), role_id: businessRole.get('id') },
		})
		if (!hasBusinessRole)
			throw new AuthorizationError('User is not a business user')
		const password = generateRandomPassword(8)
		await user.update({ password: password })
		addToEmailQueue({
			to: user.get('email') || '',
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
		if (!user) throw new AuthorizationError('User not found')
		if (!user.get('password'))
			throw new AuthorizationError('User has no password set')
		const isMatch = await UserService.comparePassword(
			old_password,
			user.get('password') || '',
		)
		if (!isMatch) throw new AuthorizationError('Not a valid old Password')
		await user.update({ password: new_password })
	}
}
