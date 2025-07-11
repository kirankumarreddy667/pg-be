import { Router } from 'express'
import { ContactUsController } from '@/controllers/contact_us.controller'

/**
 * @swagger
 * tags:
 *   name: ContactUs
 *   description: Contact Us endpoints
 */

/**
 * @swagger
 * /contact_us:
 *   post:
 *     summary: Submit a contact us request
 *     tags: [ContactUs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactUs'
 *     responses:
 *       201:
 *         description: Contact request submitted
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

const router: Router = Router()

router.get('/contact_us_detail', ContactUsController.getContactUs)

export default router
