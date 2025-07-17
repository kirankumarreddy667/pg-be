import { Router, type Router as ExpressRouter } from 'express'
import { DailyRecordQuestionController } from '@/controllers/daily_record_question.controller'
import { DailyRecordQuestionAnswerController } from '@/controllers/daily_record_question_answer.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createDailyRecordQuestionsSchema,
	updateDailyRecordQuestionSchema,
	addDailyQuestionInOtherLanguageSchema,
} from '@/validations/daily_record_question.validation'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import {
	dailyRecordQuestionAnswerSchema,
	updateDailyRecordQuestionAnswerSchema,
} from '@/validations/daily_record_question_answer.validation'

/**
 * @swagger
 * /daily_record:
 *   post:
 *     summary: Add daily record questions
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               sub_category_id:
 *                 type: integer
 *                 example: 2
 *               language_id:
 *                 type: integer
 *                 example: 1
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: 'How much milk did you collect today?'
 *                     validation_rule_id:
 *                       type: integer
 *                       example: 1
 *                     form_type_id:
 *                       type: integer
 *                       example: 1
 *                     form_type_value:
 *                       type: string
 *                       example: 'text'
 *                     date:
 *                       type: boolean
 *                       example: false
 *                     question_tag:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1,2]
 *                     question_unit:
 *                       type: integer
 *                       example: 1
 *                     hint:
 *                       type: string
 *                       example: 'Enter the value in liters.'
 *                     sequence_number:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Questions added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Questions added successfully
 *                 data:
 *                   type: array
 *                   items: {}
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
const router: ExpressRouter = Router()

router.post(
	'/daily_record',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createDailyRecordQuestionsSchema),
	wrapAsync(DailyRecordQuestionController.create),
)

/**
 * @swagger
 * /daily_record:
 *   get:
 *     summary: Get all daily record questions grouped by category and subcategory
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *                           form_type:
 *                             type: string
 *                           validation_rule:
 *                             type: string
 *                           daily_record_question_id:
 *                             type: integer
 *                           date:
 *                             type: boolean
 *                           category_id:
 *                             type: integer
 *                           sub_category_id:
 *                             type: integer
 *                           validation_rule_id:
 *                             type: integer
 *                           form_type_id:
 *                             type: integer
 *                           form_type_value:
 *                             type: string
 *                           question_tag:
 *                             type: string
 *                           question_unit:
 *                             type: string
 *                           constant_value:
 *                             type: integer
 *                           question_tag_id:
 *                             type: integer
 *                           question_unit_id:
 *                             type: integer
 *                           delete_status:
 *                             type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/daily_record',
	authenticate,
	wrapAsync(DailyRecordQuestionController.index),
)

/**
 * @swagger
 * /daily_record_admin_panel:
 *   get:
 *     summary: Get all daily record questions for admin panel (grouped, with tags)
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
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
 *                   example: Success
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/daily_record_admin_panel',
	authenticate,
	wrapAsync(DailyRecordQuestionController.getAllForAdminPanel),
)

/**
 * @swagger
 * /daily_record_in_other_language:
 *   post:
 *     summary: Add a daily record question in another language
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               daily_record_question_id:
 *                 type: integer
 *                 example: 1
 *               language_id:
 *                 type: integer
 *                 example: 2
 *               question:
 *                 type: string
 *                 example: 'How much milk did you collect today?'
 *               form_type_value:
 *                 type: string
 *                 example: 'text'
 *               hint:
 *                 type: string
 *                 example: 'Enter the value in liters.'
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: This question is already added in this language
 */
router.post(
	'/daily_record_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(addDailyQuestionInOtherLanguageSchema),
	wrapAsync(DailyRecordQuestionController.addDailyQuestionsInOtherLanguage),
)

