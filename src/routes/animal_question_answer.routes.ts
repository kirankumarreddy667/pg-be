import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { AnimalQuestionAnswerController } from '@/controllers/animal_question_answer.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createAnimalQuestionAnswerSchema,
	updateAnimalQuestionAnswerSchema,
	updateAnimalBreedingMilkHealthQuestionAnswerSchema,
	updateAnimalBirthQuestionAnswerSchema,
	saveAnimalHeatEventQuestionAnswerSchema,
	updateAnimalHeatEventQuestionAnswerSchema,
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
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       409:
 *         description: Duplicate animal number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *     responses:
 *       200:
 *         description: List of animal numbers
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
	'/user_animal_numbers_question_answer',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.userAnimalNumbersFromQuestionAnswer),
)

/**
 * @swagger
 * /update_user_animal_basic_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal basic details question answers (for today)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *     summary: Update user animal breeding details question answers (for today)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *     summary: Update user animal milk details question answers (for today)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *     summary: Update user animal birth details question answers (for today)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.put(
	'/update_user_animal_birth_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalBirthQuestionAnswerSchema),
	wrapAsync(AnimalQuestionAnswerController.updateBirthDetailsOfAnimal),
)

/**
 * @swagger
 * /update_user_animal_health_question_answer/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update user animal health details question answers (for today)
 *     tags: [AnimalQuestionAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.put(
	'/update_user_animal_health_question_answer/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalBreedingMilkHealthQuestionAnswerSchema),
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
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.put(
	'/update_user_animal_heat_event_question_answers/:animal_number/:animal_id',
	authenticate,
	validateRequest(updateAnimalHeatEventQuestionAnswerSchema),
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
 *             $ref: '#/components/schemas/CreateAnimalQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Success
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
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/save_user_animal_heat_event_question_answers',
	authenticate,
	validateRequest(saveAnimalHeatEventQuestionAnswerSchema),
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Grouped answers
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Previous heat event answers
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
 *                     answer:
 *                       type: string
 *                       example: 'Lactating'
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-07-18T00:00:00.000Z'
 *                     question_id:
 *                       type: integer
 *                       example: 123
 *       401:
 *         description: Unauthorized
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
 */
router.get(
	'/user_animal_pregnancy_status/:animal_id/:animal_num',
	authenticate,
	wrapAsync(AnimalQuestionAnswerController.getAnimalPregnancyStatus),
)

export default router
