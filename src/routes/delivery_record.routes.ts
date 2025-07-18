import { Router } from 'express'
import { DeliveryRecordController } from '@/controllers/delivery_record.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { addAnimalRecordDeliveryQuestionAnswerSchema } from '@/validations/delivery_record.validation'
import { wrapAsync } from '@/utils/asyncHandler'

/**
 * @swagger
 * tags:
 *   name: DeliveryRecord
 *   description: Animal delivery record endpoints
 */

const router: Router = Router()

/**
 * @swagger
 * /save_user_animal_record_delivery_question_answer:
 *   post:
 *     summary: Save delivery record answers for an animal
 *     tags: [DeliveryRecord]
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
 *               animal_number:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     answer:
 *                       type: string
 *             required:
 *               - animal_id
 *               - animal_number
 *               - answers
 *     responses:
 *       201:
 *         description: Record saved successfully
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
router.post(
	'/save_user_animal_record_delivery_question_answer',
	authenticate,
	validateRequest(addAnimalRecordDeliveryQuestionAnswerSchema),
	wrapAsync(DeliveryRecordController.saveRecordDeliveryOfAnimal),
)

/**
 * @swagger
 * /update_user_animal_record_delivery_question_answers/{animal_number}/{animal_id}:
 *   put:
 *     summary: Update delivery record answers for an animal
 *     tags: [DeliveryRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number
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
 *             properties:
 *               animal_id:
 *                 type: integer
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     answer:
 *                       type: string
 *             required:
 *               - animal_id
 *               - answers
 *     responses:
 *       201:
 *         description: Record updated successfully
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
router.put(
	'/update_user_animal_record_delivery_question_answers/:animal_number/:animal_id',
	authenticate,
	validateRequest(addAnimalRecordDeliveryQuestionAnswerSchema),
	wrapAsync(DeliveryRecordController.updateRecordDeliveryOfAnimal),
)

/**
 * @swagger
 * /user_animal_record_delivery_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get grouped delivery record answers for an animal (latest record)
 *     tags: [DeliveryRecord]
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
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number
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
 *                   type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/user_animal_record_delivery_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(DeliveryRecordController.userAnimalQuestionAnswerRecordDelivery),
)

/**
 * @swagger
 * /user_animal_all_record_delivery_question_answer/{animal_id}/{language_id}/{animal_number}:
 *   get:
 *     summary: Get all grouped delivery record answers for an animal (all records)
 *     tags: [DeliveryRecord]
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
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal number
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
 *                   type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/user_animal_all_record_delivery_question_answer/:animal_id/:language_id/:animal_number',
	authenticate,
	wrapAsync(
		DeliveryRecordController.userAllAnimalQuestionAnswersOfRecordDelivery,
	),
)

/**
 * @swagger
 * /user_animal_yield_count/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get pregnancy detection and delivery count for an animal
 *     tags: [DeliveryRecord]
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
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     pregnancy_detection_count:
 *                       type: integer
 *                     delivery_count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/user_animal_yield_count/:animal_id/:animal_number',
	authenticate,
	wrapAsync(DeliveryRecordController.animalLactationYieldCount),
)

export default router
