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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *     responses:
 *       200:
 *         description: Filtered users
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
 *     summary: Sort users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SortUsers'
 *     responses:
 *       200:
 *         description: Sorted users
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
 *     summary: Get user by ID
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
 *     responses:
 *       200:
 *         description: User details
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated
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
 *         description: User not found
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
 *             $ref: '#/components/schemas/UpdatePaymentStatus'
 *     responses:
 *       200:
 *         description: Payment status updated
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
 *     summary: Redirect user to PowerGotha app on Play Store
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
 *             required:
 *               - firebase_token
 *               - device_id
 *               - deviceType
 *             properties:
 *               firebase_token:
 *                 type: string
 *                 description: Firebase token for push notifications
 *               device_id:
 *                 type: string
 *                 description: Unique device identifier
 *               deviceType:
 *                 type: string
 *                 enum: [android, ios, web]
 *                 description: Type of device
 *     responses:
 *       200:
 *         description: Device details saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
	'/save_user_device_detail',
	authenticate,
	validateRequest(saveUserDeviceSchema),
	wrapAsync(UserController.saveUserDevice),
)

/**
 * @swagger
 * /user_answer_count:
 *   post:
 *     summary: Get user answer count
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAnswerCount'
 *     responses:
 *       200:
 *         description: User answer count
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
	'/user_answer_count',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(userAnswerCountSchema),
	wrapAsync(UserController.getUserAnswerCount),
)

export default router
