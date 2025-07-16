import { Request, Response, NextFunction, RequestHandler } from 'express'
import { AnimalQuestionAnswerService } from '@/services/animal_question_answer.service'
import RESPONSE from '@/utils/response'

interface AnimalAnswerInput {
	question_id: number
	answer: string | number
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
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				await AnimalQuestionAnswerService.userAnimalNumbersFromQuestionAnswer(
					req,
					res,
				)
			} catch (error) {
				next(error)
			}
		}

	public static readonly updateAnimalBasicQuestionAnswers: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				await AnimalQuestionAnswerService.updateAnimalBasicQuestionAnswers(
					req,
					res,
				)
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
			return AnimalQuestionAnswerService.updateAnimalBreedingQuestionAnswers(
				req,
				res,
			)
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
			return AnimalQuestionAnswerService.updateAnimalMilkQuestionAnswers(
				req,
				res,
			)
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
			return AnimalQuestionAnswerService.updateAnimalBirthQuestionAnswers(
				req,
				res,
			)
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
			return AnimalQuestionAnswerService.updateAnimalHealthQuestionAnswers(
				req,
				res,
			)
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateHeatEventDetailsOfAnimal: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				return AnimalQuestionAnswerService.updateHeatEventDetailsOfAnimal(
					req,
					res,
				)
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
			return AnimalQuestionAnswerService.saveHeatEventDetailsOfAnimal(req, res)
		} catch (error) {
			next(error)
		}
	}

	public static readonly userAnimalQuestionAnswerHeatEventDetail: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				return AnimalQuestionAnswerService.userAnimalQuestionAnswerHeatEventDetail(
					req,
					res,
				)
			} catch (error) {
				next(error)
			}
		}

	public static readonly userPreviousAnimalQuestionAnswersHeatEventDetails: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				return AnimalQuestionAnswerService.userPreviousAnimalQuestionAnswersHeatEventDetails(
					req,
					res,
				)
			} catch (error) {
				next(error)
			}
		}
}
