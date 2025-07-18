import { Request, Response, NextFunction, RequestHandler } from 'express'
import { PregnancyDetectionService } from '@/services/pregnancy_detection.service'
import RESPONSE from '@/utils/response'

export class PregnancyDetectionController {
	public static readonly updatePregnancyDetection: RequestHandler = async (
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
			await PregnancyDetectionService.updatePregnancyDetection(
				user.id,
				animal_id,
				animal_num,
				req.body as {
                    answers: { question_id: number; answer: string }[]
                    animal_id?: number
                    animal_number?: string
                    date?: string
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

	public static readonly animalPregnancyDetectionRecord: RequestHandler =
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
					await PregnancyDetectionService.animalPregnancyDetectionRecord(
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

	public static readonly userAnimalAllAnswersOfPregnancyDetection: RequestHandler =
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
					await PregnancyDetectionService.userAnimalAllAnswersOfPregnancyDetection(
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
