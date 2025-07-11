import { RequestHandler } from 'express'
import { QuestionUnitService } from '@/services/question_unit.service'
import RESPONSE from '@/utils/response'

export class QuestionUnitController {
	public static readonly getAll: RequestHandler = async (req, res, next) => {
		try {
			const units = await QuestionUnitService.getAll()
			return RESPONSE.SuccessResponse(res, 200, {
				data: units,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
