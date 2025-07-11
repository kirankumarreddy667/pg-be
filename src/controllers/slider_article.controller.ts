import { RequestHandler } from 'express'
import { SliderArticleService } from '@/services/slider_article.service'
import RESPONSE from '@/utils/response'

interface SliderArticle {
	language_id: number
	name: string
	image: string
	web_url: string
	subtitle: string
	thumbnail: string
}
export class SliderArticleController {
	public static readonly addArticle: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const data = (req.body as { data?: SliderArticle[] }).data ?? []

			await SliderArticleService.addArticles(data)

			RESPONSE.SuccessResponse(res, 201, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly getArticle: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const language_id = Number(req.params.language_id)
			const data = await SliderArticleService.getArticlesByLanguage(language_id)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}
}
