import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { PedigreeController } from '@/controllers/pedigree.controller'

/**
 * @swagger
 * tags:
 *   name: Pedigree
 *   description: Pedigree management endpoints
 */
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     mother:
 *                       type: object
 *                       properties:
 *                         tag_no:
 *                           type: string
 *                         milk_yield:
 *                           type: string
 *                           example: "0.0"
 *                     father:
 *                       type: object
 *                       properties:
 *                         tag_no:
 *                           type: string
 *                         semen_co_name:
 *                           type: string
 *                         sire_dam_yield:
 *                           type: string
 *                           example: "0.0"
 *                         daughter_yield:
 *                           type: string
 *                 message:
 *                   type: string
 *                   example: Success
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
 *                   example: User not found
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   items:
 *                      type: array
 *                   example: []
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   items:
 *                     type: array
 *                   example: []
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
 *                 message:
 *                   type: string
 *                   example: Success
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
 *                   example: User not found
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   items: array
 *                   example: []
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type:
 *                     items: array
 *                   example: []
 */
router.get(
	'/animal_family_record/:animal_id/:animal_number',
	authenticate,
	wrapAsync(PedigreeController.getAnimalFamilyRecord),
)

export default router
