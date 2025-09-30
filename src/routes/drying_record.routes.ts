import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { DryingRecordController } from '@/controllers/drying_record.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { updateDryingRecordSchema } from '@/validations/drying_record.validation'

/**
 * @swagger
 * tags:
 *   name: DryingRecord
 *   description: Drying record management endpoints
 */

const dryingRecordRouter: Router = Router()

/**
 * @swagger
 * /user_animal_drying_record/{animal_id}/{animal_num}:
 *   put:
 *     summary: Update drying record for an animal
 *     tags: [DryingRecord]
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
 *             properties:
 *               animal_id:
 *                 type: integer
 *               animal_number:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     answer:
 *                       type: string
 *           example:
 *             animal_id: 1
 *             animal_number: "2"
 *             date: "2025-08-20T09:00:00Z"
 *             answers:
 *               - question_id: 55
 *                 answer: "2025-08-19"
 *               - question_id: 67
 *                 answer: "2025-08-20"
 *               - question_id: 68
 *                 answer: "2025-08-21"
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
 *                   type: array
 *                   items: {}
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
dryingRecordRouter.put(
	'/user_animal_drying_record/:animal_id/:animal_num',
	authenticate,
	validateRequest(updateDryingRecordSchema),
	wrapAsync(DryingRecordController.updateDryingRecord),
)
/**
 * @swagger
 * /user_animal_drying_record/{animal_id}/{language_id}/{animal_num}:
 *   get:
 *     summary: Get grouped drying record questions and answers for an animal
 *     tags: [DryingRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Animal ID
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *       - in: path
 *         name: animal_num
 *         required: true
 *         schema:
 *           type: string
 *         description: Animal unique number
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
 *                   example:
 *                     "Drying Details": {
 *                       "Unknown": [
 *                         {
 *                           "animal_id": 1,
 *                           "validation_rule": "TYPE_CLASS_TEXT",
 *                           "master_question": "Type of drying",
 *                           "language_question": "सुखाने का प्रकार",
 *                           "question_id": 54,
 *                           "form_type": "RadioGridGroup",
 *                           "date": 0,
 *                           "answer": null,
 *                           "form_type_value": "Manual,Natural",
 *                           "language_form_type_value": "कृत्रिम,प्राकृतिक",
 *                           "constant_value": 1,
 *                           "question_tag": 67,
 *                           "question_unit": 3,
 *                           "answer_date": null,
 *                           "animal_number": null,
 *                           "hint": null
 *                         },
 *                       ]
 *                     }
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

dryingRecordRouter.get(
	'/user_animal_drying_record/:animal_id/:language_id/:animal_num',
	authenticate,
	wrapAsync(DryingRecordController.animalDryingRecord),
)

/**
 * @swagger
 * /user_animal_all_drying_question_answer/{animal_id}/{language_id}/{animal_num}:
 *   get:
 *     summary: Get all drying record answers for an animal
 *     tags: [DryingRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Animal ID
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *       - in: path
 *         name: animal_num
 *         required: true
 *         schema:
 *           type: string
 *         description: Animal unique number
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
 *                   type: array
 *                   example:
 *                     - date_of_drying: "2025-08-19"
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
dryingRecordRouter.get(
	'/user_animal_all_drying_question_answer/:animal_id/:language_id/:animal_num',
	authenticate,
	wrapAsync(DryingRecordController.userAnimalAllAnswersOfDryingRecord),
)

export default dryingRecordRouter
