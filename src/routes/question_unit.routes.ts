import { Router, type Router as ExpressRouter } from 'express'
import { QuestionUnitController } from '@/controllers/question_unit.controller'
import { wrapAsync } from '@/utils/asyncHandler'

const questionUnitRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: QuestionUnit
 *   description: Question unit endpoints
 */

/**
 * @swagger
 * /question_unit:
 *   get:
 *     summary: Get all question units
 *     tags: [QuestionUnit]
 *     responses:
 *       200:
 *         description: List of question units
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

questionUnitRouter.get(
	'/question_unit',
	wrapAsync(QuestionUnitController.getAll),
)

export default questionUnitRouter
