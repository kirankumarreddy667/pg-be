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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/coupon',
  authenticate,
  wrapAsync(CouponController.getAllCoupons.bind(CouponController))
)

/**
 * @swagger
 * /coupon:
 *   post:
 *     summary: Upload coupons from CSV file
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
 *       201:
 *         description: Coupons created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: CSV file is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Internal server error
 */
router.post(
  '/coupon',
  authenticate,
  uploadCSV.single('file'),
  wrapAsync(CouponController.createCoupon.bind(CouponController))
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
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon type (e.g., 'discount')
 *     responses:
 *       200:
 *         description: Valid coupon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Invalid coupon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/coupon/:code/:type',
  authenticate,
  wrapAsync(CouponController.checkCoupon.bind(CouponController))
)

export default router
// import { Router } from 'express'
// import { CouponController } from '@/controllers/coupons.controller'
// import { wrapAsync } from '@/utils/asyncHandler'
// import { authenticate } from '@/middlewares/auth.middleware'
// import { uploadCSV } from '@/middlewares/multer.middleware'

// const router: Router = Router()

// router.get(
//     '/coupon',
//     authenticate,
//     wrapAsync(CouponController.getAllCoupons.bind(CouponController))
// )

// router.post(
//     '/coupon',
//     authenticate,
//     uploadCSV.single('file'),
//     wrapAsync(CouponController.createCoupon.bind(CouponController))
// )

// router.get(
//     '/coupon/:code/:type',
//     authenticate,
//     wrapAsync(CouponController.checkCoupon.bind(CouponController))
// )

// export default router
