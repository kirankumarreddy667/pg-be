import { RequestHandler } from 'express'
import { QuestionTagService } from '@/services/question_tag.service'
import RESPONSE from '@/utils/response'

export class QuestionTagController {
	public static readonly getAll: RequestHandler = async (req, res, next) => {
		try {
			const tags = await QuestionTagService.getAll()
			return RESPONSE.SuccessResponse(res, 200, {
				data: tags,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const { name, description } = req.body as {
				name: string
				description?: string | null
			}
			const existing = await QuestionTagService.getAll()
			if (existing.some((tag) => tag.name === name)) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						name: ['The question tag name has already been taken.'],
					},
				})
			}
			await QuestionTagService.create({ name, description: description ?? '' })
			return RESPONSE.SuccessResponse(res, 201, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
