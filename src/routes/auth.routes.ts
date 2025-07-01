import { RequestHandler, Router } from 'express'
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
import passport from '@/config/passport.config'
import { oauthFailureHandler } from '@/utils/oauthFailureHandler'

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
	validateRequest(forgotPassword),
	wrapAsync(AuthController.forgotPassword),
)

router.post(
	'/reset-password',
	validateRequest(resetPassword),
	wrapAsync(AuthController.resetPassword),
)

// Initiate Google OAuth login
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		session: false,
	}) as RequestHandler,
)

// Google OAuth callback
router.get(
	'/google/callback',
	passport.authenticate('google', {
		session: false,
		failWithError: true,
	}) as RequestHandler,
	oauthFailureHandler,
	wrapAsync(AuthController.googleOAuthCallback),
)

// Initiate Facebook OAuth login
router.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: ['email'],
		session: false,
	}) as RequestHandler,
)

// Facebook OAuth callback
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', {
		session: false,
		failWithError: true,
	}) as RequestHandler,
	oauthFailureHandler,
	wrapAsync(AuthController.facebookOAuthCallback),
)

// router.post('/logout', wrapAsync(AuthController.logout))

export default router
