import { Router, type Router as ExpressRouter } from 'express'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { UserController, redirectUser } from '@/controllers/user.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	sortUsersSchema,
	updateProfileSchema,
	updatePaymentStatusSchema,
	saveUserDeviceSchema,
	userAnswerCountSchema,
} from '@/validations/user.validation'

const router: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /get_all_users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
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
 *                         example: 12
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       farm_name:
 *                         type: string
 *                         example: "Green Farm"
 *                       address:
 *                         type: string
 *                         example: "123 Farm Road"
 *                       pincode:
 *                         type: string
 *                         example: "500001"
 *                       taluka:
 *                         type: string
 *                         example: "Shamshabad"
 *                       district:
 *                         type: string
 *                         example: "Ranga Reddy"
 *                       state_name:
 *                         type: string
 *                         example: "Telangana"
 *                       country:
 *                         type: string
 *                         example: "India"
 *                       payment_status:
 *                         type: string
 *                         example: "premium"
 *                       expDate:
 *                         type: string
 *                         example: "2025-12-31"
 *                       Daily_record_update_count:
 *                         type: integer
 *                         example: 15
 *                       language_id:
 *                         type: integer
 *                         example: 2
 *                       language_name:
 *                         type: string
 *                         example: "English"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                     totalItems:
 *                       type: integer
 *                       example: 35
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
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
	'/get_all_users',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(UserController.getAllUsers),
)

