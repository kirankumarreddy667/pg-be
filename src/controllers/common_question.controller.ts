import { RequestHandler } from 'express'
import { CommonQuestionService } from '@/services/common_question.service'
import RESPONSE from '@/utils/response'

export class CommonQuestionController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const result = await CommonQuestionService.create(
				req.body as {
					category_id: number
					sub_category_id?: number | null
					language_id: number
					questions: Array<{
						question: string
						form_type_id: number
						validation_rule_id: number
						date: boolean
						form_type_value?: string | null
						question_tag: number
						question_unit: number
						hint?: string | null
					}>
				},
			)
			RESPONSE.SuccessResponse(res, 201, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
			const result = await CommonQuestionService.update(
				id,
				req.body as {
					category_id: number
					sub_category_id?: number | null
					question: string
					form_type_id: number
					validation_rule_id: number
					date: boolean
					form_type_value?: string | null
					question_tag: number
					question_unit: number
					hint?: string | null
				},
			)
			RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly destroy: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
			const result = await CommonQuestionService.delete(id)
			if (result.success) {
				RESPONSE.SuccessResponse(res, 200, {
					message: result.message,
					data: result.data,
				})
			} else {
				RESPONSE.FailureResponse(res, 400, {
					message: result.message,
					errors: result.errors,
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly show: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
			const data = await CommonQuestionService.findById(id)
			if (!data) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found',
					data: [],
				})
			}
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly listAll: RequestHandler = async (req, res, next) => {
		try {
			const result = await CommonQuestionService.listAll()
			RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly addQuestionsInOtherLanguage: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const result = await CommonQuestionService.addQuestionsInOtherLanguage(
				req.body as {
					question_id: number
					language_id: number
					question: string
					form_type_value?: string | null
					hint?: string | null
				},
			)
			if (result.success) {
				RESPONSE.SuccessResponse(res, 201, {
					message: result.message,
					data: result.data,
				})
			} else {
				RESPONSE.FailureResponse(res, 400, {
					message: result.message,
					errors: result.errors,
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateOtherLanguageQuestion: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const id = Number(req.params.id)
			const result = await CommonQuestionService.updateOtherLanguageQuestion(
				id,
				req.body as {
					question: string
					form_type_value?: string | null
					hint?: string | null
					language_id: number
					question_id: number
				},
			)
			RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAllQuestionsBasedOnLanguage: RequestHandler =
		async (req, res, next) => {
			try {
				const language_id = Number(req.params.id)
				const result =
					await CommonQuestionService.getAllQuestionsInDifferentLanguages(
						language_id,
					)
				RESPONSE.SuccessResponse(res, 200, {
					message: result.message,
					data: result.data,
				})
			} catch (error) {
				next(error)
			}
		}
}
