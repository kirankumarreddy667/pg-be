import { RequestHandler } from 'express'
import { DailyRecordQuestionService } from '@/services/daily_record_question.service'
import RESPONSE from '@/utils/response'

interface Question {
	question: string
	form_type_id: number
	validation_rule_id: number
	date: boolean
	form_type_value: string
	question_tag: number[]
	question_unit: number
	hint: string
	sequence_number: number
}

export class DailyRecordQuestionController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			await DailyRecordQuestionService.create(
				req.body as {
					category_id: number
					sub_category_id: number
					language_id: number
					questions: Question[]
				},
			)
			return RESPONSE.SuccessResponse(res, 201, {
				message: 'Questions added successfully',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly index: RequestHandler = async (req, res, next) => {
		try {
			const result = await DailyRecordQuestionService.listAll()
			return RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
			await DailyRecordQuestionService.update(
				id,
				req.body as {
					category_id: number
					sub_category_id?: number | null
					question: string
					validation_rule_id: number
					form_type_id: number
					date: boolean
					form_type_value?: string | null
					question_tag_id: number[]
					question_unit_id: number
					hint?: string | null
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

	public static readonly delete: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
			const deleted = await DailyRecordQuestionService.delete(id)
			if (deleted) {
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Success',
					data: [],
				})
			} else {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Something went wrong. Please try again',
					data: [],
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAllForAdminPanel: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const result =
				await DailyRecordQuestionService.listAllDailyRecordQuestions()
			return RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly addDailyQuestionsInOtherLanguage: RequestHandler =
		async (req, res, next) => {
			try {
				const result =
					await DailyRecordQuestionService.addDailyQuestionsInOtherLanguage(
						req.body as {
							daily_record_question_id: number
							language_id: number
							question: string
							form_type_value?: string | null
							hint?: string | null
						},
					)
				if (result.success) {
					return RESPONSE.SuccessResponse(res, 200, {
						message: result.message,
						data: [],
					})
				} else if (result.code === 404) {
					return RESPONSE.FailureResponse(res, 404, {
						message: result.message,
						errors: [result.message],
					})
				} else {
					return RESPONSE.FailureResponse(res, 422, {
						message: 'The given data was invalid.',
						errors: [result.message],
					})
				}
			} catch (error) {
				next(error)
			}
		}

	public static readonly getDailyQuestionsInOtherLanguage: RequestHandler =
		async (req, res, next) => {
			try {
				const language_id = Number(req.params.language_id)
				const result =
					await DailyRecordQuestionService.getDailyQuestionsInOtherLanguage(
						language_id,
					)
				return RESPONSE.SuccessResponse(res, 200, result)
			} catch (error) {
				next(error)
			}
		}

	public static readonly updateDailyRecordQuestionInOtherLanguage: RequestHandler =
		async (req, res, next) => {
			try {
				const id = Number(req.params.id)
				const result =
					await DailyRecordQuestionService.updateDailyRecordQuestionInOtherLanguage(
						id,
						req.body as {
							daily_record_question_id: number
							language_id: number
							question: string
							form_type_value?: string | null
							hint?: string | null
						},
					)
				if (result.success) {
					return RESPONSE.SuccessResponse(res, 200, {
						message: result.message,
						data: [],
					})
				} else if (result.code === 404) {
					return RESPONSE.FailureResponse(res, 404, {
						message: result.message,
						errors: [result.message],
					})
				} else {
					return RESPONSE.FailureResponse(res, 422, {
						message: 'The given data was invalid.',
						errors: [result.message],
					})
				}
			} catch (error) {
				next(error)
			}
		}
}
