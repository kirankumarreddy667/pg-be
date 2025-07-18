import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { PedigreeController } from '@/controllers/pedigree.controller'

const router: Router = Router()

/**
 * @swagger
 * /animal_pedigree/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get animal pedigree details by animal number
 *     tags: [Pedigree]
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
 *         description: Animal number (calf)
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
 *                     mother:
 *                       type: object
 *                       properties:
 *                         tag_no:
 *                           type: string
 *                         milk_yield:
 *                           type: number
 *                     father:
 *                       type: object
 *                       properties:
 *                         tag_no:
 *                           type: string
 *                         semen_co_name:
 *                           type: string
 *                         sire_dam_yield:
 *                           type: number
 *                         daughter_yield:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_pedigree/:animal_id/:animal_number',
	authenticate,
	wrapAsync(PedigreeController.getAnimalPedigree),
)

/**
 * @swagger
 * /animal_family_record/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get animal family record (parents and children) by animal number
 *     tags: [Pedigree]
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
 *         description: Animal number (calf)
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
 *                     parent:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           mother_no:
 *                             type: string
 *                           bull_no:
 *                             type: string
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           calf_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_family_record/:animal_id/:animal_number',
	authenticate,
	wrapAsync(PedigreeController.getAnimalFamilyRecord),
)

export default router