/**
 * @swagger
 * /get_all_users:
 *   post:
 *     summary: Get filtered users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [free, premium]
 *                 example: "premium"
 *                 description: "Filter by payment status (either this or phone required)"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *                 description: "Filter by phone number (either this or status required)"
 *               type:
 *                 type: string
 *                 enum: [all_time]
 *                 example: "all_time"
 *                 description: "Time period type"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *                 description: "Start date for filtering (YYYY-MM-DD format)"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *                 description: "End date for filtering (YYYY-MM-DD format)"
 *             example:
 *               status: "premium"
 *               type: "all_time"
 *     responses:
 *       200:
 *         description: Filtered users list
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
 *                         example: 12
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       farm_name:
 *                         type: string
 *                         example: "Green Farm"
 *                       address:
 *                         type: string
 *                         example: "123 Farm Road"
 *                       pincode:
 *                         type: string
 *                         example: "500001"
 *                       taluka:
 *                         type: string
 *                         example: "Shamshabad"
 *                       district:
 *                         type: string
 *                         example: "Ranga Reddy"
 *                       state:
 *                         type: string
 *                         example: "Telangana"
 *                       country:
 *                         type: string
 *                         example: "India"
 *                       payment_status:
 *                         type: string
 *                         example: "premium"
 *                       expDate:
 *                         type: string
 *                         example: "2025-12-31 00:00:00"
 *                       registration_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15 10:30:00"
 *                       Daily_record_update_count:
 *                         type: integer
 *                         example: 15
 *                       total_days:
 *                         type: integer
 *                         example: 100
 *                       answer_days_count:
 *                         type: integer
 *                         example: 75
 *                       percentage:
 *                         type: string
 *                         example: "75.00"
 *                       language_id:
 *                         type: integer
 *                         example: 2
 *                       language_name:
 *                         type: string
 *                         example: "English"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                     totalItems:
 *                       type: integer
 *                       example: 35
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
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
	'/get_all_users',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(UserController.getFilteredUsers),
)

/**
 * @swagger
 * /sort_users:
 *   post:
 *     summary: Sort users by specified criteria
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_status:
 *                 type: string
 *                 enum: [free, premium]
 *                 example: "premium"
 *                 description: "Payment status to filter by"
 *               sort_by:
 *                 type: string
 *                 enum: [registered_date, validity_exp_date]
 *                 example: "registered_date"
 *                 description: "Field to sort by"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *                 description: "Start date for filtering (YYYY-MM-DD format)"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *                 description: "End date for filtering (YYYY-MM-DD format)"
 *               type:
 *                 type: string
 *                 enum: [all_time]
 *                 example: "all_time"
 *                 description: "Time period type"
 *               page:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 example: 1
 *                 description: "Page number for pagination"
 *               limit:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 10
 *                 example: 10
 *                 description: "Number of items per page"
 *             required:
 *               - payment_status
 *               - sort_by
 *             example:
 *               payment_status: "premium"
 *               sort_by: "registered_date"
 *               type: "all_time"
 *               page: 1
 *               limit: 10
 *     responses:
 *       200:
 *         description: Sorted users list
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
 *                         example: 12
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       farm_name:
 *                         type: string
 *                         example: "Green Farm"
 *                       address:
 *                         type: string
 *                         example: "123 Farm Road"
 *                       pincode:
 *                         type: string
 *                         example: "500001"
 *                       taluka:
 *                         type: string
 *                         example: "Shamshabad"
 *                       district:
 *                         type: string
 *                         example: "Ranga Reddy"
 *                       state:
 *                         type: string
 *                         example: "Telangana"
 *                       country:
 *                         type: string
 *                         example: "India"
 *                       payment_status:
 *                         type: string
 *                         example: "premium"
 *                       expDate:
 *                         type: string
 *                         example: "2025-12-31 00:00:00"
 *                       Daily_record_update_count:
 *                         type: integer
 *                         example: 15
 *                       registration_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15 10:30:00"
 *                       total_days:
 *                         type: integer
 *                         example: 100
 *                       answer_days_count:
 *                         type: integer
 *                         example: 75
 *                       percentage:
 *                         type: string
 *                         example: "75.00"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                     totalItems:
 *                       type: integer
 *                       example: 35
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "payment_status and sort_by are required"
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
	'/sort_users',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(sortUsersSchema),
	wrapAsync(UserController.sortUsers),
)

/**
 * @swagger
 * /get_user_by_id/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *         example: 12
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 12
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phone_number:
 *                       type: string
 *                       example: "9876543210"
 *                     farm_name:
 *                       type: string
 *                       example: "Green Farm"
 *                     address:
 *                       type: string
 *                       example: "123 Farm Road"
 *                     pincode:
 *                       type: string
 *                       example: "500001"
 *                     taluka:
 *                       type: string
 *                       example: "Shamshabad"
 *                     district:
 *                       type: string
 *                       example: "Ranga Reddy"
 *                     state:
 *                       type: string
 *                       example: "Telangana"
 *                     country:
 *                       type: string
 *                       example: "India"
 *                     village:
 *                       type: string
 *                       example: "Sample Village"
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
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
	'/get_user_by_id/:id',
	authenticate,
	wrapAsync(UserController.getUserById),
)

/**
 * @swagger
 * /update_profile/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farm_name:
 *                 type: string
 *                 example: "Green Farm Updated"
 *                 description: "Farm name (required)"
 *               name:
 *                 type: string
 *                 example: "John Doe Updated"
 *                 description: "User's full name (required)"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.updated@example.com"
 *                 description: "User's email address (optional)"
 *               address:
 *                 type: string
 *                 example: "123 Updated Farm Road"
 *                 description: "Address (optional)"
 *               pincode:
 *                 type: string
 *                 example: "500002"
 *                 description: "Postal code (optional)"
 *               taluka:
 *                 type: string
 *                 example: "Updated Taluka"
 *                 description: "Taluka/Block (optional)"
 *               district:
 *                 type: string
 *                 example: "Updated District"
 *                 description: "District (optional)"
 *               state:
 *                 type: string
 *                 example: "Updated State"
 *                 description: "State (optional)"
 *               country:
 *                 type: string
 *                 example: "India"
 *                 description: "Country (optional)"
 *               village:
 *                 type: string
 *                 example: "Updated Village"
 *                 description: "Village (optional)"
 *             required:
 *               - farm_name
 *               - name
 *             example:
 *               farm_name: "Green Farm Updated"
 *               name: "John Doe Updated"
 *               email: "john.updated@example.com"
 *               address: "123 Updated Farm Road"
 *               pincode: "500002"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *       403:
 *         description: Forbidden - User can only update their own profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized action."
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
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
 *                   example:
 *                     farm_name: ["The farm name has already been taken."]
 *                     email: ["The email has already been taken."]
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
	'/update_profile/:id',
	authenticate,
	validateRequest(updateProfileSchema),
	wrapAsync(UserController.updateProfile),
)

/**
 * @swagger
 * /update_payment_status:
 *   post:
 *     summary: Update user payment status
 *     tags: [User]
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
 *                 example: 12
 *                 description: "ID of the user to update"
 *               payment_status:
 *                 type: string
 *                 enum: [free, premium]
 *                 example: "premium"
 *                 description: "New payment status"
 *               exp_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *                 description: "Expiration date in YYYY-MM-DD format"
 *               amount:
 *                 type: number
 *                 example: 1500.00
 *                 description: "Payment amount (optional)"
 *             required:
 *               - user_id
 *               - payment_status
 *               - exp_date
 *             example:
 *               user_id: 12
 *               payment_status: "premium"
 *               exp_date: "2025-12-31"
 *               amount: 1500.00
 *     responses:
 *       200:
 *         description: Payment status updated successfully
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
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Please try again"
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
 *                   example:
 *                     user_id: ["The selected user id is invalid."]
 *                     payment_status: ["Invalid payment status. Must be \"free\" or \"premium\"."]
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
	'/update_payment_status',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updatePaymentStatusSchema),
	wrapAsync(UserController.updatePaymentStatus),
)

/**
 * @swagger
 * /daily_record_phone:
 *   get:
 *     summary: Redirect user to PowerGotha app on Play
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirect to Play Store
 */
