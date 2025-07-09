import { Router } from 'express'
import { BusinessOutletController } from '@/controllers/business_outlet.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	businessOutletSchema,
	farmersListSchema,
	businessOutletFarmerMappingSchema,
} from '@/validations/business_outlet.validation'
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

/**
 * @swagger
 * /business_outlet_farmer_mapping:
 *   post:
 *     summary: Map a farmer (user) to a business outlet
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
 *               user_id:
 *                 type: integer
 *               business_outlet_id:
 *                 type: integer
 *             required:
 *               - user_id
 *               - business_outlet_id
 *     responses:
 *       201:
 *         description: Mapping created
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
router.post(
	'/business_outlet_farmer_mapping',
	authenticate,
	validateRequest(businessOutletFarmerMappingSchema),
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.mapUserWithBusinessOutlet),
)

/**
 * @swagger
 * /business_outlet_farmer/{id}:
 *   get:
 *     summary: Get all farmers mapped to a business outlet
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
 *         description: List of mapped farmers
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
router.get(
	'/business_outlet_farmer/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.businessOutletFarmers),
)

/**
 * @swagger
 * /business/list_of_users:
 *   post:
 *     summary: Get list of farmers mapped to a business outlet (with filters)
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
 *               business_outlet_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: 'YYYY-MM-DD'
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: 'YYYY-MM-DD'
 *               search:
 *                 type: string
 *             required:
 *               - business_outlet_id
 *               - search
 *     responses:
 *       200:
 *         description: List of mapped farmers
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
router.post(
	'/business/list_of_users',
	authenticate,
	validateRequest(farmersListSchema),
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.farmersList),
)

/**
 * @swagger
 * /business_outlet/delete_farmer/{farmer_id}/{business_outlet_id}:
 *   delete:
 *     summary: Delete a mapped farmer from a business outlet
 *     tags: [BusinessOutlet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: farmer_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Farmer user ID
 *       - in: path
 *         name: business_outlet_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Business outlet ID
 *     responses:
 *       200:
 *         description: Mapping deleted successfully
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
 *         description: Mapping not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete(
	'/business_outlet/delete_farmer/:farmer_id/:business_outlet_id',
	authenticate,
	wrapAsync(authorize(['Business'])),
	wrapAsync(BusinessOutletController.deleteMappedFarmerToBusinessOutlet),
)

export default router
