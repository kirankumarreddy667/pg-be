import { Router, type Router as ExpressRouter } from 'express'
import { SubCategoryLanguageController } from '@/controllers/sub_category_language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	subCategoryLanguageSchema,
	updateSubCategoryLanguageSchema,
} from '@/validations/sub_category_language.validation'

const subCategoryLanguageRouter: ExpressRouter = Router()

subCategoryLanguageRouter.post(
	'/add_sub_category_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subCategoryLanguageSchema),
	wrapAsync(SubCategoryLanguageController.add),
)

subCategoryLanguageRouter.get(
	'/get_all_sub_category_details_by_language/:language_id',
	authenticate,
	wrapAsync(SubCategoryLanguageController.getAll),
)

subCategoryLanguageRouter.get(
	'/get_sub_category_details_by_language/:sub_category_id/:language_id',
	authenticate,
	wrapAsync(SubCategoryLanguageController.getById),
)

subCategoryLanguageRouter.put(
	'/update_sub_category_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateSubCategoryLanguageSchema),
	wrapAsync(SubCategoryLanguageController.update),
)

export default subCategoryLanguageRouter
