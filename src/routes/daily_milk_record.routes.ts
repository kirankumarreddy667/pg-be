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

export default router
