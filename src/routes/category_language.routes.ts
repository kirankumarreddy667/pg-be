import { Router, type Router as ExpressRouter } from 'express'
import { CategoryLanguageController } from '@/controllers/category_language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	categoryLanguageSchema,
	updateCategoryLanguageSchema,
} from '@/validations/category_language.validation'

const categoryLanguageRouter: ExpressRouter = Router()

categoryLanguageRouter.post(
	'/add_category_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(categoryLanguageSchema),
	wrapAsync(CategoryLanguageController.addCategoryInOtherLanguage),
)

categoryLanguageRouter.get(
	'/all_category_by_language/:language_id',
	authenticate,
	wrapAsync(CategoryLanguageController.getAll),
)

categoryLanguageRouter.get(
	'/get_category_details_by_language/:category_id/:language_id',
	authenticate,
	wrapAsync(CategoryLanguageController.getById),
)

categoryLanguageRouter.put(
	'/update_category_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateCategoryLanguageSchema),
	wrapAsync(CategoryLanguageController.update),
)

export default categoryLanguageRouter
