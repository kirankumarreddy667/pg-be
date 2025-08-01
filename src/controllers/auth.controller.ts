import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { AuthService } from '@/services/auth.service'
import { User } from '@/models/user.model'
import { BusinessLoginService } from '@/services/business_login.service'
import db from '@/config/database'
import { UserService } from '@/services/user.service'
import { ValidationError, ValidationRequestError } from '@/utils/errors'

interface UserRegistrationBody {
	name: string
	phone_number: string
	password: string
	email?: string
}

interface VerifyOtpBody {
	user_id: number
	otp: string
}

interface LoginBody {
	phone_number: string
	password: string
}

interface ForgotPasswordBody {
	phone_number: string
	otp: string
	password: string
}

export class AuthController {
	public static readonly userRegistration: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { name, phone_number, password, email } =
				req.body as UserRegistrationBody
			const { user, otp, sms } = await AuthService.userRegistration({
				name,
				phone_number,
				password,
				email,
			})
			RESPONSE.SuccessResponse(res, 200, {
				message:
					'Success. Please verify the otp sent to your registered phone number',
				data: {
					otp: otp,
					user_id: user.id,
					phone_number: phone_number,
					sms_response: sms || '',
				},
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly verifyOtp: RequestHandler = async (req, res, next) => {
		try {
			const { user_id, otp } = req.body as VerifyOtpBody
			const result = await AuthService.verifyOtp(user_id, otp)
			if (!result.success) {
				return RESPONSE.FailureResponse(res, 400, {
					message: result.message,
					data: [],
				})
			}
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly resendOtp: RequestHandler = async (req, res, next) => {
		try {
			const { phone } = req.params
			if (!phone) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Phone number is required',
					data: [],
				})
			}

			const user = await db.User.findOne({ where: { phone_number: phone } })
			if (!user) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'User not found',
					data: [],
				})
			}
			const otp = await AuthService.resendOtp(phone, user.get('id'))
			RESPONSE.SuccessResponse(res, 200, {
				message: 'success',
				data: otp,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly login: RequestHandler = async (req, res, next) => {
		try {
			const { phone_number, password } = req.body as LoginBody
			const loginData = await AuthService.login(phone_number, password)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success.',
				data: loginData,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly forgotPassword: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { phone_number, otp, password } = req.body as ForgotPasswordBody
			const user: User | null = await UserService.findUserByPhone(phone_number)
			if (!user) {
				throw new ValidationRequestError({
					phone_number: ['The selected phone number is invalid.'],
				})
			}

			await AuthService.forgotPassword(otp, password, user.get('id'))
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Password changed successfully',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly googleOAuthCallback: RequestHandler = async (
		req,
		res,
	) => {
		const user = req.user as User
		try {
			const { token, user: userData } =
				await AuthService.handleOAuthCallback(user)

			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: {
					token,
					user: {
						id: userData.id,
						email: userData.get('email'),
						name: userData.get('name'),
						googleId: userData.get('googleId'),
						avatar: userData.get('avatar'),
						emailVerified: userData.get('emailVerified'),
					},
				},
			})
		} catch {
			RESPONSE.FailureResponse(res, 401, { message: 'Unauthorized' })
		}
	}

	public static readonly facebookOAuthCallback: RequestHandler = async (
		req,
		res,
	) => {
		const user = req.user as User
		try {
			const { token, user: userData } =
				await AuthService.handleOAuthCallback(user)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: { token, user: userData },
			})
		} catch {
			RESPONSE.FailureResponse(res, 401, { message: 'Unauthorized' })
		}
	}

	public static readonly businessUserLogin: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { email, password } = req.body as {
				email: string
				password: string
			}
			const result = await BusinessLoginService.businessUserLogin(
				email,
				password,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Login successful',
				data: result,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly businessForgotPassword: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { email } = req.body as { email: string }
			await BusinessLoginService.businessForgotPassword(email)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'A new password has been sent to your email.',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly changePassword: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = (req.user as { id: number })?.id
			const { old_password, password } = req.body as {
				old_password: string
				password: string
				confirm_password: string
			}
			await BusinessLoginService.changePassword(userId, old_password, password)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'password changed successfully',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}
}
