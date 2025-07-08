import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { AuthService } from '@/services/auth.service'
import { User } from '@/models/user.model'
import {
	businessLoginSchema,
	businessForgotPasswordSchema,
	changePasswordSchema,
} from '@/validations/auth.validation'
import { BusinessLoginService } from '@/services/business_login.service'

interface UserRegistrationBody {
	name: string
	phone_number: string
	password: string
}

interface VerifyOtpBody {
	userId: number
	otp: string
}

interface ResendOtpBody {
	userId: number
}

interface LoginBody {
	phone_number: string
	password: string
}

interface ForgotPasswordBody {
	phone_number: string
}

interface ResetPasswordBody {
	phone_number: string
	otp: string
	password: string
}

export class AuthController {
	static userRegistration: RequestHandler = async (req, res, next) => {
		try {
			const { name, phone_number, password } = req.body as UserRegistrationBody
			const { user, otp } = await AuthService.userRegistration({
				name,
				phone_number,
				password,
			})
			RESPONSE.SuccessResponse(res, 201, {
				message:
					'Success. Please verify the otp sent to your registered phone number',
				data: {
					otp: otp,
					user_id: user.id,
					phone_number: user.phone_number,
				},
			})
		} catch (error) {
			next(error)
		}
	}

	static verifyOtp: RequestHandler = async (req, res, next) => {
		try {
			const { userId, otp } = req.body as VerifyOtpBody
			await AuthService.verifyOtp(userId, otp)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'OTP verified successfully. Your account is now active.',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static resendOtp: RequestHandler = async (req, res, next) => {
		try {
			const { userId } = req.body as ResendOtpBody
			await AuthService.resendOtp(userId)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'A new OTP has been sent to your phone number.',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static login: RequestHandler = async (req, res, next) => {
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

	static forgotPassword: RequestHandler = async (req, res, next) => {
		try {
			const { phone_number } = req.body as ForgotPasswordBody
			await AuthService.forgotPassword(phone_number)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'We have sent an OTP to your phone number.',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static resetPassword: RequestHandler = async (req, res, next) => {
		try {
			const { phone_number, otp, password } = req.body as ResetPasswordBody
			await AuthService.resetPassword(phone_number, otp, password)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Your password has been changed!',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static googleOAuthCallback: RequestHandler = async (req, res) => {
		const user = req.user as User
		try {
			const { token, user: userData } =
				await AuthService.buildOAuthResponse(user)

			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: {
					token,
					user: {
						id: userData.get('id'),
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

	public static facebookOAuthCallback: RequestHandler = async (req, res) => {
		const user = req.user as User
		try {
			const { token, user: userData } =
				await AuthService.buildOAuthResponse(user)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: { token, user: userData },
			})
		} catch {
			RESPONSE.FailureResponse(res, 401, { message: 'Unauthorized' })
		}
	}

	static businessUserLogin: RequestHandler = async (req, res, next) => {
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

	static businessForgotPassword: RequestHandler = async (req, res, next) => {
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

	static changePassword: RequestHandler = async (req, res, next) => {
		try {
			const userId = (req.user as { id: number })?.id
			if (!userId) throw new Error('User not found')
			const { old_password, password } = req.body as {
				old_password: string
				password: string
				confirm_password: string
			}
			await BusinessLoginService.changePassword(userId, old_password, password)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Password changed successfully',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}
}
