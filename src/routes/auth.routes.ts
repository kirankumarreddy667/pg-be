import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	userRegistrationSchema,
	verifyOtpSchema,
	resendOtpSchema,
	loginSchema,
	forgotPassword,
	resetPassword,
} from '@/validations/auth.validation'

const router: Router = Router()

// Public routes
router.post(
	'/user-registration',
	validateRequest(userRegistrationSchema),
	wrapAsync(AuthController.userRegistration),
)

router.post(
	'/verify-otp',
	validateRequest(verifyOtpSchema),
	wrapAsync(AuthController.verifyOtp),
)

router.post(
	'/resend-otp',
	validateRequest(resendOtpSchema),
	wrapAsync(AuthController.resendOtp),
)

router.post(
	'/login',
	validateRequest(loginSchema),
	wrapAsync(AuthController.login),
)

router.post(
	'/forgot-password',
	validateRequest(forgotPassword.body),
	wrapAsync(AuthController.forgotPassword),
)

router.post(
	'/reset-password',
	validateRequest(resetPassword.body),
	wrapAsync(AuthController.resetPassword),
)

// router.post('/logout', wrapAsync(AuthController.logout))

export default router
