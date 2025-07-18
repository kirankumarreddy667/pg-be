import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { PregnancyDetectionController } from '@/controllers/pregnancy_detection.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { updatePregnancyDetectionSchema } from '@/validations/pregnancy_detection.validation'

const router: Router = Router()

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
	'/user_animal_all_pregnancy_detection_question_answer/:animal_id/:language_id/:animal_num',
	authenticate,
	wrapAsync(
		PregnancyDetectionController.userAnimalAllAnswersOfPregnancyDetection,
	),
)

export default router
