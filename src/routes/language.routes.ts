import { Router, type Router as ExpressRouter } from 'express'
import { LanguageController } from '@/controllers/language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createLanguageSchema,
	updateLanguageSchema,
	updateUserLanguageSchema,
} from '@/validations/language.validation'

const languageRouter: ExpressRouter = Router()

languageRouter.get(
	'/language',
	authenticate,
	wrapAsync(LanguageController.getAllLanguages),
)
languageRouter.post(
	'/language',
	authenticate,
	authorize(['superAdmin']),
	validateRequest(createLanguageSchema),
	wrapAsync(LanguageController.createLanguage),
)
languageRouter.put(
	'/language/:id',
	authenticate,
	authorize(['superAdmin']),
	validateRequest(updateLanguageSchema),
	wrapAsync(LanguageController.updateLanguage),
)
languageRouter.put(
	'/user_language',
	authenticate,
	validateRequest(updateUserLanguageSchema),
	wrapAsync(LanguageController.updateUserLanguage),
)

export default languageRouter