/**
 * @swagger
 * /daily_record_language/{language_id}:
 *   get:
 *     summary: Get all daily record questions in a specific language
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get(
	'/daily_record_language/:language_id',
	authenticate,
	wrapAsync(DailyRecordQuestionController.getDailyQuestionsInOtherLanguage),
)

/**
 * @swagger
 * /daily_record_question_answer:
 *   post:
 *     summary: Add a daily record question answer
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               daily_record_question_id:
 *                 type: integer
 *                 example: 1
 *               answer:
 *                 type: string
 *                 example: '10 liters'
 *               date:
 *                 type: boolean
 *                 example: false
 *               question_tag:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2]
 *               question_unit:
 *                 type: integer
 *                 example: 1
 *               hint:
 *                 type: string
 *                 example: 'Enter the value in liters.'
 *     responses:
 *       201:
 *         description: Answer added successfully
 *       422:
 *         description: Validation error
 */
router.post(
	'/daily_record_question_answer',
	authenticate,
	validateRequest(dailyRecordQuestionAnswerSchema),
	wrapAsync(DailyRecordQuestionAnswerController.create),
)

/**
 * @swagger
 * /daily_record/{id}:
 *   put:
 *     summary: Update a daily record question
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id: { type: integer }
 *               sub_category_id: { type: integer }
 *               question: { type: string }
 *               validation_rule_id: { type: integer }
 *               form_type_id: { type: integer }
 *               date: { type: boolean }
 *               form_type_value: { type: string }
 *               question_tag_id: { type: array, items: { type: integer } }
 *               question_unit_id: { type: integer }
 *               hint: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.put(
	'/daily_record/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateDailyRecordQuestionSchema),
	wrapAsync(DailyRecordQuestionController.update),
)

/**
 * @swagger
 * /update_daily_record_language/{id}:
 *   put:
 *     summary: Update a daily record question translation in another language
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addDailyQuestionInOtherLanguageSchema'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation error
 */
router.put(
	'/update_daily_record_language/:id',
	authenticate,
	validateRequest(addDailyQuestionInOtherLanguageSchema),
	wrapAsync(
		DailyRecordQuestionController.updateDailyRecordQuestionInOtherLanguage,
	),
)

/**
 * @swagger
 * /update_daily_record_question_answer/:id:
 *   put:
 *     summary: Update a daily record question answer
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer: { type: string }
 *               date: { type: boolean }
 *               question_tag: { type: array, items: { type: integer } }
 *               question_unit: { type: integer }
 *               hint: { type: string }
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation error
 */
router.put(
	'/update_daily_record_question_answer/:id',
	authenticate,
	validateRequest(updateDailyRecordQuestionAnswerSchema),
	wrapAsync(DailyRecordQuestionAnswerController.update),
)

/**
 * @swagger
 * /daily_record/{id}:
 *   delete:
 *     summary: Delete a daily record question (soft delete)
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Something went wrong. Please try again
 */
router.delete(
	'/daily_record/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(DailyRecordQuestionController.delete),
)

router.get(
	'/get_daily_record_question_with_answer/:language_id/:date',
	authenticate,
	wrapAsync(
		DailyRecordQuestionAnswerController.getDailyRecordQuestionsWithAnswers,
	)
)

/**
 * @swagger
 * /get_biosecurity_spray_details:
 *   get:
 *     summary: Get biosecurity spray details for the authenticated user
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
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
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-07-18T00:00:00.000Z'
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-08-17T00:00:00.000Z'
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/get_biosecurity_spray_details',
	authenticate,
	wrapAsync(DailyRecordQuestionAnswerController.getBioSecuritySprayDetails),
)

/**
 * @swagger
 * /get_deworming_details:
 *   get:
 *     summary: Get deworming details for the authenticated user
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
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
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-07-18T00:00:00.000Z'
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-16T00:00:00.000Z'
 *       401:
 *         description: Unauthorized
 */
router.get(
	'/get_deworming_details',
	authenticate,
	wrapAsync(DailyRecordQuestionAnswerController.getDewormingDetails),
)

export default router
