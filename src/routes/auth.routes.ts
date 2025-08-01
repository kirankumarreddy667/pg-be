import { RequestHandler, Router } from 'express'
import { AuthController } from '@/controllers/auth.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	userRegistrationSchema,
	verifyOtpSchema,
	loginSchema,
	forgotPassword,
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
 * /user_registration:
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
 *                 description: User's full name
 *               phone_number:
 *                 type: string
 *                 description: Phone number (digits only)
 *               password:
 *                 type: string
 *                 description: Password (6-16 characters)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (optional)
 *             required:
 *               - name
 *               - phone_number
 *               - password
 *     responses:
 *       200:
 *         description: Success. Please verify the otp sent to your registered phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success. Please verify the otp sent to your registered phone number"
 *                 data:
 *                   type: object
 *                   properties:
 *                     otp:
 *                       type: string
 *                       description: 6-digit OTP code
 *                     user_id:
 *                       type: integer
 *                       description: User ID for OTP verification
 *                     phone_number:
 *                       type: integer
 *                       description: Phone number
 *                     sms_response:
 *                       type: string
 *                       description: SMS service response
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (phone number already taken, email already taken)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The phone number has already been taken."
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration failed. Please try again."
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.post(
	'/user_registration',
	validateRequest(userRegistrationSchema),
	wrapAsync(AuthController.userRegistration),
)

/**
 * @swagger
 * /verify_otp:
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
 *               user_id:
 *                 type: integer
 *                 description: User ID from registration response
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP code
 *             required:
 *               - user_id
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP matched successfully"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid OTP or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not a valid OTP"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verification failed. Please try again."
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.post(
	'/verify_otp',
	validateRequest(verifyOtpSchema),
	wrapAsync(AuthController.verifyOtp),
)

/**
 * @swagger
 * /resend_otp/{phone}:
 *   get:
 *     summary: Resend OTP to user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Phone number of the user
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     otp:
 *                       type: string
 *                       example: "337159"
 *                     user_id:
 *                       type: integer
 *                       example: 8
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-30 11:27:28"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-30 11:27:28"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: User not found or phone number required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to resend OTP. Please try again."
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.get('/resend_otp/:phone', wrapAsync(AuthController.resendOtp))

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login with role-based authentication
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
 *                 description: "Phone number (admin: 7207063149, user: any other)"
 *               password:
 *                 type: string
 *                 description: User password
 *             required:
 *               - phone_number
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success."
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     user_id:
 *                       type: integer
 *                       description: User ID
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       description: User email
 *                     name:
 *                       type: string
 *                       description: User name
 *                     phone:
 *                       type: string
 *                       description: Phone number
 *                     farm_name:
 *                       type: string
 *                       nullable: true
 *                       description: Farm name
 *                     payment_status:
 *                       type: string
 *                       enum: [free, premium]
 *                       description: Payment status
 *                     plan_expires_on:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: Plan expiry date
 *                     otp_status:
 *                       type: boolean
 *                       description: OTP verification status
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The mobile number is not registered yet"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials!!"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login failed. Please try again."
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.post(
	'/login',
	validateRequest(loginSchema),
	wrapAsync(AuthController.login),
)

/**
 * @swagger
 * /forgot_password:
 *   post:
 *     summary: Reset password with OTP verification
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
 *                 description: User's phone number
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP code
 *               password:
 *                 type: string
 *                 description: New password (6-16 characters)
 *             required:
 *               - phone_number
 *               - otp
 *               - password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Invalid OTP or OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not a valid OTP"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 401
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset failed. Please try again."
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.post(
	'/forgot_password',
	validateRequest(forgotPassword),
	wrapAsync(AuthController.forgotPassword),
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Database error
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Database error
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/change_password',
	authenticate,
	validateRequest(changePasswordSchema),
	wrapAsync(AuthController.changePassword),
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
