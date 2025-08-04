import { Router } from 'express'
import { EnquireUsController } from '@/controllers/enquireUs.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { createEnquirySchema } from '@/validations/enquireUs.validator'

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnquireUsRequest'
 *     responses:
 *       201:
 *         description: Enquiry submitted successfully
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
  '/enquire_us',
  validateRequest(createEnquirySchema),
  wrapAsync(EnquireUsController.createEnquiry)
)

/**
 * @swagger
 * /enquire_us:
 *   get:
 *     summary: Get all enquiries
 *     tags: [EnquireUs]
 *     responses:
 *       200:
 *         description: List of all enquiries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnquireUsResponse'
 */
router.get(
  '/enquire_us',
  wrapAsync(EnquireUsController.listAll)
)

export default router
