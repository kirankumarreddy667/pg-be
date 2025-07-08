import { Router } from 'express'
import { ContactUsController } from '@/controllers/contact_us.controller'

const router: Router = Router()

router.get('/contact_us_detail', ContactUsController.getDetail)

export default router
