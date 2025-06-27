import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@/types/index'
import RESPONSE from '@/utils/response'
import { AuthService } from '@/services/auth.service'

type AsyncRequestHandler = (
	req: Request | AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => Promise<void> | void

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
	static userRegistration: AsyncRequestHandler = async (req, res, next) => {
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

	static verifyOtp: AsyncRequestHandler = async (req, res, next) => {
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

	static resendOtp: AsyncRequestHandler = async (req, res, next) => {
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

	static login: AsyncRequestHandler = async (req, res, next) => {
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

	static forgotPassword: AsyncRequestHandler = async (req, res, next) => {
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

	static resetPassword: AsyncRequestHandler = async (req, res, next) => {
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
}
