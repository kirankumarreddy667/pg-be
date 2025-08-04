import { Router, type Router as ExpressRouter } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { ReportsController } from '@/controllers/reports.controller'

const router: ExpressRouter = Router()

/**
 * @swagger
 * /pregnant_non_pregnant_animals_count:
 *   get:
 *     summary: Get count of pregnant and non-pregnant animals by type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
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
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       pregnant_animal:
 *                         type: integer
 *                       non_pregnant_animal:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/pregnant_non_pregnant_animals_count',
	authenticate,
	wrapAsync(ReportsController.pregnantNonPregnantAnimals),
)

/**
 * @swagger
 * /pregnant_non_pregnant_animals_list:
 *   get:
 *     summary: Get list of pregnant and non-pregnant animals by type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
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
 *                     pregnant:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: object
 *                     non_pregnant:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/pregnant_non_pregnant_animals_list',
	authenticate,
	wrapAsync(ReportsController.pregnantNonPregnantAnimalsList),
)

/**
 * @swagger
 * /lactating_non_lactating_animals_count:
 *   get:
 *     summary: Get count of lactating and non-lactating animals by type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
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
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       lactating_animal:
 *                         type: integer
 *                       non_lactating_animal:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/lactating_non_lactating_animals_count',
	authenticate,
	wrapAsync(ReportsController.lactatingNonLactatingAnimals),
)

export default router
