
import { authenticate } from '@/middlewares/auth.middleware';
import { wrapAsync } from '@/utils/asyncHandler';
import { UserPaymentController } from '@/controllers/payment.controller';
import { validateRequest } from '@/middlewares/validateRequest';
import { createUserPaymentSchema, getUserPaymentSchema } from '@/validations/payment.validation';
import { Router, Router as ExpressRouter } from 'express';

const userPaymentRouter: ExpressRouter = Router();

/**
 * @swagger
 * tags:
 *   name: UserPayment
 *   description: Plan payment related endpoints
 */

/**
 * @swagger
 * /user_payment:
 *   post:
 *     summary: Create Razorpay order and store initial payment data
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
 *               plan_id:
 *                 type: integer
 *                 example: 2
 *               coupon_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               offer_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               currency:
 *                 type: string
 *                 example: "INR"
 *               amount:
 *                 type: number
 *                 example: 550
 *               payment_gateway:
 *                 type: string
 *                 example: "razorpay"
 *               number_of_valid_years:
 *                 type: integer
 *                 example: 1
 *               plan_exp_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T00:00:00.000Z"
 *               billing_instrument:
 *                 type: string
 *                 example: "Netbanking"
 *     responses:
 *       200:
 *         description: Razorpay order created and saved
 *       401:
 *         description: Unauthorized
 */
userPaymentRouter.post(
  '/user_payment',
  authenticate,
  validateRequest(createUserPaymentSchema),
  wrapAsync(UserPaymentController.createUserPayment)
);

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
 *               payment_id:
 *                 type: string
 *                 example: "pay_QwNyOpwL4ae1OO"
 *               plan_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment verified and user plan activated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
userPaymentRouter.post(
  '/payment',
  authenticate,
  validateRequest(getUserPaymentSchema),
  wrapAsync(UserPaymentController.getUserPaymentDetails)
);

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
 *       401:
 *         description: Unauthorized
 */
userPaymentRouter.get(
  '/plan_payment_history',
  authenticate,
  wrapAsync(UserPaymentController.getPlanPaymentHistory)
);

export default userPaymentRouter;
