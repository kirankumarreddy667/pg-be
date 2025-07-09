import { Router } from 'express'
import { FarmManagementController } from '@/controllers/farm_management.controller'
import { userFarmDetailsSchema } from '@/validations/user_farm_details.validation'
import { fixedInvestmentDetailsSchema } from '@/validations/fixed_investment_details.validation'
import { validateRequest } from '@/middlewares/validateRequest'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'

/**
 * @swagger
 * tags:
 *   name: FarmManagement
 *   description: Farm management endpoints
 */

/**
 * @swagger
 * /farm_management:
 *   get:
 *     summary: Get all farm management records
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of farm management records
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

/**
 * @swagger
 * /farm_management:
 *   post:
 *     summary: Create a new farm management record
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FarmManagement'
 *     responses:
 *       201:
 *         description: Farm management record created
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
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

const router: Router = Router()

router.post(
	'/farm_details',
	authenticate,
	validateRequest(userFarmDetailsSchema),
	wrapAsync(FarmManagementController.storeFarmDetails),
)

router.get(
	'/farm_details/:id',
	authenticate,
	wrapAsync(FarmManagementController.showFarmDetails),
)

router.put(
	'/farm_details/:id',
	authenticate,
	wrapAsync(FarmManagementController.updateFarmDetails),
)

router.get(
	'/farm_types/:language_id',
	authenticate,
	wrapAsync(FarmManagementController.farmTypes),
)

router.get(
	'/investment_type/:language_id',
	authenticate,
	wrapAsync(FarmManagementController.investmentTypes),
)

router.post(
	'/farm_investment_details',
	authenticate,
	validateRequest(fixedInvestmentDetailsSchema),
	wrapAsync(FarmManagementController.storeFixedInvestmentDetails),
)

router.get(
	'/investment_details_report/:id',
	authenticate,
	wrapAsync(FarmManagementController.investmentDetailsReport),
)

export default router
