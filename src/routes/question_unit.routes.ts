import { Router, type Router as ExpressRouter } from 'express'
import { QuestionUnitController } from '@/controllers/question_unit.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate } from '@/middlewares/auth.middleware'

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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of question units
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
 *                         example: "Liters"
 *                       description:
 *                         type: string
 *                         example: "description"
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

questionUnitRouter.get(
	'/question_unit',
	authenticate,
	wrapAsync(QuestionUnitController.getAll),
)

export default questionUnitRouter
