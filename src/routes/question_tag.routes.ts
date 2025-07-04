import { Router, type Router as ExpressRouter } from 'express'
import { QuestionTagController } from '@/controllers/question_tag.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { questionTagSchema } from '@/validations/question_tag.validation'

const questionTagRouter: ExpressRouter = Router()

questionTagRouter.get('/question_tag', wrapAsync(QuestionTagController.getAll))

questionTagRouter.post(
	'/question_tag',
	validateRequest(questionTagSchema),
	wrapAsync(QuestionTagController.create),
)

export default questionTagRouter
