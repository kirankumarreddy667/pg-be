import { Router } from 'express'
import { AdvertisementController } from '@/controllers/advertisement.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { advertisementSchema } from '@/validations/advertisement.validation'
import { authenticate, authorize } from '@/middlewares/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: Advertisement
 *   description: Advertisement management endpoints
 */

/**
 * @swagger
 * /advertisement:
 *   post:
 *     summary: Create a new advertisement
 *     tags: [Advertisement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvertisementCreate'
 *     responses:
 *       201:
 *         description: Advertisement created successfully
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
 *       403:
 *         description: Forbidden
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /advertisement:
 *   get:
 *     summary: Get all advertisements
 *     tags: [Advertisement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of advertisements
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /advertisement/{id}:
 *   get:
 *     summary: Get advertisement by ID
 *     tags: [Advertisement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement details
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /advertisement/{id}:
 *   put:
 *     summary: Update an advertisement by ID
 *     tags: [Advertisement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Advertisement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvertisementUpdate'
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Advertisement not found
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /advertisement/{id}:
 *   delete:
 *     summary: Delete an advertisement by ID
 *     tags: [Advertisement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement deleted successfully
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

const router: Router = Router()

router.post(
	'/advertisement',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.create),
)

router.get(
	'/advertisement',
	authenticate,
	wrapAsync(AdvertisementController.index),
)
router.get(
	'/advertisement/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AdvertisementController.show),
)
router.put(
	'/advertisement/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)

router.delete(
	'/advertisement/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AdvertisementController.destroy),
)

export default router
