import { Request, Response, NextFunction, RequestHandler } from 'express'
import { AnimalQuestionAnswerService } from '@/services/animal_question_answer.service'
import RESPONSE from '@/utils/response'

interface AnimalAnswerInput {
	question_id: number
	answer: string | number
}

interface AnimalNumberRequestBody {
	animalNumber?: string
}

export class AnimalQuestionAnswerController {
	public static readonly store: RequestHandler = async (
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
			await AnimalQuestionAnswerService.create(
				req.body as {
					animal_id: number
					animal_number: string
					answers: AnimalAnswerInput[]
					date: string
				},
				user.id,
			)
			RESPONSE.SuccessResponse(res, 201, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly userAnimalQuestionAnswer: RequestHandler = async (
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
			const { animal_id, language_id, animal_number } = req.params
			const result = await AnimalQuestionAnswerService.userAnimalQuestionAnswer(
				{
					user_id: user.id,
					animal_id: Number(animal_id),
					language_id: Number(language_id),
					animal_number,
				},
			)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
		} catch (error) {
			next(error)
		}
	}

	public static readonly userAnimalQuestionAnswerBasicDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userAnimalQuestionAnswerBasicDetails(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userAnimalQuestionAnswerBreedingDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userAnimalQuestionAnswerBreedingDetails(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userAnimalQuestionAnswerMilkDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userAnimalQuestionAnswerMilkDetails(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userAnimalQuestionAnswerBirthDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userAnimalQuestionAnswerBirthDetails(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userAnimalQuestionAnswerHealthDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userAnimalQuestionAnswerHealthDetails(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userAnimalNumbersFromQuestionAnswer: RequestHandler =
		async (
			req: Request<unknown, unknown, AnimalNumberRequestBody>,
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
				const { animalNumber } = req.body
				const result =
					await AnimalQuestionAnswerService.userAnimalNumbersFromQuestionAnswer(
						{ user_id: user.id, animalNumber },
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly updateAnimalBasicQuestionAnswers: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_number, animal_id } = req.params
				const { answers } = req.body as {
					answers: AnimalAnswerInput[]
				}
				await AnimalQuestionAnswerService.updateAnimalBasicQuestionAnswers({
					user_id: user.id,
					animal_number,
					animal_id: Number(animal_id),
					answers,
				})
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
			} catch (error) {
				next(error)
			}
		}

	public static readonly updateBreedingDetailsOfAnimal: RequestHandler = async (
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
			const { animal_number, animal_id } = req.params
			const { answers, date } = req.body as {
				answers: AnimalAnswerInput[]
				date: string
			}
			await AnimalQuestionAnswerService.updateAnimalBreedingQuestionAnswers({
				user_id: user.id,
				animal_number,
				animal_id: Number(animal_id),
				answers,
				date,
			})
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateMilkDetailsOfAnimal: RequestHandler = async (
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
			const { animal_number, animal_id } = req.params
			const { answers, date } = req.body as {
				answers: AnimalAnswerInput[]
				date: string
			}
			await AnimalQuestionAnswerService.updateAnimalMilkQuestionAnswers({
				user_id: user.id,
				animal_number,
				animal_id: Number(animal_id),
				answers,
				date,
			})
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateBirthDetailsOfAnimal: RequestHandler = async (
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
			const { animal_number, animal_id } = req.params
			const { answers } = req.body as {
				answers: AnimalAnswerInput[]
			}
			await AnimalQuestionAnswerService.updateAnimalBirthQuestionAnswers({
				user_id: user.id,
				animal_number,
				animal_id: Number(animal_id),
				answers,
			})
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateHealthDetailsOfAnimal: RequestHandler = async (
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
			const { animal_number, animal_id } = req.params
			const { answers, date } = req.body as {
				answers: AnimalAnswerInput[]
				date: string
			}
			await AnimalQuestionAnswerService.updateAnimalHealthQuestionAnswers({
				user_id: user.id,
				animal_number,
				animal_id: Number(animal_id),
				answers,
				date,
			})
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateHeatEventDetailsOfAnimal: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_number, animal_id } = req.params
				const { answers } = req.body as {
					answers: AnimalAnswerInput[]
				}
				await AnimalQuestionAnswerService.updateHeatEventDetailsOfAnimal({
					user_id: user.id,
					animal_number,
					animal_id: Number(animal_id),
					answers,
				})
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
			} catch (error) {
				next(error)
			}
		}

	public static readonly saveHeatEventDetailsOfAnimal: RequestHandler = async (
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
			const { animal_id, animal_number, answers, date } = req.body as {
				animal_id: number
				animal_number: string
				answers: AnimalAnswerInput[]
				date: string
			}
			await AnimalQuestionAnswerService.saveHeatEventDetailsOfAnimal({
				user_id: user.id,
				animal_id,
				animal_number,
				answers,
				date,
			})
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly userAnimalQuestionAnswerHeatEventDetail: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userAnimalQuestionAnswerHeatEventDetail(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly userPreviousAnimalQuestionAnswersHeatEventDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { animal_id, language_id, animal_number } = req.params
				const result =
					await AnimalQuestionAnswerService.userPreviousAnimalQuestionAnswersHeatEventDetails(
						{
							user_id: user.id,
							animal_id: Number(animal_id),
							language_id: Number(language_id),
							animal_number,
						},
					)
				RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
			} catch (error) {
				next(error)
			}
		}

	public static readonly getAnimalLactationStatus: RequestHandler = async (
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
			const result = await AnimalQuestionAnswerService.getAnimalLactationStatus(
				user.id,
				animal_id,
				animal_num,
			)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAnimalPregnancyStatus: RequestHandler = async (
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
			const result = await AnimalQuestionAnswerService.getAnimalPregnancyStatus(
				user.id,
				animal_id,
				animal_num,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: { pregnancy_status: result.answer ?? null },
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly listOfAnimalCalfs: RequestHandler = async (
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
			const { animal_id, animal_number } = req.params
			const data = await AnimalQuestionAnswerService.listOfAnimalCalfs(
				user.id,
				Number(animal_id),
				animal_number,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly listOfAnimalDeliveryDates: RequestHandler = async (
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
			const { animal_id, animal_number } = req.params
			const data = await AnimalQuestionAnswerService.listOfAnimalDeliveryDates(
				user.id,
				Number(animal_id),
				animal_number,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly mapAnimalMotherToCalf: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			const result = await AnimalQuestionAnswerService.mapAnimalMotherToCalf(
				user?.id,
				req.body as {
					animal_id: number
					delivery_date: string
					mother_animal_number: string
					calf_animal_number: string
				},
			)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: result })
		} catch (error) {
			next(error)
		}
	}

	public static readonly attachedCalfOfAnimal: RequestHandler = async (
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
			const { animal_id, mother_number } = req.params
			const data = await AnimalQuestionAnswerService.attachedCalfOfAnimal(
				user.id,
				Number(animal_id),
				mother_number,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAIHistoryOfAnimal: RequestHandler = async (
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
			const data = await AnimalQuestionAnswerService.getAIHistoryOfAnimal(
				user.id,
				Number(animal_id),
				animal_number,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}
}
