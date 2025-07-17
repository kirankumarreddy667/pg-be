import { Request, Response, NextFunction, RequestHandler } from 'express'
import { DailyRecordQuestionAnswerService } from '@/services/daily_record_question_answer.service'
import RESPONSE from '@/utils/response'

export class DailyRecordQuestionAnswerController {
	public static readonly create: RequestHandler = async (
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
			const { answers, date } = req.body as {
				answers: { question_id: number; answer: string }[]
				date: string
			}
			if (!answers || !date) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'Missing required fields',
					data: [],
				})
			}
			const result = await DailyRecordQuestionAnswerService.createAnswers({
				answers,
				date,
				user_id: user.id,
			})
			return RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (
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
			const { answers, date } = req.body as {
				answers: { daily_record_answer_id: number; answer: string }[]
				date: string
			}
			if (!answers || !date) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'Missing required fields',
					data: [],
				})
			}
			const result = await DailyRecordQuestionAnswerService.updateAnswers(
				user.id,
				answers,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getDailyRecordQuestionsWithAnswers: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const language_id = Number(req.params.language_id)
				const date = req.params.date
				if (!language_id || !date) {
					return RESPONSE.FailureResponse(res, 422, {
						message: 'Missing required params',
						data: [],
					})
				}
				const data =
					await DailyRecordQuestionAnswerService.getDailyRecordQuestionsWithAnswers(
						user.id,
						language_id,
						date,
					)
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Success',
					data,
				})
			} catch (error) {
				next(error)
			}
		}

	public static readonly getBioSecuritySprayDetails: RequestHandler = async (
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
			const result =
				await DailyRecordQuestionAnswerService.getBioSecuritySprayDetails(
					user.id,
				)
			return RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly getDewormingDetails: RequestHandler = async (
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
			const result = await DailyRecordQuestionAnswerService.getDewormingDetails(
				user.id,
			)
			return RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}
}
