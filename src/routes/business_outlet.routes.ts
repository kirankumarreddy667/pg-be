import { Router } from 'express'
import { BusinessOutletController } from '@/controllers/business_outlet.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	businessOutletSchema,
	farmersListSchema,
	businessOutletFarmerMappingSchema,
	businessOutletFarmersAnimalSchema,
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

/**
 * @swagger
 * /business/animal_information:
 *   post:
 *     summary: Get animal count of all the farmers mapped to a business outlet
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
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date (YYYY-MM-DD)
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date (YYYY-MM-DD)
 *               search:
 *                 type: string
 *                 description: Search string (required)
 *               type:
 *                 type: string
 *                 description: Use 'all_time' for all-time data, or leave blank for date range.
 *             required:
 *               - search
 *     responses:
 *       200:
 *         description: Animal count data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/business/animal_information',
	authenticate,
	wrapAsync(authorize(['Business'])),
	validateRequest(businessOutletFarmersAnimalSchema),
	wrapAsync(BusinessOutletController.businessOutletFarmersAnimalCount),
)

/**
 * @swagger
 * /business/milk_information:
 *   post:
 *     summary: Get aggregated milk/fat/SNF info for all mapped farmers
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
 *               search:
 *                 type: string
 *                 description: Use 'all_users' to get all users, or search by phone/name.
 *               type:
 *                 type: string
 *                 description: Use 'all_time' for all-time data, or leave blank for date range.
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: 'YYYY-MM-DD (required if type is not all_time)'
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: 'YYYY-MM-DD (required if type is not all_time)'
 *             required:
 *               - search
 *     responses:
 *       200:
 *         description: Aggregated milk/fat/SNF info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/business/milk_information',
	authenticate,
	wrapAsync(authorize(['Business'])),
	validateRequest(businessOutletFarmersAnimalSchema),
	wrapAsync(BusinessOutletController.businessOutletFarmersAnimalMilkInfo),
)

/**
 * @openapi
 * /business/health_information:
 *   post:
 *     summary: Get animal health information of all the farmers mapped to a business outlet
 *     tags:
 *       - BusinessOutlet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *               type:
 *                 type: string
 *                 nullable: true
 *               start_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               end_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     health_information:
 *                       type: object
 *                       properties:
 *                         number_of_animal_affected:
 *                           type: integer
 *                         total_milk_loss:
 *                           type: number
 *                         diseases:
 *                           type: array
 *                           items:
 *                             type: string
 *                         medicines:
 *                           type: array
 *                           items:
 *                             type: string
 *                     detailed_information:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_number:
 *                             type: string
 *                           totalMilkLoss:
 *                             type: number
 *                           animal_id:
 *                             type: integer
 *                           diseases:
 *                             type: array
 *                             items:
 *                               type: string
 *                           medicines:
 *                             type: array
 *                             items:
 *                               type: string
 *                           user_name:
 *                             type: string
 *                           farm_name:
 *                             type: string
 *                           treatment_dates:
 *                             type: array
 *                             items:
 *                               type: string
 */
router.post(
	'/business/health_information',
	authenticate,
	wrapAsync(authorize(['Business'])),
	wrapAsync(BusinessOutletController.businessOutletFarmersAnimalHealthInfo),
)

/**
 * @openapi
 * /business/breeding_information:
 *   post:
 *     summary: Get animal breeding information of all the farmers mapped to a business outlet
 *     tags:
 *       - BusinessOutlet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *               type:
 *                 type: string
 *                 nullable: true
 *               start_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               end_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     animal_information:
 *                       type: object
 *                       properties:
 *                         total_animals:
 *                           type: integer
 *                         pregnant_animals:
 *                           type: integer
 *                         non_pregnant_animals:
 *                           type: integer
 *                         lactating:
 *                           type: integer
 *                         nonLactating:
 *                           type: integer
 *                     breeding_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           farmer_name:
 *                             type: string
 *                           farm_name:
 *                             type: string
 *                           animal_number:
 *                             type: string
 *                           date_of_AI:
 *                             type: string
 *                           no_of_bull_used_AI:
 *                             type: string
 *                           semen_company_name:
 *                             type: string
 *                           bull_mother_yield:
 *                             type: string
 *                           name_of_doctor:
 *                             type: string
 *                           pregnancy_cycle:
 *                             type: string
 *                           Lactating:
 *                             type: string
 *                           pregnant:
 *                             type: string
 */
router.post(
	'/business/breeding_information',
	authenticate,
	wrapAsync(authorize(['Business'])),
	wrapAsync(BusinessOutletController.businessOutletFarmersAnimalBreedingInfo),
)

export default router
