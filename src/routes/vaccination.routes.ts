import { Router } from 'express'
import { VaccinationController } from '../controllers/vaccination.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { createVaccinationDetailSchema } from '../validations/vaccination.validation'
import { validateRequest } from '../middlewares/validateRequest'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: Vaccination
 *   description: Vaccination management endpoints
 */

/**
 * @swagger
 * /vaccination_detail:
 *   post:
 *     summary: Save vaccination detail
 *     tags: [Vaccination]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expense:
 *                 type: number
 *                 example: 100.50
 *               record_date:
 *                 type: string
 *                 format: date
 *                 example: '2024-07-15'
 *               animal_numbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A123", "B456"]
 *               vaccination_type_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *             required:
 *               - expense
 *               - record_date
 *               - animal_numbers
 *               - vaccination_type_ids
 *     responses:
 *       201:
 *         description: Vaccination detail added successfully
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
	'/vaccination_detail',
	authenticate,
	validateRequest(createVaccinationDetailSchema),
	wrapAsync(VaccinationController.create),
)

/**
 * @swagger
 * /vaccination_all_type:
 *   get:
 *     summary: Get all vaccination types
 *     tags: [Vaccination]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vaccination types
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
	'/vaccination_all_type',
	authenticate,
	wrapAsync(VaccinationController.listAllType),
)

export default router
