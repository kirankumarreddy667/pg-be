import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { SummernoteService } from '@/services/summernote.service'

export class SummernoteController {
	public static readonly store: RequestHandler = async (req, res, next) => {
		try {
			const { summernoteInput } = req.body as { summernoteInput: string }
			const summernote = await SummernoteService.create(summernoteInput)
			const plainSummernote = summernote.toJSON()

			return res.render('summernote_display', { summernote: plainSummernote })
		} catch (error) {
			next(error)
		}
	}

	public static readonly show: RequestHandler = async (req, res, next) => {
		try {
			const categoryId = Number(req.params.category_id)
			const languageId = Number(req.params.language_id)
			const data = await SummernoteService.getByCategoryAndLanguage(
				categoryId,
				languageId,
			)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly index: RequestHandler = async (req, res, next) => {
		try {
			const data = await SummernoteService.listAll()
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}
}
