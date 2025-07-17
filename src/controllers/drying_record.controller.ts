import { Request, Response, NextFunction, RequestHandler } from 'express'
import { DryingRecordService } from '@/services/drying_record.service'
import RESPONSE from '@/utils/response'

export class DryingRecordController {
	public static readonly updateDryingRecord: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const animal_id = Number(req.params.animal_id)
			const animal_num = req.params.animal_num

			await DryingRecordService.updateDryingRecord(
				user.id,
				animal_id,
				animal_num,
				req.body as {
					answers: { question_id: number; answer: string }[]
					animal_id: number
				},
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly animalDryingRecord: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const animal_id = Number(req.params.animal_id)
			const language_id = Number(req.params.language_id)
			const animal_num = req.params.animal_num
			const data = await DryingRecordService.animalDryingRecord(
				user.id,
				animal_id,
				language_id,
				animal_num,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly userAnimalAllAnswersOfDryingRecord: RequestHandler =
		async (req, res, next) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const animal_id = Number(req.params.animal_id)
				const language_id = Number(req.params.language_id)
				const animal_num = req.params.animal_num
				const data =
					await DryingRecordService.userAnimalAllAnswersOfDryingRecord(
						user.id,
						animal_id,
						language_id,
						animal_num,
					)
				return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
			} catch (error) {
				next(error)
			}
		}
}
