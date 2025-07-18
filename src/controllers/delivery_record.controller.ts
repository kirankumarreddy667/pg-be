import { Request, Response, NextFunction, RequestHandler } from 'express'
import { DeliveryRecordService } from '@/services/delivery_record.service'
import RESPONSE from '@/utils/response'

export class DeliveryRecordController {
	public static readonly saveRecordDeliveryOfAnimal: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const result = await DeliveryRecordService.saveRecordDeliveryOfAnimal(
				req.body as {
					animal_number: string
					date: Date
					answers: { question_id: number; answer: string }[]
					animal_id: number
				},
				user.id,
			)
			return res.status(result.status || 201).json(result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateRecordDeliveryOfAnimal: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const { animal_number } = req.params
			const result = await DeliveryRecordService.updateRecordDeliveryOfAnimal(
				animal_number,
				req.body as {
					answers: { question_id: number; answer: string }[]
					animal_id: number
				},
				user.id,
			)
			return res.status(result.status).json(result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly userAnimalQuestionAnswerRecordDelivery: RequestHandler =
		async (req, res, next) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'User not found',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const data =
					await DeliveryRecordService.userAnimalQuestionAnswerRecordDelivery(
						user.id,
						Number(animal_id),
						Number(language_id),
						animal_number,
					)
				return res.status(200).json({ message: 'success', data })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userAllAnimalQuestionAnswersOfRecordDelivery: RequestHandler =
		async (req, res, next) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'User not found',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const data =
					await DeliveryRecordService.userAllAnimalQuestionAnswersOfRecordDelivery(
						user.id,
						Number(animal_id),
						Number(language_id),
						animal_number,
					)
				return res.status(200).json({ message: 'success', data })
			} catch (error) {
				next(error)
			}
		}

	public static readonly animalLactationYieldCount: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const { animal_id, animal_number } = req.params
			const data = await DeliveryRecordService.animalLactationYieldCount(
				user.id,
				Number(animal_id),
				animal_number,
			)
			return res.status(200).json({ message: 'success', data })
		} catch (error) {
			next(error)
		}
	}
}
