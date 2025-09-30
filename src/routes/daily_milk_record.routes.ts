import { Router } from 'express'
import { DailyMilkRecordController } from '@/controllers/daily_milk_record.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { saveDailyMilkRecordSchema } from '@/validations/daily_milk_record.validation'
import { wrapAsync } from '@/utils/asyncHandler'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: DailyMilkRecord
 *   description: Daily milk record management endpoints
 */

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
 *                 example: "2024-07-16"
 *               cows_daily_milk_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     animal_id: { type: integer, example: 1 }
 *                     animal_number: { type: string, example: "COW123" }
 *                     morning_milk_in_litres: { type: number, example: 5.5 }
 *                     evening_milk_in_litres: { type: number, example: 4.2 }
 *               buffalos_daily_milk_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     animal_id: { type: integer, example: 2 }
 *                     animal_number: { type: string, example: "BUF456" }
 *                     morning_milk_in_litres: { type: number, example: 6.1 }
 *                     evening_milk_in_litres: { type: number, example: 5.0 }
 *     responses:
 *       200:
 *         description: Added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Success" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 200 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "jwt expired" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 401 }
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 422
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 record_date:
 *                   - "record_date is required"
 *                 cows_daily_milk_data[0].animal_id:
 *                   - "animal_id is required"
 *                 cows_daily_milk_data[0].animal_number:
 *                   - "animal_number is required"
 *                 buffalos_daily_milk_data[0].animal_id:
 *                   - "animal_id is required"
 *                 buffalos_daily_milk_data[0].animal_number:
 *                   - "animal_number is required"
 *               status: 422

 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 500 }
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
 *             type: object
 *             properties:
 *               record_date: { type: string, example: "2024-07-16" }
 *               cows_daily_milk_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     animal_id: { type: integer, example: 1 }
 *                     animal_number: { type: string, example: "COW123" }
 *                     morning_milk_in_litres: { type: number, example: 5.8 }
 *                     evening_milk_in_litres: { type: number, example: 4.5 }
 *               buffalos_daily_milk_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     animal_id: { type: integer, example: 2 }
 *                     animal_number: { type: string, example: "BUF456" }
 *                     morning_milk_in_litres: { type: number, example: 6.3 }
 *                     evening_milk_in_litres: { type: number, example: 5.2 }
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Success" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 200 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "jwt expired" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 401 }
*       422:
*         description: Validation error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message: { type: string, example: "Validation error" }
*                 errors:
*                   type: object
*                   additionalProperties:
*                     type: array
*                     items:
*                       type: string
*                 status: { type: integer, example: 422 }
*             examples:
*               missingCowData:
*                 summary: Missing cow fields
*                 value:
*                   message: "Validation error"
*                   errors:
*                     record_date:
*                       - "record_date is required"
*                     cows_daily_milk_data[0].animal_id:
*                       - "animal_id is required"
*                     cows_daily_milk_data[0].animal_number:
*                       - "animal_number is required"
*                   status: 422
*               missingBuffaloData:
*                 summary: Missing buffalo fields
*                 value:
*                   message: "Validation error"
*                   errors:
*                     record_date:
*                       - "record_date is required"
*                     buffalos_daily_milk_data[0].animal_id:
*                       - "animal_id is required"
*                     buffalos_daily_milk_data[0].animal_number:
*                       - "animal_number is required"
*                   status: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 500 }
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
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cows_daily_milk_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_number: { type: string, example: "COW123" }
 *                           animal_id: { type: integer, example: 1 }
 *                           morning_milk_in_litres: { type: number, example: 5.5 }
 *                           evening_milk_in_litres: { type: number, example: 4.2 }
 *                           total_milk_in_litres: { type: number, example: 9.7 }
 *                     buffalos_daily_milk_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_number: { type: string, example: "BUF456" }
 *                           animal_id: { type: integer, example: 2 }
 *                           morning_milk_in_litres: { type: number, example: 6.1 }
 *                           evening_milk_in_litres: { type: number, example: 5.0 }
 *                           total_milk_in_litres: { type: number, example: 11.1 }
 *                     record_date:
 *                       type: string
 *                       example: "2024-07-16"
 *                     total_morning:
 *                       type: number
 *                       example: 11.6   # 5.5 (cow) + 6.1 (buffalo)
 *                     total_evening:
 *                       type: number
 *                       example: 9.2    # 4.2 (cow) + 5.0 (buffalo)
 *                     total_day_milk:
 *                       type: number
 *                       example: 20.8   # 11.6 + 9.2
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
 *                 message: { type: string, example: "jwt expired" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 401 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status: { type: integer, example: 500 }
 */
router.get(
	'/daily_milk_record',
	authenticate,
	wrapAsync(DailyMilkRecordController.getDailyMilkRecord),
)

export default router
