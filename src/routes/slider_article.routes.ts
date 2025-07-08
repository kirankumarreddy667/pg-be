import { Router } from 'express'
import { SliderArticleController } from '@/controllers/slider_article.controller'
import { sliderArticleSchema } from '@/validations/slider_article.validation'
import { validateRequest } from '@/middlewares/validateRequest'

const router: Router = Router()

router.post(
	'/slider_article',
	validateRequest(sliderArticleSchema),
	SliderArticleController.addArticle,
)

router.get(
	'/slider_article/:language_id',
	SliderArticleController.getArticle,
)

export default router
