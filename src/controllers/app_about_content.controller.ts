import { RequestHandler } from 'express'
import { AppAboutContentService } from '@/services/app_about_content.service'
import RESPONSE from '@/utils/response'

export class AppAboutContentController {
	public static readonly getAppAboutContents: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const language_id = Number(req.params.language_id)
			const type = req.params.name
			const data = await AppAboutContentService.getAppAboutContents(
				language_id,
				type,
			)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}
}
