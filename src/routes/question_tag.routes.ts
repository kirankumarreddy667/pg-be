import { Router, type Router as ExpressRouter } from 'express'
import { QuestionTagController } from '@/controllers/question_tag.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { questionTagSchema } from '@/validations/question_tag.validation'

const questionTagRouter: ExpressRouter = Router()
/**
 * @swagger
 * tags:
 *   name: QuestionTag
 *   description: Question tag endpoints
 */

/**
 * @swagger
 * /question_tag:
 *   get:
 *     summary: Get all question tags
 *     tags: [QuestionTag]
 *     responses:
 *       200:
 *         description: List of question tags
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

questionTagRouter.get('/question_tag', wrapAsync(QuestionTagController.getAll))

/**
 * @swagger
 * /question_tag:
 *   post:
 *     summary: Create a new question tag
 *     tags: [QuestionTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionTag'
 *     responses:
 *       201:
 *         description: Question tag created
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
questionTagRouter.post(
	'/question_tag',
	validateRequest(questionTagSchema),
	wrapAsync(QuestionTagController.create),
)

export default questionTagRouter
