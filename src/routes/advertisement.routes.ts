import { Router } from 'express'
import { AdvertisementController } from '@/controllers/advertisement.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { advertisementSchema } from '@/validations/advertisement.validation'
import { authenticate } from '@/middlewares/auth.middleware'

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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               term_conditions:
 *                 type: string
 *               status:
 *                 type: boolean
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: base64
 *             required:
 *               - name
 *               - description
 *               - cost
 *               - phone_number
 *               - term_conditions
 *     responses:
 *       201:
 *         description: Advertisement created successfully
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
 *       404:
 *         description: Advertisement not found
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               term_conditions:
 *                 type: string
 *               status:
 *                 type: boolean
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: base64
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /advertisement/{id}:
 *   patch:
 *     summary: Partially update an advertisement by ID
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *               phone_number:
 *                 type: string
 *               term_conditions:
 *                 type: string
 *               status:
 *                 type: boolean
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: base64
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Advertisement not found
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
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

const router: Router = Router()

router.post(
	'/advertisement',
	authenticate,
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
	wrapAsync(AdvertisementController.show),
)
router.put(
	'/advertisement/:id',
	authenticate,
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)
router.patch(
	'/advertisement/:id',
	authenticate,
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)
router.delete('/advertisement/:id', wrapAsync(AdvertisementController.destroy))

export default router
