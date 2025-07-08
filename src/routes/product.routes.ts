import { Router } from 'express'
import { ProductController } from '@/controllers/product.controller'
import { productSchema } from '@/validations/product.validation'
import { validateRequest } from '@/middlewares/validateRequest'

const router: Router = Router()

router.post(
	'/products',
	validateRequest(productSchema),
	ProductController.addProducts,
)

router.get('/products/:category_id/:language_id', ProductController.getProducts)

export default router
