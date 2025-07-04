import { Router, type Router as ExpressRouter } from 'express'
import { QuestionUnitController } from '@/controllers/question_unit.controller'
import { wrapAsync } from '@/utils/asyncHandler'

const questionUnitRouter: ExpressRouter = Router()

questionUnitRouter.get(
	'/question_unit',
	wrapAsync(QuestionUnitController.getAll),
)

export default questionUnitRouter
