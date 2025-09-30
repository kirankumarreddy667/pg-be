import { Router } from 'express'
import { BusinessOutletController } from '@/controllers/business_outlet.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	businessOutletSchema,
	farmersListSchema,
	businessOutletFarmerMappingSchema,
	businessOutletFarmersAnimalSchema,
	businessOutletUpdateSchema,
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
 *                 example: "Dairy Express"
 *               owner_name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@dairyexpress.com"
 *               mobile:
 *                 type: string
 *                 pattern: ^\d+$
 *                 example: "9876543210"
 *               business_address:
 *                 type: string
 *                 example: "123 Main Street, City"
 *             required:
 *               - business_name
 *               - owner_name
 *               - email
 *               - mobile
 *               - business_address
 *     responses:
 *       200:
 *         description: Business outlet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business outlet created successfully"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
router.post(
	'/business_outlet',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(businessOutletSchema),
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
 *                       business_name:
 *                         type: string
 *                         example: "Dairy Express"
 *                       business_address:
 *                         type: string
 *                         example: "123 Main Street, City"
 *                       owner_name:
 *                         type: string
 *                         example: "John Doe"
 *                       owner_email:
 *                         type: string
 *                         example: "john@dairyexpress.com"
 *                       owner_mobile_no:
 *                         type: string
 *                         example: "9876543210"
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
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               business_name:
 *                 type: string
 *                 example: "Updated Dairy Express"
 *               owner_name:
 *                 type: string
 *                 example: "John Smith"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johnsmith@dairyexpress.com"
 *               business_address:
 *                 type: string
 *                 example: "456 New Street, City"
 *     responses:
 *       200:
 *         description: Business outlet updated successfully
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
 *       404:
 *         description: Business outlet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business outlet not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
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
router.put(
	'/business_outlet/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(businessOutletUpdateSchema),
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Business outlet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business Outlet Deleted Successfully"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *       404:
 *         description: Business outlet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business outlet not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
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
 *     summary: Map farmers (users) to a business outlet
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
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: Array of user IDs to map to the business outlet
 *               business_outlet_id:
 *                 type: integer
 *                 example: 1
 *                 description: Business outlet ID
 *             required:
 *               - user_id
 *               - business_outlet_id
 *     responses:
 *       200:
 *         description: Mapping created successfully
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
router.post(
	'/business_outlet_farmer_mapping',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(businessOutletFarmerMappingSchema),
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
 *         example: 1
 *     responses:
 *       200:
 *         description: List of mapped farmers
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
 *                       business_outlet_name:
 *                         type: string
 *                         example: "Dairy Express"
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       user_name:
 *                         type: string
 *                         example: "Farmer John"
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       farm_name:
 *                         type: string
 *                         example: "Green Valley Farm"
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
 *       404:
 *         description: Business outlet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business outlet not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
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
 *               start_date:
 *                 type: string
 *                 format: date
 *                 pattern: ^\d{4}-\d{2}-\d{2}$
 *                 example: "2024-01-01"
 *                 description: Start date in YYYY-MM-DD format
 *               end_date:
 *                 type: string
 *                 format: date
 *                 pattern: ^\d{4}-\d{2}-\d{2}$
 *                 example: "2024-12-31"
 *                 description: End date in YYYY-MM-DD format
 *               search:
 *                 type: string
 *                 example: "all_users"
 *                 description: Search by phone number, name, or use 'all_users' for all farmers
 *             required:
 *               - search
 *     responses:
 *       200:
 *         description: List of mapped farmers
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
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Farmer John"
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       address:
 *                         type: string
 *                         example: "Farm Address"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       id:
 *                         type: integer
 *                         example: 1
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
 *       404:
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
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
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
router.post(
	'/business/list_of_users',
	authenticate,
	wrapAsync(authorize(['Business'])),
	validateRequest(farmersListSchema),
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
 *         example: 1
 *       - in: path
 *         name: business_outlet_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Business outlet ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Mapping deleted successfully
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
 *       404:
 *         description: User or mapping not found
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
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
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
