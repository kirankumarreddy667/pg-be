import { Router } from 'express'
import { CouponController } from '@/controllers/coupons.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate } from '@/middlewares/auth.middleware'
import { uploadCSV } from '@/middlewares/multer.middleware'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management endpoints
 */

/**
 * @swagger
 * /coupon:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       coupon_code:
 *                         type: string
 *                         example: "AZZNZZ"
 *                       amount:
 *                         type: number
 *                         example: 400
 *                       created_at:
 *                         type: string
 *                         example: "2018-12-21 11:34:30"
 *                       updated_at:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       type:
 *                         type: string
 *                         example: "plan"
 *                       exp_date:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       deleted_at:
 *                         type: string
 *                         nullable: true
 *                         example: null
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
router.get('/coupon', authenticate, wrapAsync(CouponController.getAllCoupons))

/**
 * @swagger
 * /coupon:
 *   post:
 *     summary: Upload coupons from CSV file
 *     description: CSV must have headers `coupon_code|amount|type`
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Coupons created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: CSV file is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CSV file is missing or invalid"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
router.post(
	'/coupon',
	authenticate,
	uploadCSV.single('file'),
	wrapAsync(CouponController.createCoupon),
)

/**
 * @swagger
 * /coupon/{code}/{type}:
 *   get:
 *     summary: Validate a coupon by code and type
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon code
 *         example: "SAVE10"
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon type (e.g., 'plan')
 *         example: "plan"
 *     responses:
 *       200:
 *         description: Valid coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Coupon"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     coupon_code:
 *                       type: string
 *                       example: "KHUVXA"
 *                     amount:
 *                       type: number
 *                       example: 400
 *                     created_at:
 *                       type: string
 *                       example: "2018-12-21 11:34:30"
 *                     updated_at:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     type:
 *                       type: string
 *                       example: "plan"
 *                     exp_date:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     deleted_at:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Coupon"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
 *
 */
router.get(
	'/coupon/:code/:type',
	authenticate,
	wrapAsync(CouponController.checkCoupon),
)

export default router