router.get('/daily_record_phone', redirectUser)

/**
 * @swagger
 * /save_user_device_detail:
 *   post:
 *     summary: Save user device details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firebase_token:
 *                 type: string
 *                 example: "dGhpcyBpcyBhIGZha2UgZmlyZWJhc2UgdG9rZW4"
 *                 description: Firebase token for push notifications
 *               device_id:
 *                 type: string
 *                 example: "abc123def456"
 *                 description: Unique device identifier
 *               deviceType:
 *                 type: string
 *                 enum: [android, ios, web]
 *                 example: "android"
 *                 description: Type of device
 *             required:
 *               - firebase_token
 *               - device_id
 *               - deviceType
 *     responses:
 *       200:
 *         description: Device details saved successfully
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
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to save device details"
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
 *                   example:
 *                     firebase_token: ["The firebase_token field is required."]
 *                     device_id: ["The device_id field is required."]
 *                     deviceType: ["The deviceType must be one of: android, ios, web."]
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
	'/save_user_device_detail',
	authenticate,
	validateRequest(saveUserDeviceSchema),
	wrapAsync(UserController.saveUserDevice),
)

/**
 * @swagger
 * /user_answer_count:
 *   post:
 *     summary: Get user answer count with filtering options
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "all_time"
 *                 description: Filter type - use 'all_time' for all time data or omit for date range filtering
 *               start_date:
 *                 type: string
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2024-01-01"
 *                 description: Start date in YYYY-MM-DD format (required if type is not 'all_time')
 *               end_date:
 *                 type: string
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2024-12-31"
 *                 description: End date in YYYY-MM-DD format (required if type is not 'all_time')
 *     responses:
 *       200:
 *         description: User answer count data retrieved successfully
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
 *                         example: 123
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       phone_number:
 *                         type: string
 *                         example: "+1234567890"
 *                       registration_date:
 *                         type: string
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       total_days:
 *                         type: integer
 *                         example: 180
 *                       answer_days_count:
 *                         type: integer
 *                         example: 45
 *                       percentage:
 *                         type: number
 *                         example: 25.00
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Search"
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
 *                   example:
 *                     start_date: ["The exp_date must be a valid date in Y-m-d format."]
 *                     end_date: ["The exp_date must be a valid date in Y-m-d format."]
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
	'/user_answer_count',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(userAnswerCountSchema),
	wrapAsync(UserController.getUserAnswerCount),
)

/**
 * @swagger
 * /hide_add_update_section:
 *   get:
 *     summary: Get user profile completion status to determine if add/update sections should be hidden
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile completion status retrieved successfully
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
 *                   properties:
 *                     profile_details:
 *                       type: boolean
 *                       example: true
 *                       description: "Whether user has completed profile details (email, farm_name, address, etc.)"
 *                     animal_details:
 *                       type: boolean
 *                       example: false
 *                       description: "Whether user has animal question answers"
 *                     farm_details:
 *                       type: boolean
 *                       example: true
 *                       description: "Whether user has farm details"
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
	'/hide_add_update_section',
	authenticate,
	wrapAsync(UserController.hideAddUpdateSection),
)

export default router
