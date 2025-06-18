import { Request, Response, NextFunction } from 'express'
import { TokenService } from '../services/token.service'
import { authConfig } from '../config/auth.config'
import { AuthenticatedRequest, UserRole } from '../types'
import { AuthenticationError } from '../utils/errors'
import RESPONSE from '@/utils/response'
import { AuthService } from '../services/auth.service'
import { generateCsrfTokenMiddleware } from '../middlewares/auth.middleware'

type AsyncRequestHandler = (
	req: Request | AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => Promise<void> | void

interface RegisterBody {
	email: string
	password: string
	username: string
	firstName: string
	lastName: string
}

// interface LoginBody {
// 	email: string
// 	password: string
// }

export class AuthController {
	static register: AsyncRequestHandler = async (req, res, next) => {
		try {
			const { email, password, username, firstName, lastName } =
				req.body as RegisterBody

			// Register user and get tokens
			const { user, accessToken, refreshToken } = await AuthService.register({
				email,
				password,
				username,
				firstName,
				lastName,
				role: UserRole.USER, // Default role for new users
			})

			// Set refresh token in HTTP-only cookie
			res.cookie('refreshToken', refreshToken, {
				...authConfig.cookie,
				maxAge: authConfig.cookie.maxAge,
			})

			// Generate CSRF token after successful registration
			generateCsrfTokenMiddleware(req, res, () => {
				RESPONSE.SuccessResponse(res, 201, {
					message: 'Registration successful',
					data: {
						user,
						accessToken,
					},
				})
			})
		} catch {
			next(
				new AuthenticationError('Registration failed', [
					'Failed to create user',
				]),
			)
		}
	}

	// static login: AsyncRequestHandler = async (req, res, next) => {
	// 	try {
	// 		const { email } = req.body as LoginBody
	// 		// Password is used in the TODO comment for future implementation
	// 		// const { password } = req.body as LoginBody

	// 		// TODO: Implement your user authentication logic here
	// 		// This is a placeholder - you should validate against your database
	// 		const user: User = {
	// 			id: 1,
	// 			email,
	// 			role: UserRole.USER,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		}

	// 		// Generate tokens
	// 		const accessToken = await TokenService.generateAccessToken(user)
	// 		const refreshToken = await TokenService.generateRefreshToken(user)

	// 		// Set refresh token in HTTP-only cookie
	// 		res.cookie('refreshToken', refreshToken, {
	// 			...authConfig.cookie,
	// 			maxAge: authConfig.cookie.maxAge,
	// 		})

	// 		RESPONSE.SuccessResponse(res, 200, {
	// 			message: 'Login successful',
	// 			data: {
	// 				user,
	// 				accessToken,
	// 			},
	// 		})
	// 	} catch {
	// 		next(new AuthenticationError('Login failed', ['Invalid credentials']))
	// 	}
	// }

	// static logout: AsyncRequestHandler = async (req, res, next) => {
	// 	try {
	// 		const authHeader = req.headers.authorization
	// 		if (authHeader?.startsWith('Bearer ')) {
	// 			const token = authHeader.split(' ')[1]
	// 			await TokenService.revokeToken(token)
	// 		}

	// 		const refreshToken = req.cookies.refreshToken as string
	// 		if (refreshToken) {
	// 			await TokenService.revokeToken(refreshToken)
	// 		}

	// 		// Clear the refresh token cookie
	// 		res.clearCookie('refreshToken', {
	// 			httpOnly: true,
	// 			secure: authConfig.cookie.secure,
	// 			sameSite: authConfig.cookie.sameSite,
	// 		})

	// 		RESPONSE.SuccessResponse(res, 200, {
	// 			message: 'Logout successful',
	// 			data: {},
	// 		})
	// 	} catch {
	// 		next(
	// 			new AuthenticationError('Logout failed', ['Failed to clear session'])
	// 		)
	// 	}
	// }

	static refreshToken: AsyncRequestHandler = async (req, res, next) => {
		try {
			const user = (req as AuthenticatedRequest).user
			if (!user) {
				throw new AuthenticationError('User not found', ['Invalid session'])
			}

			// Revoke old refresh token
			const oldRefreshToken = req.cookies.refreshToken as string
			if (oldRefreshToken) {
				TokenService.revokeToken(oldRefreshToken)
			}

			// Generate new tokens
			const accessToken = await TokenService.generateAccessToken(user)
			const refreshToken = await TokenService.generateRefreshToken(user)

			// Set new refresh token in HTTP-only cookie
			res.cookie('refreshToken', refreshToken, {
				...authConfig.cookie,
				maxAge: authConfig.cookie.maxAge,
			})

			// Generate new CSRF token
			generateCsrfTokenMiddleware(req, res, () => {
				RESPONSE.SuccessResponse(res, 200, {
					message: 'Token refresh successful',
					data: {
						accessToken,
					},
				})
			})
		} catch {
			next(
				new AuthenticationError('Token refresh failed', [
					'Invalid refresh token',
				]),
			)
		}
	}
}
