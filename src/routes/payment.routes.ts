import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { UserPaymentController } from '@/controllers/payment.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createUserPaymentSchema,
	verifyAndProcessPayment,
} from '@/validations/payment.validation'
import { Router } from 'express'
import { webhookAuth } from '@/middlewares/webhookAuth'

const userPaymentRouter: Router = Router()
/**
 * @swagger
 * /user_payment:
 *   post:
 *     summary: Create Razorpay order and redirect to payment URL
 *     tags: [UserPayment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *               - currency
 *               - amount
 *               - number_of_valid_years
 *               - payment_gateway
 *               - quantity
 *             properties:
 *               plan_id:
 *                 type: integer
 *                 example: 1
 *               currency:
 *                 type: string
 *                 example: "INR"
 *               amount:
 *                 type: number
 *                 example: 500
 *               number_of_valid_years:
 *                 type: integer
 *                 example: 1
 *               payment_gateway:
 *                 type: string
 *                 example: "razorpay"
 *               quantity:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Redirect URL returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redirect_url:
 *                   type: string
 *                   example: "https://rzp.io/i/abc123"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
userPaymentRouter.post(
	'/user_payment',
	authenticate,
	validateRequest(createUserPaymentSchema),
	wrapAsync(UserPaymentController.createUserPayment),
)

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Capture Razorpay payment and finalize subscription
 *     tags: [UserPayment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: "order_QwNyOpwL4ae1OO"
 *               razorpay_payment_id:
 *                 type: string
 *                 example: "pay_QwNyOpwL4ae1OO"
 *               razorpay_signature:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Payment verified and user plan activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
userPaymentRouter.post(
	'/payment',
	authenticate,
	validateRequest(verifyAndProcessPayment),
	wrapAsync(UserPaymentController.verifyAndProcessPayment),
)

/**
 * @swagger
 * /plan_payment_history:
 *   get:
 *     summary: Get user’s past plan payment history
 *     tags: [UserPayment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of plan payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 141
 *                       user_id:
 *                         type: integer
 *                         example: 45
 *                       plan_id:
 *                         type: integer
 *                         example: 1
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       payment_id:
 *                         type: string
 *                         example: "pay_RCHFtXyVTQXX12"
 *                       num_of_valid_years:
 *                         type: integer
 *                         example: 1
 *                       plan_exp_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-09-02 07:09:36"
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: ""
 *                       billing_instrument:
 *                         type: string
 *                         example: "card"
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: ""
 *                       status:
 *                         type: string
 *                         example: "captured"
 *                       coupon_id:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *                       offer_id:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-02 07:09:36"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-02 07:09:36"
 *                       deleted_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *                       plan:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "1 year premium subscription"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
userPaymentRouter.get(
	'/plan_payment_history',
	authenticate,
	wrapAsync(UserPaymentController.getPlanPaymentHistory),
)

// razorpay webhook
userPaymentRouter.post(
	'/razorpay/webhook',
	webhookAuth,
	wrapAsync(UserPaymentController.handleWebhook),
)

export default userPaymentRouter
