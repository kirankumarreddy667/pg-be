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
 * /farm_details:
 *   post:
 *     summary: Create user farm details
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserFarmDetails'
 *     responses:
 *       201:
 *         description: Farm details created
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

/**
 * @swagger
 * /farm_details/{id}:
 *   get:
 *     summary: Get user farm details by ID
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Farm details ID
 *     responses:
 *       200:
 *         description: Farm details
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /farm_details/{id}:
 *   put:
 *     summary: Update user farm details by ID
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Farm details ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserFarmDetails'
 *     responses:
 *       200:
 *         description: Farm details updated
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
 *       404:
 *         description: Not found
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

/**
 * @swagger
 * /farm_types/{language_id}:
 *   get:
 *     summary: Get all farm types for a language
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of farm types
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /investment_type/{language_id}:
 *   get:
 *     summary: Get all investment types for a language
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of investment types
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /farm_investment_details:
 *   post:
 *     summary: Create farm investment details
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FixedInvestmentDetails'
 *     responses:
 *       201:
 *         description: Investment details created
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

/**
 * @swagger
 * /investment_details_report/{id}:
 *   get:
 *     summary: Get investment details report by ID
 *     tags: [FarmManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Investment details ID
 *     responses:
 *       200:
 *         description: Investment details report
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
 *       404:
 *         description: Not found
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
