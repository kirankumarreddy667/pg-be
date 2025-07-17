import { Router } from 'express'
import { DailyMilkRecordController } from '@/controllers/daily_milk_record.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { saveDailyMilkRecordSchema } from '@/validations/daily_milk_record.validation'
import { wrapAsync } from '@/utils/asyncHandler'

const router: Router = Router()

/**
 * @swagger
 * /daily_milk_record:
 *   post:
 *     summary: Save daily milk record for cows and buffalos
 *     tags: [DailyMilkRecord]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_date:
 *                 type: string
 *                 format: date
 *                 example: '2024-07-16'
 *               cows_daily_milk_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     animal_id: { type: integer, example: 1 }
 *                     animal_number: { type: string, example: 'COW123' }
 *                     morning_milk_in_litres: { type: number, example: 5.5 }
 *                     evening_milk_in_litres: { type: number, example: 4.2 }
 *               buffalos_daily_milk_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     animal_id: { type: integer, example: 2 }
 *                     animal_number: { type: string, example: 'BUF456' }
 *                     morning_milk_in_litres: { type: number, example: 6.1 }
 *                     evening_milk_in_litres: { type: number, example: 5.0 }
 *     responses:
 *       200:
 *         description: Added successfully
 *       422:
 *         description: Validation error
 */
router.post(
	'/daily_milk_record',
	authenticate,
	validateRequest(saveDailyMilkRecordSchema),
	wrapAsync(DailyMilkRecordController.save),
)

/**
 * @swagger
 * /daily_milk_record/{date}:
 *   put:
 *     summary: Update daily milk record for cows and buffalos
 *     tags: [DailyMilkRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/saveDailyMilkRecordSchema'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       422:
 *         description: Validation error
 */
router.put(
	'/daily_milk_record/:date',
	authenticate,
	validateRequest(saveDailyMilkRecordSchema),
	wrapAsync(DailyMilkRecordController.update),
)

/**
 * @swagger
 * /daily_milk_record:
 *   get:
 *     summary: Get daily milk record for cows and buffalos
 *     tags: [DailyMilkRecord]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Date for which to fetch the record (YYYY-MM-DD). Defaults to today if not provided.
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
 *                     cows_daily_milk_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_number: { type: string }
 *                           animal_id: { type: integer }
 *                           morning_milk_in_litres: { type: number }
 *                           evening_milk_in_litres: { type: number }
 *                           total_milk_in_litres: { type: number }
 *                     buffalos_daily_milk_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_number: { type: string }
 *                           animal_id: { type: integer }
 *                           morning_milk_in_litres: { type: number }
 *                           evening_milk_in_litres: { type: number }
 *                           total_milk_in_litres: { type: number }
 *                     record_date: { type: string }
 *                     total_morning: { type: number }
 *                     total_evening: { type: number }
 *                     total_day_milk: { type: number }
 */
router.get(
	'/daily_milk_record',
	authenticate,
	wrapAsync(DailyMilkRecordController.getDailyMilkRecord),
)

export default router
