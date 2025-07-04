import { Router, type Router as ExpressRouter } from 'express'
import { SubcategoryController } from '@/controllers/sub_category.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { subcategorySchema } from '@/validations/sub_category.validation'

const subcategoryRouter: ExpressRouter = Router()

subcategoryRouter.post(
	'/sub_category',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subcategorySchema),
	wrapAsync(SubcategoryController.create),
)

subcategoryRouter.get(
	'/sub_category',
	authenticate,
	wrapAsync(SubcategoryController.getAll),
)

subcategoryRouter.get(
	'/sub_category/:id',
	authenticate,
	wrapAsync(SubcategoryController.getById),
)

subcategoryRouter.put(
	'/sub_category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subcategorySchema),
	wrapAsync(SubcategoryController.update),
)

subcategoryRouter.delete(
	'/sub_category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(SubcategoryController.delete),
)

export default subcategoryRouter
