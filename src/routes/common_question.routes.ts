import { Router } from 'express'
import { CommonQuestionController } from '@/controllers/common_question.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createCommonQuestionSchema,
	updateCommonQuestionSchema,
	addQuestionInOtherLanguageSchema,
} from '@/validations/common_question.validation'

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management endpoints
 */

/**
 * @swagger
 * tags:
 *   name: CommonQuestions
 *   description: Common question management endpoints
 */
const router: Router = Router()

/**
 * @swagger
 * /question:
 *   post:
 *     summary: Create a new common question
 *     tags: [Questions]
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
 *                 nullable: true
 *                 example: 2
 *               language_id:
 *                 type: integer
 *                 example: 1
 *               questions:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "What is your age?"
 *                     validation_rule_id:
 *                       type: integer
 *                       example: 3
 *                     form_type_id:
 *                       type: integer
 *                       example: 2
 *                     date:
 *                       type: integer
 *                       enum: [0, 1]
 *                       example: 1
 *                     question_tag:
 *                       type: integer
 *                       example: 5
 *                     question_unit:
 *                       type: integer
 *                       example: 4
 *                     form_type_value:
 *                       type: string
 *                       nullable: true
 *                       example: "Dropdown"
 *                     hint:
 *                       type: string
 *                       nullable: true
 *                       example: "Enter your age in years"
 *             required:
 *               - category_id
 *               - language_id
 *               - questions
 *     responses:
 *       200:
 *         description: Questions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Questions added successfully"
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
 *                   example:
 *                     category_id: ["The selected category id is invalid."]
 *                     questions.0.question: ["questions.0.question has already been taken."]
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
	'/question',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createCommonQuestionSchema),
	wrapAsync(CommonQuestionController.create),
)

/**
 * @swagger
 * /question/{id}:
 *   put:
 *     summary: Update a common question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Question ID
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
 *                 nullable: true
 *                 example: 2
 *               question:
 *                 type: string
 *                 example: "What is your updated age?"
 *               validation_rule_id:
 *                 type: integer
 *                 example: 3
 *               form_type_id:
 *                 type: integer
 *                 example: 2
 *               date:
 *                 type: boolean
 *                 example: true
 *               form_type_value:
 *                 type: string
 *                 nullable: true
 *                 example: "Dropdown"
 *               question_tag_id:
 *                 type: integer
 *                 example: 5
 *               question_unit_id:
 *                 type: integer
 *                 example: 4
 *               hint:
 *                 type: string
 *                 nullable: true
 *                 example: "Provide age in years"
 *             required:
 *               - category_id
 *               - question
 *               - validation_rule_id
 *               - form_type_id
 *               - date
 *               - question_tag_id
 *               - question_unit_id
 *     responses:
 *       200:
 *         description: Updated successfully
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
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found"
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
 *                   example:
 *                     question: ["The question has already been taken."]
 *                     category_id: ["The selected category id is invalid."]
 *                     sub_category_id: ["The selected sub category id is invalid."]
 *                     validation_rule_id: ["The selected validation rule id is invalid."]
 *                     form_type_id: ["The selected form type id is invalid."]
 *                     question_tag_id: ["The selected question tag id is invalid."]
 *                     question_unit_id: ["The selected question unit id is invalid."]
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
	'/question/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateCommonQuestionSchema),
	wrapAsync(CommonQuestionController.update),
)

/**
 * @swagger
 * /question/{id}:
 *   delete:
 *     summary: Delete a common question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Deleted successfully
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
 *                   example: []
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
	'/question/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(CommonQuestionController.destroy),
)

/**
 * @swagger
 * /question/{id}:
 *   get:
 *     summary: Get a common question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Question ID
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
 *                   properties:
 *                     category_name:
 *                       type: string
 *                       nullable: true
 *                       example: "Health"
 *                     sub_category_name:
 *                       type: string
 *                       nullable: true
 *                       example: "Mental Health"
 *                     validation_rule:
 *                       type: string
 *                       nullable: true
 *                       example: "Required"
 *                     question:
 *                       type: string
 *                       example: "What is your age?"
 *                     form_type:
 *                       type: string
 *                       nullable: true
 *                       example: "Input"
 *                     question_id:
 *                       type: integer
 *                       example: 12
 *                     date:
 *                       type: boolean
 *                       example: 0
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
 */

