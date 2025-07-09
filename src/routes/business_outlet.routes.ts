import { Router } from 'express'
import { BusinessOutletController } from '@/controllers/business_outlet.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import { businessOutletSchema } from '@/validations/business_outlet.validation'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: BusinessOutlet
 *   description: Business outlet management endpoints
 */

const router: Router = Router()

/**
 * @swagger
 * /business_outlet:
 *   post:
 *     summary: Create a new business outlet
 *     tags: [BusinessOutlet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               business_name:
 *                 type: string
 *               owner_name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               business_address:
 *                 type: string
 *             required:
 *               - business_name
 *               - owner_name
 *               - email
 *               - mobile
 *               - business_address
 *     responses:
 *       201:
 *         description: Business outlet created successfully
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
	'/business_outlet',
	authenticate,
	validateRequest(businessOutletSchema),
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.store),
)

/**
 * @swagger
 * /business_outlet:
 *   get:
 *     summary: Get all business outlets
 *     tags: [BusinessOutlet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of business outlets
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
router.get(
	'/business_outlet',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.list),
)

/**
 * @swagger
 * /business_outlet/{id}:
 *   put:
 *     summary: Update a business outlet by ID
 *     tags: [BusinessOutlet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Business outlet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               business_name:
 *                 type: string
 *               owner_name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               business_address:
 *                 type: string
 *             required:
 *               - business_name
 *               - owner_name
 *               - email
 *               - mobile
 *               - business_address
 *     responses:
 *       200:
 *         description: Business outlet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Business outlet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.put(
	'/business_outlet/:id',
	authenticate,
	validateRequest(businessOutletSchema),
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.update),
)

/**
 * @swagger
 * /business_outlet/{id}:
 *   delete:
 *     summary: Delete a business outlet by ID
 *     tags: [BusinessOutlet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Business outlet ID
 *     responses:
 *       200:
 *         description: Business outlet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Business outlet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete(
	'/business_outlet/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.delete),
)

export default router
