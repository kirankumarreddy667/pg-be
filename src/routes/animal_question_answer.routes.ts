import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { AnimalQuestionAnswerController } from '@/controllers/animal_question_answer.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createAnimalQuestionAnswerSchema,
	updateAnimalQuestionAnswerSchema,
	updateAnimalBreedingMilkHealthQuestionAnswerSchema,
	mapAnimalMotherToCalfSchema,
} from '@/validations/animal_question_answer.validation'
import { wrapAsync } from '@/utils/asyncHandler'

/**
 * @swagger
 * tags:
 *   name: AnimalQuestionAnswer
 *   description: Animal question answer endpoints
 */

const router: Router = Router()

/**
 * @swagger
 * /animal_question_answer:
 *   post:
 *     summary: Submit answers for animal questions
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - animal_number
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the animal
 *               animal_number:
 *                 type: string
 *                 example: "COW001"
 *                 description: The unique number/identifier for the animal
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-31"
 *                 description: Optional date for the answers (defaults to current date)
 *               answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 1
 *                       description: The ID of the question being answered
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "Cow"
 *                       description: The answer to the question
 *     responses:
 *       200:
 *         description: Answers submitted successfully
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
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The animal id field is required.
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
 *       409:
 *         description: Conflict - duplicate animal number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This animal number is already taken
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 409
 *       422:
 *         description: Validation error - invalid animal_id or question_id
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
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     answers.0.question_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected answers.0.question_id is invalid."]
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
	'/animal_question_answer',
	authenticate,
	validateRequest(createAnimalQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.store),
)

/**
 * @swagger
 * /user_animal_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal question answers for a user/animal/number
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Grouped answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Grouped questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           form_type_value:
 *                             type: string
 *                             nullable: true
 *                           language_form_type_value:
 *                             type: string
 *                             nullable: true
 *                           constant_value:
 *                             type: string
 *                             nullable: true
 *                           question_tag:
 *                             type: integer
 *                             nullable: true
 *                           question_unit:
 *                             type: integer
 *                             nullable: true
 *                           answer_date:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.userAnimalQuestionAnswer),
)

/**
 * @swagger
 * /user_animal_basic_details_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal basic details answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Basic details answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Grouped basic details questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *                           question_created_at:
 *                             type: string
 *                             format: date-time
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_basic_details_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		AnimalQuestionAnswerController.userAnimalQuestionAnswerBasicDetails,
	),
)

/**
 * @swagger
 * /user_animal_breeding_details_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal breeding details answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Breeding details answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Grouped breeding details questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_breeding_details_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		AnimalQuestionAnswerController.userAnimalQuestionAnswerBreedingDetails,
	),
)

/**
 * @swagger
 * /user_animal_milk_details_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal milk details answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Milk details answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Grouped milk details questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_milk_details_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.userAnimalQuestionAnswerMilkDetails),
)

/**
 * @swagger
 * /user_animal_birth_details_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal birth details answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Birth details answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Grouped birth details questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_birth_details_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		AnimalQuestionAnswerController.userAnimalQuestionAnswerBirthDetails,
	),
)

/**
 * @swagger
 * /user_animal_health_details_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal health details answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Health details answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Grouped health details questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_health_details_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		AnimalQuestionAnswerController.userAnimalQuestionAnswerHealthDetails,
	),
)

/**
 * @swagger
 * /user_animal_numbers_question_answer:
 *   get:
 *     summary: Get all animal numbers for the user from question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: animalNumber
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional filter to search for specific animal numbers
 *         example: "COW"
 *     responses:
 *       200:
 *         description: List of animal numbers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       animal_id:
 *                         type: integer
 *                         example: 1
 *                         description: The ID of the animal
 *                       animal_name:
 *                         type: string
 *                         example: "Cow"
 *                         description: The name of the animal
 *                       animal_number:
 *                         type: string
 *                         example: "COW001"
 *                         description: The unique number/identifier for the animal
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */

router.get(
	'/user_animal_numbers_question_answer',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.userAnimalNumbersFromQuestionAnswer),
)

