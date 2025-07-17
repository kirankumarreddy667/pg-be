import { RequestHandler } from 'express'
import {
	DailyMilkRecordService,
	SaveDailyMilkRecordInput,
} from '@/services/daily_milk_record.service'
import RESPONSE from '@/utils/response'
import { User } from '@/models/user.model'

export class DailyMilkRecordController {
	public static readonly save: RequestHandler = async (req, res, next) => {
		try {
			const user = req.user as User
			const result = await DailyMilkRecordService.saveDailyMilkRecord(
				user,
				req.body as SaveDailyMilkRecordInput,
			)
			if (result.success) {
				RESPONSE.SuccessResponse(res, 200, {
					message: result.message,
					data: [],
				})
			} else {
				RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: [result.message],
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		try {
			const user = req.user as User
			const date = req.params.date
			const result = await DailyMilkRecordService.updateDailyMilkRecord(
				user,
				date,
				req.body as SaveDailyMilkRecordInput,
			)
			if (result.success) {
				RESPONSE.SuccessResponse(res, 200, {
					message: result.message,
					data: [],
				})
			} else {
				RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: [result.message],
				})
			}
		} catch (error) {
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
