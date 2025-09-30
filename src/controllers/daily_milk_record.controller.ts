import { RequestHandler } from 'express'
import {
	DailyMilkRecordService,
	SaveDailyMilkRecordInput,
} from '@/services/daily_milk_record.service'
import RESPONSE from '@/utils/response'
import { User } from '@/models/user.model'
import db from '@/config/database'
import { Transaction } from 'sequelize'

export class DailyMilkRecordController {
	public static readonly save: RequestHandler = async (req, res, next) => {
		try {
			const user = req.user as User
			await DailyMilkRecordService.saveDailyMilkRecord(
				user,
				req.body as SaveDailyMilkRecordInput,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Added successfully.',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		const transaction: Transaction = await db.sequelize.transaction()
		try {
			const user = req.user as User
			const date = req.params.date
			await DailyMilkRecordService.updateDailyMilkRecord(
				user,
				date,
				req.body as SaveDailyMilkRecordInput,
				transaction,
			)

			await transaction.commit()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Updated successfully.',
				data: [],
			})
		} catch (error) {
			await transaction.rollback()
			next(error)
		}
	}

	public static readonly getDailyMilkRecord: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			const date = req.query.date as string | undefined
			const result = await DailyMilkRecordService.getDailyMilkRecord(user, date)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: result,
			})
		} catch (error) {
			next(error)
		}
	}
}
