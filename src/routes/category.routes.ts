import { Router, type Router as ExpressRouter } from 'express'
import { CategoryController } from '@/controllers/category.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { categorySchema } from '@/validations/category.validation'

const categoryRouter: ExpressRouter = Router()

categoryRouter.post(
	'/category',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(categorySchema),
	wrapAsync(CategoryController.createCategory),
)

categoryRouter.get(
	'/category',
	authenticate,
	wrapAsync(CategoryController.getAllCategories),
)

categoryRouter.get(
	'/category/:id',
	authenticate,
	wrapAsync(CategoryController.getCategoryById),
)

categoryRouter.put(
	'/category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(categorySchema),
	wrapAsync(CategoryController.updateCategory),
)

categoryRouter.delete(
	'/category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(CategoryController.deleteCategoryById),
)

export default categoryRouter
