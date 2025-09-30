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
			const { tags } = req.body as {
				tags: string[]
			}
			await QuestionTagService.create(tags)
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