/**
 * @swagger
 * /update_user_animal_basic_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal basic details question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number (unique identifier)
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 15
 *                       description: The ID of the question
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "Yes"
 *                       description: The answer to the question
 *                 minItems: 1
 *                 description: Array of question-answer pairs
 *     responses:
 *       200:
 *         description: Animal basic question answers updated successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The animal id field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     "answers.0.question_id":
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected answers.0.question_id is invalid."]
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
	'/update_user_animal_basic_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateAnimalBasicQuestionAnswers),
)

/**
 * @swagger
 * /update_user_animal_breeding_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal breeding details question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number (unique identifier)
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - date
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-31"
 *                 description: Date for the breeding details
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 15
 *                       description: The ID of the question
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "2024-08-15"
 *                       description: The answer to the question (could be AI date, doctor number, etc.)
 *                 minItems: 1
 *                 description: Array of question-answer pairs for breeding details
 *     responses:
 *       200:
 *         description: Animal breeding question answers updated successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The date field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     date:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The date field is required."]
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
	'/update_user_animal_breeding_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalBreedingMilkHealthQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateBreedingDetailsOfAnimal),
)

/**
 * @swagger
 * /update_user_animal_milk_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal milk details question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number (unique identifier)
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - date
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-31"
 *                 description: Date for the milk details
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 25
 *                       description: The ID of the question
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: 15.5
 *                       description: The answer to the question (e.g., milk yield in liters)
 *                 minItems: 1
 *                 description: Array of question-answer pairs for milk details
 *     responses:
 *       200:
 *         description: Animal milk question answers updated successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The date field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     date:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The date field is required."]
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
	'/update_user_animal_milk_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalBreedingMilkHealthQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateMilkDetailsOfAnimal),
)

/**
 * @swagger
 * /update_user_animal_birth_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal birth details question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number (unique identifier)
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 40
 *                       description: The ID of the question
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "2024-08-30"
 *                       description: The answer to the question (e.g., birth date, calf details)
 *                 minItems: 1
 *                 description: Array of question-answer pairs for birth details
 *     responses:
 *       200:
 *         description: Animal birth question answers updated successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The animal id field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     "answers.0.question_id":
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected answers.0.question_id is invalid."]
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
	'/update_user_animal_birth_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateBirthDetailsOfAnimal),
)

/**
 * @swagger
 * /update_user_animal_health_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal health details question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number (unique identifier)
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - date
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-31"
 *                 description: Date for the health details
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 50
 *                       description: The ID of the question
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "Normal"
 *                       description: The answer to the question (e.g., health, temperature)
 *                 minItems: 1
 *                 description: Array of question-answer pairs for health details
 *     responses:
 *       200:
 *         description: Animal health question answers updated successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The date field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     date:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The date field is required."]
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
	'/update_user_animal_health_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateHealthDetailsOfAnimal),
)

/**
 * @swagger
 * /update_user_animal_heat_event_question_answers/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal heat event question answers (for today)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number (unique identifier)
 *         example: "COW001"
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 60
 *                       description: The ID of the question
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "Yes"
 *                       description: The answer to the question
 *                 minItems: 1
 *                 description: Array of question-answer pairs for heat event details
 *     responses:
 *       200:
 *         description: Animal heat event question answers updated successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The animal id field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     "answers.0.question_id":
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected answers.0.question_id is invalid."]
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
	'/update_user_animal_heat_event_question_answers/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateHeatEventDetailsOfAnimal),
)

/**
 * @swagger
 * /save_user_animal_heat_event_question_answers:
 *   post:
 *     summary: Save user animal heat event question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - animal_number
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               animal_number:
 *                 type: string
 *                 example: "COW001"
 *                 description: The unique number/identifier for the animal
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-31"
 *                 description: Optional date for the answers (defaults to current date)
 *               answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 60
 *                       description: The ID of the question being answered
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                       example: "Yes"
 *                       description: The answer to the question
 *     responses:
 *       200:
 *         description: Heat event question answers saved successfully
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
 *         description: Bad request (invalid payload or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The animal id field is required."
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
 *       422:
 *         description: Validation error (invalid animal_id, question_id, etc.)
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     "answers.0.question_id":
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected answers.0.question_id is invalid."]
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
	'/save_user_animal_heat_event_question_answers',
	authenticate,
	validateRequest(createAnimalQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.saveHeatEventDetailsOfAnimal),
)

/**
 * @swagger
 * /user_animal_heat_event_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped animal heat event question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Heat event question answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   description: Grouped heat event questions and answers by category and subcategory
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                             nullable: true
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                             nullable: true
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                             nullable: true
 *                           date:
 *                             type: boolean
 *                           answer:
 *                             type: string
 *                             nullable: true
 *                           form_type_value:
 *                             type: string
 *                             nullable: true
 *                           language_form_type_value:
 *                             type: string
 *                             nullable: true
 *                           constant_value:
 *                             type: string
 *                             nullable: true
 *                           question_tag:
 *                             type: integer
 *                             nullable: true
 *                           question_unit:
 *                             type: integer
 *                             nullable: true
 *                           answer_date:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_animal_heat_event_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		AnimalQuestionAnswerController.userAnimalQuestionAnswerHeatEventDetail,
	),
)

/**
 * @swagger
 * /user_previous_heat_event_question_answers/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get previous animal heat event question answers
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the animal
 *         example: 1
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the language for localized content
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique number/identifier for the animal
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Previous heat event question answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       animal_id:
 *                         type: integer
 *                       validation_rule:
 *                         type: string
 *                         nullable: true
 *                       master_question:
 *                         type: string
 *                       language_question:
 *                         type: string
 *                         nullable: true
 *                       question_id:
 *                         type: integer
 *                       form_type:
 *                         type: string
 *                         nullable: true
 *                       date:
 *                         type: boolean
 *                       answer:
 *                         type: string
 *                         nullable: true
 *                       form_type_value:
 *                         type: string
 *                         nullable: true
 *                       language_form_type_value:
 *                         type: string
 *                         nullable: true
 *                       constant_value:
 *                         type: string
 *                         nullable: true
 *                       question_tag:
 *                         type: integer
 *                         nullable: true
 *                       question_unit:
 *                         type: integer
 *                         nullable: true
 *                       answer_date:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       animal_number:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/user_previous_heat_event_question_answers/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		AnimalQuestionAnswerController.userPreviousAnimalQuestionAnswersHeatEventDetails,
	),
)

/**
 * @swagger
 * /user_animal_lactating_status/{animal_id}/{animal_num}:
 *   get:
 *     summary: Get the lactating status of an animal for the authenticated user
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: animal_num
 *         required: true
 *         schema:
 *           type: string
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
 *                     lactating_status:
 *                       type: string
 *                       example: "Lactating"
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
	'/user_animal_lactating_status/:animal_id/:animal_num',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.getAnimalLactationStatus),
)

/**
 * @swagger
 * /user_animal_pregnancy_status/{animal_id}/{animal_num}:
 *   get:
 *     summary: Get the pregnancy status of an animal for the authenticated user
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: animal_num
 *         required: true
 *         schema:
 *           type: string
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
 *                     pregnancy_status:
 *                       type: string
 *                       example: 'Pregnant'
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
	'/user_animal_pregnancy_status/:animal_id/:animal_num',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.getAnimalPregnancyStatus),
)

/**
 * @swagger
 * /animal_calfs/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get list of calf animal numbers for an animal
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number
 *     responses:
 *       200:
 *         description: Animal calfs retrieved successfully
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
 *                     type: string
 *                     example: "CALF001"
 *                     description: The calf animal number
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
	'/animal_calfs/:animal_id/:animal_number',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.listOfAnimalCalfs),
)

/**
 * @swagger
 * /animal_delivery_dates/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get list of delivery dates for an animal
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number
 *     responses:
 *       200:
 *         description: Delivery dates retrieved successfully
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
 *                       delivery_date:
 *                         type: string
 *                         example: "2024-08-31"
 *                         description: The delivery date
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
	'/animal_delivery_dates/:animal_id/:animal_number',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.listOfAnimalDeliveryDates),
)

/**
 * @swagger
 * /save_animal_mapped_mother_calf:
 *   post:
 *     summary: Map a mother animal to a calf for a delivery date
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the animal
 *               delivery_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-31"
 *                 description: The delivery date
 *               mother_animal_number:
 *                 type: string
 *                 example: "COW001"
 *                 description: The mother animal number
 *               calf_animal_number:
 *                 type: string
 *                 example: "CALF001"
 *                 description: The calf animal number
 *             required:
 *               - animal_id
 *               - delivery_date
 *               - mother_animal_number
 *               - calf_animal_number
 *     responses:
 *       201:
 *         description: Mother-calf mapping created successfully
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
 *       206:
 *         description: Mapping already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mapping already exists"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 206
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
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     delivery_date:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The delivery date field is required."]
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
	'/save_animal_mapped_mother_calf',
	authenticate,
	validateRequest(mapAnimalMotherToCalfSchema),
	wrapAsync(AnimalQuestionAnswerController.mapAnimalMotherToCalf),
)

/**
 * @swagger
 * /attached_calfs_of_animal/{animal_id}/{mother_number}:
 *   get:
 *     summary: Get attached calfs of an animal (by mother)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *         example: 123
 *       - in: path
 *         name: mother_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Mother animal number
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: Attached calfs retrieved successfully
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
 *                       calf_number:
 *                         type: string
 *                         example: "CALF001"
 *                         description: The calf animal number
 *                       delivery_date:
 *                         type: string
 *                         example: "2024-08-31"
 *                         description: The delivery date
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
	'/attached_calfs_of_animal/:animal_id/:mother_number',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.attachedCalfOfAnimal),
)

/**
 * @swagger
 * /AI_history_of_animal/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get AI (Artificial Insemination) history of an animal
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *         example: 123
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number
 *         example: "COW001"
 *     responses:
 *       200:
 *         description: AI history retrieved successfully
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
 *                       date_of_AI:
 *                         type: string
 *                         example: "2024-08-15"
 *                         description: The date of artificial insemination
 *                       bull_no:
 *                         type: string
 *                         example: "BULL001"
 *                         description: The bull number used for insemination
 *                       mother_yield:
 *                         type: string
 *                         example: "15.5"
 *                         description: The mother's milk yield
 *                       semen_company:
 *                         type: string
 *                         example: "ABC Semen Co."
 *                         description: The semen company
 *                       answer_date:
 *                         type: string
 *                         example: "2024-08-15"
 *                         description: The date when the answer was recorded
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
	'/AI_history_of_animal/:animal_id/:animal_number',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.getAIHistoryOfAnimal),
)

export default router
