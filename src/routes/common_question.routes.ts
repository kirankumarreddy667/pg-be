import { Router } from 'express'
import { CommonQuestionController } from '@/controllers/common_question.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createCommonQuestionSchema,
	updateCommonQuestionSchema,
	addQuestionInOtherLanguageSchema,
	updateQuestionInOtherLanguageSchema,
} from '@/validations/common_question.validation'

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
 *             $ref: '#/components/schemas/CreateCommonQuestionRequest'
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *             $ref: '#/components/schemas/UpdateCommonQuestionRequest'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/question/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(CommonQuestionController.show),
)

/**
 * @swagger
 * /all_question:
 *   get:
 *     summary: Get all questions
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id: { type: integer, example: 1 }
 *                       category_name: { type: string, example: "Cattle" }
 *                       sub_category_id: { type: integer, example: 2 }
 *                       sub_category_name: { type: string, example: "Dairy" }
 *                       question: { type: string, example: "What is the breed?" }
 *                       form_type: { type: string, example: "Text" }
 *                       validation_rule: { type: string, example: "Required" }
 *                       qiestion_id: { type: integer, example: 10 }
 *                       validation_rule_id: { type: integer, example: 5 }
 *                       form_type_id: { type: integer, example: 3 }
 *                       date: { type: boolean, example: false }
 *                       form_type_value: { type: string, example: null }
 *                       constant_value: { type: integer, example: 1 }
 *                       question_tag: { type: string, example: "General" }
 *                       question_unit: { type: string, example: "Kg" }
 *                       question_tag_id: { type: integer, example: 1 }
 *                       question_unit_id: { type: integer, example: 2 }
 *                       hint: { type: string, example: null }
 */
router.get(
	'/all_question',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
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
 *                 example: null
 *               hint:
 *                 type: string
 *                 example: null
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *       400:
 *         description: This question is already added in this language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
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
 *                 example: null
 *               hint:
 *                 type: string
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
 *                 data:
 *                   type: array
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put(
	'/update_question_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateQuestionInOtherLanguageSchema),
	wrapAsync(CommonQuestionController.updateOtherLanguageQuestion),
)

/**
 * @swagger
 * /get_all_questions_based_on_language/{id}:
 *   get:
 *     summary: Get all questions grouped by category/subcategory for a language
 *     tags: [CommonQuestions]
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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/get_all_questions_based_on_language/:id',
	CommonQuestionController.getAllQuestionsBasedOnLanguage,
)

export default router
