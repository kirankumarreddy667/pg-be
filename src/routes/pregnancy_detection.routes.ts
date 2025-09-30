import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { PregnancyDetectionController } from '@/controllers/pregnancy_detection.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { updatePregnancyDetectionSchema } from '@/validations/pregnancy_detection.validation'

/**
 * @swagger
 * tags:
 *   name: PregnancyDetection
 *   description: Pregnancy detection management endpoints
 */
const pregnancyDetectionRouter: Router = Router()

/**
 * @swagger
 * /user_animal_pregnancy_detection_record/{animal_id}/{animal_num}:
 *   put:
 *     summary: Update pregnancy detection record for an animal
 *     tags: [PregnancyDetection]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - animal_number
 *               - date
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 1
 *               animal_number:
 *                 type: string
 *                 example: "101"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-25T09:00:00Z"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 56
 *                     answer:
 *                       type: string
 *                       example: "Yes"
 *     responses:
 *       200:
 *         description: Pregnancy detection updated successfully
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
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

pregnancyDetectionRouter.put(
	'/user_animal_pregnancy_detection_record/:animal_id/:animal_num',
	authenticate,
	validateRequest(updatePregnancyDetectionSchema),
	wrapAsync(PregnancyDetectionController.updatePregnancyDetection),
)
/**
 * @swagger
 * /user_animal_pregnancy_detection_record/{animal_id}/{language_id}/{animal_num}:
 *   get:
 *     summary: Get grouped pregnancy detection questions and answers for an animal
 *     tags: [PregnancyDetection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: language_id
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
 *         description: Grouped pregnancy detection data
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
 *                   example:
 *                     Pregnancy Details:
 *                       "":
 *                         - animal_id: 1
 *                           validation_rule: "TYPE_CLASS_TEXT"
 *                           master_question: "Pregnancy detected?"
 *                           language_question: "Pregnancy detected?"
 *                           question_id: 56
 *                           form_type: "RadioGridGroup"
 *                           date: 0
 *                           answer: null
 *                           form_type_value: "Yes,No"
 *                           language_form_type_value: "Yes,No"
 *                           constant_value: 1
 *                           question_tag: 69
 *                           question_unit: 3
 *                           answer_date: null
 *                           animal_number: null
 *                           hint: null
 *                         - animal_id: 1
 *                           validation_rule: "TYPE_CLASS_TEXT"
 *                           master_question: "Date of pregnancy detection"
 *                           language_question: "Date of pregnancy detection"
 *                           question_id: 57
 *                           form_type: "Date"
 *                           date: 0
 *                           answer: null
 *                           form_type_value: null
 *                           language_form_type_value: null
 *                           constant_value: 1
 *                           question_tag: 70
 *                           question_unit: 3
 *                           answer_date: null
 *                           animal_number: null
 *                           hint: null
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
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

pregnancyDetectionRouter.get(
	'/user_animal_pregnancy_detection_record/:animal_id/:language_id/:animal_num',
	authenticate,
	wrapAsync(PregnancyDetectionController.animalPregnancyDetectionRecord),
)
/**
 * @swagger
 * /user_animal_all_pregnancy_detection_question_answer/{animal_id}/{language_id}/{animal_num}:
 *   get:
 *     summary: Get all pregnancy detection answers for an animal
 *     tags: [PregnancyDetection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: language_id
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
 *         description: List of all pregnancy detection records with detection status and detection date
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
 *                       pregnancy_detected:
 *                         type: string
 *                         nullable: true
 *                         example: "Yes"
 *                       pregnancy_detection_date:
 *                         type: string
 *                         nullable: true
 *                         example: "2025-08-25"
 *                   example:
 *                     - pregnancy_detected: "Yes"
 *                       pregnancy_detection_date: "2025-08-25"
 *                     - pregnancy_detected: "No"
 *                       pregnancy_detection_date: null
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
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

pregnancyDetectionRouter.get(
	'/user_animal_all_pregnancy_detection_question_answer/:animal_id/:language_id/:animal_num',
	authenticate,
	wrapAsync(
		PregnancyDetectionController.userAnimalAllAnswersOfPregnancyDetection,
	),
)

export default pregnancyDetectionRouter
