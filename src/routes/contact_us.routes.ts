import { Router } from 'express'
import { ContactUsController } from '@/controllers/contact_us.controller'
import { wrapAsync } from '@/utils/asyncHandler'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: ContactUs
 *   description: Contact Us endpoints
 */

/**
 * @swagger
 * /contact_us_detail:
 *   get:
 *     summary: Get all submitted contact us requests
 *     tags: [ContactUs]
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       whatsapp:
 *                         type: string
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Failed to retrieve contact requests. Please try again."
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.get('/contact_us_detail', wrapAsync(ContactUsController.getContactUs))

export default router
