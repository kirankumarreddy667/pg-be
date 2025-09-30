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
 *     summary: Save a new delivery record for an animal
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
 *                 example: 1
 *               animal_number:
 *                 type: string
 *                 example: "ANIMAL123"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-26"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 1
 *                     answer:
 *                       type: string
 *                       example: "Sample Answer"
 *             required:
 *               - animal_id
 *               - animal_number
 *               - answers
 *     responses:
 *       200:
 *         description: Delivery record saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Success"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
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
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   description: Field-wise validation errors
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example:
 *                     animal_id:
 *                       - "Animal ID is required"
 *                     answers[0].question_id:
 *                       - "Question ID must be a number"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *     summary: Update an existing delivery record for an animal
 *     tags: [DeliveryRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_number
 *         required: true
 *         schema:
 *           type: string
 *         example: "ANIMAL123"
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 1
 *               animal_number:
 *                 type: string
 *                 example: "ANIMAL123"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-26"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 1
 *                     answer:
 *                       type: string
 *                       example: "Sample Answer"
 *             required:
 *               - animal_id
 *               - animal_number
 *               - answers
 *     responses:
 *       200:
 *         description: Delivery record saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Success"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
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
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   description: Field-wise validation errors
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example:
 *                     animal_id:
 *                       - "Animal ID is required"
 *                     answers[0].question_id:
 *                       - "Question ID must be a number"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *     summary: Get the latest delivery record for an animal
 *     tags: [DeliveryRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         required: true
 *         schema:
 *           type: string
 *         example: "ANIMAL123"
 *     responses:
 *       200:
 *         description: Latest delivery record fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     Details Info:
 *                       type: object
 *                       description: Grouped sections of questions and answers
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             animal_id:
 *                               type: integer
 *                             validation_rule:
 *                               type: string
 *                             master_question:
 *                               type: string
 *                             language_question:
 *                               type: string
 *                             question_id:
 *                               type: integer
 *                             form_type:
 *                               type: string
 *                             date:
 *                               type: integer
 *                             answer:
 *                               type: string
 *                               nullable: true
 *                             form_type_value:
 *                               type: string
 *                               nullable: true
 *                             language_form_type_value:
 *                               type: string
 *                               nullable: true
 *                             constant_value:
 *                               type: integer
 *                             question_tag:
 *                               type: integer
 *                             question_unit:
 *                               type: integer
 *                             answer_date:
 *                               type: string
 *                               nullable: true
 *                             animal_number:
 *                               type: string
 *                               nullable: true
 *                             hint:
 *                               type: string
 *                               nullable: true
 *                 message:
 *                   type: string
 *                   example: "success"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *     summary: Get all delivery records for an animal
 *     tags: [DeliveryRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         required: true
 *         schema:
 *           type: string
 *         example: "ANIMAL123"
 *     responses:
 *       200:
 *         description: All delivery records fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "success"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *     summary: Get pregnancy detection and delivery counts for an animal
 *     tags: [DeliveryRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: animal_number
 *         required: true
 *         schema:
 *           type: string
 *         example: "ANIMAL123"
 *     responses:
 *       200:
 *         description: Counts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     pregnancy_detection_count:
 *                       type: integer
 *                       example: 3
 *                     delivery_count:
 *                       type: integer
 *                       example: 2
 *                 message:
 *                   type: string
 *                   example: "success"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
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
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.get(
	'/user_animal_yield_count/:animal_id/:animal_number',
	authenticate,
	wrapAsync(DeliveryRecordController.animalLactationYieldCount),
)

export default router
