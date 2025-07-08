import { Router } from 'express'
import { AppAboutContentController } from '@/controllers/app_about_content.controller'

const router: Router = Router()

router.get(
	'/about_app_data/:language_id/:name',
	AppAboutContentController.getAppAboutContents,
)

export default router
