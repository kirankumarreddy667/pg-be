import { Router, Response, Request } from 'express'
import { SummernoteController } from '@/controllers/summernote.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import { summernoteSchema } from '@/validations/summernote.validation'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate } from '@/middlewares/auth.middleware'

const router: Router = Router()

router.post(
	'/summernote',
	authenticate,
	validateRequest(summernoteSchema),
	wrapAsync(SummernoteController.store),
)

router.get('/summernote', (req: Request, res: Response) =>
	res.render('summernote'),
)

// router.get('/summernote_display', wrapAsync(SummernoteController.show))

router.get(
	'/summernote/:category_id/:language_id',
	wrapAsync(SummernoteController.show),
)

router.get(
	'/profitable_farming_article/:category_id/:language_id',
	wrapAsync(SummernoteController.show),
)

router.get(
	'/profitable_farming_article_all',
	wrapAsync(SummernoteController.index),
)

export default router
