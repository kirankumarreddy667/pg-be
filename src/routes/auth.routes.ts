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
	businessLoginSchema,
	businessForgotPasswordSchema,
	changePasswordSchema,
} from '@/validations/auth.validation'
import passport from '@/config/passport.config'
import { oauthFailureHandler } from '@/utils/oauthFailureHandler'
import { authenticate } from '@/middlewares/auth.middleware'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /user-registration:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - phone_number
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/user-registration',
	validateRequest(userRegistrationSchema),
	wrapAsync(AuthController.userRegistration),
)

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for user registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               otp:
 *                 type: string
 *             required:
 *               - userId
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/verify-otp',
	validateRequest(verifyOtpSchema),
	wrapAsync(AuthController.verifyOtp),
)

/**
 * @swagger
 * /resend-otp:
 *   post:
 *     summary: Resend OTP to user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/resend-otp',
	validateRequest(resendOtpSchema),
	wrapAsync(AuthController.resendOtp),
)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - phone_number
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/login',
	validateRequest(loginSchema),
	wrapAsync(AuthController.login),
)

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *             required:
 *               - phone_number
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/forgot-password',
	validateRequest(forgotPassword),
	wrapAsync(AuthController.forgotPassword),
)

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - phone_number
 *               - otp
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/reset-password',
	validateRequest(resetPassword),
	wrapAsync(AuthController.resetPassword),
)

/**
 * @swagger
 * /business/login:
 *   post:
 *     summary: Business user login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/business/login',
	validateRequest(businessLoginSchema),
	AuthController.businessUserLogin,
)

/**
 * @swagger
 * /business/forgot_password:
 *   post:
 *     summary: Request business user password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/business/forgot_password',
	validateRequest(businessForgotPasswordSchema),
	AuthController.businessForgotPassword,
)

/**
 * @swagger
 * /change_password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *             required:
 *               - old_password
 *               - password
 *               - confirm_password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/change_password',
	authenticate,
	validateRequest(changePasswordSchema),
	AuthController.changePassword,
)

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
// Initiate Google OAuth login
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		session: false,
	}) as RequestHandler,
)

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google OAuth successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: OAuth failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
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

/**
 * @swagger
 * /facebook:
 *   get:
 *     summary: Initiate Facebook OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Facebook OAuth
 */
// Initiate Facebook OAuth login
router.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: ['email'],
		session: false,
	}) as RequestHandler,
)

/**
 * @swagger
 * /facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Facebook OAuth successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: OAuth failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
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
