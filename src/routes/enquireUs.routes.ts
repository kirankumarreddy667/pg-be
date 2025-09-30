import { Router } from 'express'
import { EnquireUsController } from '@/controllers/enquireUs.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { createEnquirySchema } from '@/validations/enquireUs.validator'
import { authenticate } from '@/middlewares/auth.middleware'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: EnquireUs
 *   description: Endpoints for user enquiries
 */

/**
 * @swagger
 * /enquire_us:
 *   post:
 *     summary: Submit an enquiry
 *     tags: [EnquireUs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               query:
 *                 type: string
 *                 example: "I want to know more about your plans"
 *             required:
 *               - first_name
 *               - email
 *               - phone
 *               - query
 *     responses:
 *       200:
 *         description: Enquiry submitted successfully
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
	'/enquire_us',
	authenticate,
	validateRequest(createEnquirySchema),
	wrapAsync(EnquireUsController.createEnquiry),
)

/**
 * @swagger
 * /enquire_us:
 *   get:
 *     summary: Get all enquiries
 *     tags: [EnquireUs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all enquiries
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
 *                         example: 5
 *                       first_name:
 *                         type: string
 *                         example: "John"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "9876543210"
 *                       query:
 *                         type: string
 *                         example: "I want to know more about your plans"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-18 10:00:00"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-18 12:00:00"
 *                       deleted_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
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
router.get('/enquire_us', authenticate, wrapAsync(EnquireUsController.listAll))

export default router
