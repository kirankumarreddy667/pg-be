import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { DryingRecordController } from '@/controllers/drying_record.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { updateDryingRecordSchema } from '@/validations/drying_record.validation'

const router: Router = Router()

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
 */
router.put(
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
 */
router.get(
	'/user_animal_all_drying_question_answer/:animal_id/:language_id/:animal_num',
	authenticate,
	wrapAsync(DryingRecordController.userAnimalAllAnswersOfDryingRecord),
)

export default router
