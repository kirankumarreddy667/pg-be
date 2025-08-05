import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { ReportsService } from '@/services/reports.service'
import { User } from '@/models/user.model'

export class ReportsController {
	public static readonly pregnantNonPregnantAnimals: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const data = await ReportsService.getPregnantNonPregnantAnimalsCount(user)
			return RESPONSE.SuccessResponse(res, 200, { message: 'success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly pregnantNonPregnantAnimalsList: RequestHandler =
		async (req, res, next) => {
			try {
				const user = req.user as User
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'User not found',
						data: [],
					})
				}
				const data =
					await ReportsService.getPregnantNonPregnantAnimalsList(user)
				return RESPONSE.SuccessResponse(res, 200, { message: 'success', data })
			} catch (error) {
				next(error)
			}
		}

	public static readonly lactatingNonLactatingAnimals: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const data =
				await ReportsService.getLactatingNonLactatingAnimalsCount(user)
			return RESPONSE.SuccessResponse(res, 200, { message: 'success', data })
		} catch (error) {
			next(error)
		}
	}
}
