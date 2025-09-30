import { Router, type Router as ExpressRouter } from 'express'
import { QuestionTagController } from '@/controllers/question_tag.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { questionTagSchema } from '@/validations/question_tag.validation'
import { authenticate } from '@/middlewares/auth.middleware'

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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of question tags
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
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Health"
 *                       description:
 *                         type: string
 *                         example: "Health"
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

questionTagRouter.get(
	'/question_tag',
	authenticate,
	wrapAsync(QuestionTagController.getAll),
)

/**
 * @swagger
 * /question_tag:
 *   post:
 *     summary: Create a new question tag
 *     tags: [QuestionTag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Health", "Breeding"]
 *             required:
 *               - tags
 *     responses:
 *       200:
 *         description: Question tag created
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
questionTagRouter.post(
	'/question_tag',
	authenticate,
	validateRequest(questionTagSchema),
	wrapAsync(QuestionTagController.create),
)

export default questionTagRouter
