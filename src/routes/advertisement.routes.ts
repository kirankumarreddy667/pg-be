import { Router } from 'express'
import { AdvertisementController } from '@/controllers/advertisement.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	advertisementSchema,
	updateAdvertisementSchema,
	updatestatusSchema,
} from '@/validations/advertisement.validation'
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
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - cost
 *               - phone_number
 *               - term_conditions
 *               - status
 *               - photos
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Promo Banner"
 *               description:
 *                 type: string
 *                 example: "Great offer for the season"
 *               cost:
 *                 type: number
 *                 example: 199.99
 *               phone_number:
 *                 type: string
 *                 maxLength: 10
 *                 example: "9876543210"
 *               term_conditions:
 *                 type: string
 *                 example: "T&C apply"
 *               website_link:
 *                 type: string
 *                 example: "https://example.com"
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 1
 *               photos:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   description: Base64 image string (data URI) for png/jpeg/jpg
 *                   example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *     responses:
 *       200:
 *         description: Advertisement created successfully
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
 *                   example: "Bad request"
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
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
 *                         example: 67
 *                       name:
 *                         type: string
 *                         example: "A to Z Dairy Farming Course"
 *                       description:
 *                         type: string
 *                         example: "Course details..."
 *                       cost:
 *                         type: number
 *                         example: 3000
 *                       phone_number:
 *                         type: string
 *                         example: "9112219610"
 *                       term_conditions:
 *                         type: string
 *                         example: "Support by Teplu"
 *                       website_link:
 *                         type: string
 *                         example: "https://jo.my/tpd5rx"
 *                       status:
 *                         type: integer
 *                         enum: [0, 1]
 *                         example: 1
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "http://localhost:8888/ad_images/1751632391924329.jpeg"
 *                   example:
 *                     - id: 67
 *                       name: "A to Z Dairy Farming Course"
 *                       description: "Course details..."
 *                       cost: 3000
 *                       phone_number: "9112219610"
 *                       term_conditions: "Support by Teplu"
 *                       website_link: "https://jo.my/tpd5rx"
 *                       status: 1
 *                       images:
 *                         - "http://localhost:8888/ad_images/1751632391924329.jpeg"
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
 *                 status:
 *                   type: integer
 *                   example: 401
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 403
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
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 67
 *                     name:
 *                       type: string
 *                       example: "A to Z Dairy Farming Course"
 *                     description:
 *                       type: string
 *                       example: "Course details..."
 *                     cost:
 *                       type: number
 *                       example: 3000
 *                     phone_number:
 *                       type: string
 *                       example: "9112219610"
 *                     term_conditions:
 *                       type: string
 *                       example: "Support by Teplu"
 *                     website_link:
 *                       type: string
 *                       example: "https://jo.my/tpd5rx"
 *                     status:
 *                       type: integer
 *                       enum: [0, 1]
 *                       example: 1
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "http://localhost:8888/ad_images/1751632391924329.jpeg"
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
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertisement not found"
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
 *             required:
 *               - name
 *               - description
 *               - cost
 *               - phone_number
 *               - term_conditions
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cost:
 *                 type: number
 *               phone_number:
 *                 type: string
 *                 maxLength: 10
 *               term_conditions:
 *                 type: string
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *               photos:
 *                 type: array
 *                 maxItems: 5
 *                 description: Optional list of base64 images
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
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
 *                   example: "Bad request"
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertisement not found"
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
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertisement not found"
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

/**
 * @swagger
 * /advertisement/status/{id}:
 *   patch:
 *     summary: Update advertisement status
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: Advertisement status updated successfully
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
 *                   example: "Bad request"
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
 *       404:
 *         description: Advertisement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advertisement not found"
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
	validateRequest(updateAdvertisementSchema),
	wrapAsync(AdvertisementController.update),
)

router.delete(
	'/advertisement/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AdvertisementController.destroy),
)

router.patch(
	'/advertisement/status/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updatestatusSchema),
	wrapAsync(AdvertisementController.status),
)

export default router
