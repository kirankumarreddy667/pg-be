import { Router, type Router as ExpressRouter } from 'express'
import { DailyRecordQuestionController } from '@/controllers/daily_record_question.controller'
import { DailyRecordQuestionAnswerController } from '@/controllers/daily_record_question_answer.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createDailyRecordQuestionsSchema,
	updateDailyRecordQuestionSchema,
	addDailyQuestionInOtherLanguageSchema,
	updateDailyQuestionInOtherLanguageSchema,
} from '@/validations/daily_record_question.validation'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import {
	dailyRecordQuestionAnswerSchema,
	updateDailyRecordQuestionAnswerSchema,
} from '@/validations/daily_record_question_answer.validation'

/**
 * @swagger
 * tags:
 *   name: DailyRecordQuestions
 *   description: Daily record question management endpoints
 */
const router: ExpressRouter = Router()

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
 *             required:
 *               - category_id
 *               - language_id
 *               - questions
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *                 description: The category ID for the questions
 *               sub_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *                 description: The subcategory ID for the questions (optional)
 *               language_id:
 *                 type: integer
 *                 example: 1
 *                 description: The language ID for the questions
 *               questions:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - validation_rule_id
 *                     - form_type_id
 *                     - question_tag
 *                     - question_unit
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
 *                       nullable: true
 *                       example: 'text'
 *                     date:
 *                       type: integer
 *                       enum: [0, 1]
 *                       example: 0
 *                     question_tag:
 *                       type: array
 *                       minItems: 1
 *                       items:
 *                         type: integer
 *                       example: [1, 2]
 *                     question_unit:
 *                       type: integer
 *                       example: 1
 *                     hint:
 *                       type: string
 *                       nullable: true
 *                       example: 'Enter the value in liters.'
 *                     sequence_number:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
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
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The category id field is required."]
 *                     language_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The language id field is required."]
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The questions field is required."]
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                   example: The given data was invalid.
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.post(
	'/daily_record',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createDailyRecordQuestionsSchema),
	wrapAsync(DailyRecordQuestionController.create),
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
 *         description: Daily record question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - question
 *               - validation_rule_id
 *               - form_type_id
 *               - date
 *               - question_tag_id
 *               - question_unit_id
 *               - hint
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *                 description: The category ID
 *               sub_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *                 description: The subcategory ID (optional)
 *               question:
 *                 type: string
 *                 example: 'Updated question text'
 *                 description: The question text
 *               validation_rule_id:
 *                 type: integer
 *                 example: 1
 *                 description: The validation rule ID
 *               form_type_id:
 *                 type: integer
 *                 example: 1
 *                 description: The form type ID
 *               date:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 0
 *                 description: Date flag (0 = false, 1 = true)
 *               form_type_value:
 *                 type: string
 *                 nullable: true
 *                 example: 'text'
 *                 description: Form type value (optional)
 *               question_tag_id:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *                 description: Array of question tag IDs
 *               question_unit_id:
 *                 type: integer
 *                 example: 1
 *                 description: The question unit ID
 *               hint:
 *                 type: string
 *                 example: 'Updated hint text'
 *                 description: The hint text
 *     responses:
 *       200:
 *         description: Daily record question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The category id field is required."]
 *                     question:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The question field is required."]
 *                     validation_rule_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The validation rule id field is required."]
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Daily record question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Daily record question not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *                   description: Grouped questions by category and subcategory
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
 *                   example: Unauthorized
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *                   description: Grouped questions by category and subcategory
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
 *                           hint:
 *                             type: string
 *                           question_tags:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 question_tag_id:
 *                                   type: integer
 *                                 question_tag_name:
 *                                   type: string
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
 *                   example: Unauthorized
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.get(
	'/daily_record_admin_panel',
	authenticate,
	wrapAsync(DailyRecordQuestionController.getAllForAdminPanel),
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
 *         description: Daily record question ID
 *     responses:
 *       200:
 *         description: Daily record question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Something went wrong. Please try again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Daily record question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Daily record question not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.delete(
	'/daily_record/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(DailyRecordQuestionController.delete),
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
 *             required:
 *               - daily_record_question_id
 *               - language_id
 *               - question
 *             properties:
 *               daily_record_question_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the daily record question
 *               language_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the target language
 *               question:
 *                 type: string
 *                 example: 'How much milk did you collect today?'
 *                 description: Question text in the target language
 *               form_type_value:
 *                 type: string
 *                 nullable: true
 *                 example: 'text'
 *                 description: Optional form type value
 *     responses:
 *       200:
 *         description: Question added successfully in the target language
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
 *       403:
 *         description: Forbidden - SuperAdmin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 403
 *       422:
 *         description: Validation error or question already exists in this language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This question is already added in this language"
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example:
 *                     daily_record_question_id: ["The selected daily record question id is invalid."]
 *                     language_id: ["The selected language id is invalid."]
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
 *         description: Language ID to get questions for
 *         example: 2
 *     responses:
 *       200:
 *         description: List of daily record questions in the specified language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items: {}
 *                       example: []
 *                     - type: object
 *                       additionalProperties:
 *                         type: object
 *                         additionalProperties:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               daily_record_question_id:
 *                                 type: integer
 *                                 example: 1
 *                               master_question:
 *                                 type: string
 *                                 example: "How much milk did you collect today?"
 *                               question_in_other_language:
 *                                 type: string
 *                                 example: "आज आपने कितना दूध एकत्र किया?"
 *                               validation_rule:
 *                                 type: string
 *                                 example: "numeric"
 *                               form_type:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "input"
 *                               date:
 *                                 type: string
 *                                 example: "2024-01-15"
 *                               form_type_value:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "text"
 *                               language_form_type_value:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "text"
 *                               question_tag:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "milk_collection"
 *                               question_unit:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "liters"
 *                               constant_value:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               daily_record_questions_language_id:
 *                                 type: integer
 *                                 example: 123
 *                               delete_status:
 *                                 type: integer
 *                                 example: 0
 *                               language_hint:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "लीटर में मान दर्ज करें"
 *                               master_hint:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "Enter the value in liters"
 *                               created_at:
 *                                 type: string
 *                                 example: "2024-01-15T10:30:00Z"
 *                       example:
 *                         "Milk Production":
 *                           "Daily Collection":
 *                             - daily_record_question_id: 1
 *                               master_question: "How much milk did you collect today?"
 *                               question_in_other_language: "आज आपने कितना दूध एकत्र किया?"
 *                               validation_rule: "numeric"
 *                               form_type: "input"
 *                               date: "2024-01-15"
 *                               form_type_value: "text"
 *                               language_form_type_value: "text"
 *                               question_tag: "milk_collection"
 *                               question_unit: "liters"
 *                               constant_value: null
 *                               daily_record_questions_language_id: 123
 *                               delete_status: 0
 *                               language_hint: "लीटर में मान दर्ज करें"
 *                               master_hint: "Enter the value in liters"
 *                               created_at: "2024-01-15T10:30:00Z"
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

router.get(
	'/daily_record_language/:language_id',
	authenticate,
	wrapAsync(DailyRecordQuestionController.getDailyQuestionsInOtherLanguage),
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
 *         description: Daily record question language ID
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - daily_record_question_id
 *               - language_id
 *               - question
 *             properties:
 *               daily_record_question_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the daily record question
 *               language_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the target language
 *               question:
 *                 type: string
 *                 example: 'आज आपने कितना दूध एकत्र किया?'
 *                 description: Updated question text in the target language
 *               form_type_value:
 *                 type: string
 *                 nullable: true
 *                 example: 'text'
 *                 description: Optional form type value
 *               hint:
 *                 type: string
 *                 nullable: true
 *                 example: 'लीटर में मान दर्ज करें'
 *                 description: Optional hint text in the target language
 *     responses:
 *       200:
 *         description: Question translation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Updated successfully."
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
 *       404:
 *         description: Daily record question language not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The selected id is invalid."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["The selected id is invalid."]
 *                 status:
 *                   type: integer
 *                   example: 404
 *       422:
 *         description: Validation error or question already exists in this language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   oneOf:
 *                     - type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: string
 *                       example:
 *                         daily_record_question_id: ["The selected daily record question id is invalid."]
 *                         language_id: ["The selected language id is invalid."]
 *                     - type: array
 *                       items:
 *                         type: string
 *                       example: ["This question is already added in this language"]
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
router.put(
	'/update_daily_record_language/:id',
	authenticate,
	validateRequest(updateDailyQuestionInOtherLanguageSchema),
	wrapAsync(
		DailyRecordQuestionController.updateDailyRecordQuestionInOtherLanguage,
	),
)

/**
 * @swagger
 * /daily_record_question_answer:
 *   post:
 *     summary: Add daily record question answers
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
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 1
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "10 liters"
 *                       example: [{"name": "10 liters"}]
 *                   required:
 *                     - question_id
 *                     - answer
 *               date:
 *                 type: string
 *                 format: date
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2024-01-15"
 *             required:
 *               - answers
 *               - date
 *     responses:
 *       200:
 *         description: Answers added successfully
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
router.post(
	'/daily_record_question_answer',
	authenticate,
	validateRequest(dailyRecordQuestionAnswerSchema),
	wrapAsync(DailyRecordQuestionAnswerController.create),
)

/**
 * @swagger
 * /update_daily_record_question_answer/{id}:
 *   put:
 *     summary: Update daily record question answers
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: user_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     daily_record_answer_id:
 *                       type: integer
 *                       example: 1
 *                     answer:
 *                       type: string
 *                       example: "15 liters"
 *                   required:
 *                     - daily_record_answer_id
 *                     - answer
 *               date:
 *                 type: string
 *                 format: date
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2024-01-15"
 *             required:
 *               - answers
 *               - date
 *     responses:
 *       200:
 *         description: Answers updated successfully
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
 *       404:
 *         description: Daily record answer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Daily record answer not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
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
router.put(
	'/update_daily_record_question_answer/:id',
	authenticate,
	validateRequest(updateDailyRecordQuestionAnswerSchema),
	wrapAsync(DailyRecordQuestionAnswerController.update),
)

/**
 * @swagger
 * /get_daily_record_question_with_answer/{language_id}/{date}:
 *   get:
 *     summary: Get daily record questions with answers for a specific date and language
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *         example: 2
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Daily record questions with answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question_id:
 *                             type: integer
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                           form_type:
 *                             type: string
 *                           validation_rule:
 *                             type: string
 *                           answer:
 *                             type: [object, "null"]
 *                             description: Can be null or an array of objects
 *                           form_type_value:
 *                             type: [string, "null"]
 *                           language_form_type_value:
 *                             type: [string, "null"]
 *                           constant_value:
 *                             type: integer
 *                           question_tag:
 *                             type: integer
 *                           question_unit:
 *                             type: integer
 *                           delete_status:
 *                             type: integer
 *                           hint:
 *                             type: [string, "null"]
 *                           hint1:
 *                             type: [string, "null"]
 *                           sequence_number:
 *                             type: integer
 *                           created_at:
 *                             type: string
 *                             format: date-time
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

router.get(
	'/get_daily_record_question_with_answer/:language_id/:date',
	authenticate,
	wrapAsync(
		DailyRecordQuestionAnswerController.getDailyRecordQuestionsWithAnswers,
	),
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
 *         description: Biosecurity spray details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-18 00:00:00"
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-17 00:00:00"
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
router.get(
	'/get_biosecurity_spray_details',
	authenticate,
	wrapAsync(DailyRecordQuestionAnswerController.getBioSecuritySprayDetails),
)

/**
 * @swagger
 * /get_dewarming_details:
 *   get:
 *     summary: Get deworming details for the authenticated user
 *     tags: [DailyRecordQuestions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deworming details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-18 00:00:00"
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-16 00:00:00"
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
router.get(
	'/get_dewarming_details',
	authenticate,
	wrapAsync(DailyRecordQuestionAnswerController.getDewormingDetails),
)

export default router
