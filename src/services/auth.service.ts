import { User, UserAttributes } from '@/models/user.model'
import { AppError } from '@/utils/appError'
import { TokenService } from './token.service'
import { UserRole } from '@/types/index'

export class AuthService {
	public static async register(
		userData: Omit<UserAttributes, 'id' | 'isActive' | 'lastLogin'>,
	): Promise<{
		user: {
			id: number
			email: string
			firstName: string
			lastName: string
			role: UserRole
		}
		accessToken: string
		refreshToken: string
	}> {
		try {
			// Check if user already exists
			const existingUser = await User.findOne({
				where: { email: userData.email },
			})
			if (existingUser) {
				throw new AppError('Email already registered', 400)
			}

			// Create new user with default values
			const user = await User.create({
				...userData,
				isActive: true,
			})

			const signedUser = {
				id: user.id,
				email: user.email,
				role: user.role,
			}

			// Generate tokens using TokenService
			const accessToken = await TokenService.generateAccessToken(signedUser)
			const refreshToken = await TokenService.generateRefreshToken(signedUser)

			return {
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
				},
				accessToken,
				refreshToken,
			}
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new AppError('Error creating user', 500)
		}
	}
}