router.get(
	'/question/:id',
	authenticate,
	wrapAsync(CommonQuestionController.show),
)

/**
 * @swagger
 * /all_question:
 *   get:
 *     summary: Get all questions grouped by category and subcategory
 *     tags: [Questions]
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
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category_id: { type: integer, example: 1 }
 *                           sub_category_id: { type: integer, example: 2 }
 *                           question_id: { type: integer, example: 10 }
 *                           question: { type: string, example: "What is the breed?" }
 *                           form_type: { type: string, example: "Text" }
 *                           validation_rule: { type: string, example: "Required" }
 *                           form_type_id: { type: integer, example: 3 }
 *                           validation_rule_id: { type: integer, example: 5 }
 *                           date: { type: boolean, example: false }
 *                           form_type_value: { type: string, example: null }
 *                           constant_value: { type: integer, example: 1 }
 *                           question_tag: { type: string, example: "General" }
 *                           question_unit: { type: string, example: "Kg" }
 *                           question_tag_id: { type: integer, example: 1 }
 *                           question_unit_id: { type: integer, example: 2 }
 *                           hint: { type: string, example: null }
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
 */

router.get(
	'/all_question',
	authenticate,
	wrapAsync(CommonQuestionController.listAll),
)

/**
 * @swagger
 * /add_question_in_other_language:
 *   post:
 *     summary: Add a question in another language
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *               - language_id
 *               - question
 *             properties:
 *               question_id:
 *                 type: integer
 *                 example: 1
 *               language_id:
 *                 type: integer
 *                 example: 2
 *               question:
 *                 type: string
 *                 example: "What is the breed?"
 *               form_type_value:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               hint:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Question added successfully
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
 *       400:
 *         description: Bad Request - Already exists or validation error
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
 *                     question_id: ["The selected question id is invalid"]
 *                     language_id: ["The selected language id is invalid"]
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
 */

router.post(
	'/add_question_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(addQuestionInOtherLanguageSchema),
	wrapAsync(CommonQuestionController.addQuestionsInOtherLanguage),
)

/**
 * @swagger
 * /update_question_in_other_language/{id}:
 *   put:
 *     summary: Update a question in another language
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The question_language record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *               - language_id
 *               - question
 *             properties:
 *               question_id:
 *                 type: integer
 *                 example: 1
 *               language_id:
 *                 type: integer
 *                 example: 2
 *               question:
 *                 type: string
 *                 example: "What is the breed?"
 *               form_type_value:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               hint:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Updated successfully
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
 *       400:
 *         description: Bad Request - Already exists or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This question is already added in this language"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Not Found - Question language record does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question language record not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 */

router.put(
	'/update_question_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(addQuestionInOtherLanguageSchema),
	wrapAsync(CommonQuestionController.updateOtherLanguageQuestion),
)

/**
 * @swagger
 * /get_all_questions_based_on_language/{id}:
 *   get:
 *     summary: Get all questions grouped by category/subcategory for a language
 *     tags: [CommonQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
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
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           validation_rule:
 *                             type: string
 *                             example: "Required"
 *                           master_question:
 *                             type: string
 *                             example: "What is your age?"
 *                           language_question:
 *                             type: string
 *                             example: "¿Cuál es tu edad?"
 *                           question_id:
 *                             type: integer
 *                             example: 5
 *                           form_type:
 *                             type: string
 *                             example: "Text"
 *                           date:
 *                             type: boolean
 *                             example: false
 *                           form_type_value:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           question_language_id:
 *                             type: integer
 *                             example: 12
 *                           category_id:
 *                             type: integer
 *                             example: 1
 *                           sub_category_id:
 *                             type: integer
 *                             example: 2
 *                           validation_rule_id:
 *                             type: integer
 *                             example: 3
 *                           language_form_type_value:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           language_hint:
 *                             type: string
 *                             nullable: true
 *                             example: "Tu edad en años"
 *                           master_hint:
 *                             type: string
 *                             nullable: true
 *                             example: "Enter age in years"
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
 */

router.get(
	'/get_all_questions_based_on_language/:id',
	authenticate,
	wrapAsync(CommonQuestionController.getAllQuestionsBasedOnLanguage),
)

export default router
