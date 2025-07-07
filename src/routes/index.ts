import { Router, type Router as ExpressRouter } from 'express'
import authRoutes from './auth.routes'
import languageRouter from './language.routes'
import userRouter from './user.routes'
import questionValidationRoutes from './question_validation_rules.routes'
import formTypeRouter from './form_type.routes'
import categoryRouter from './category.routes'
import categoryLanguageRouter from './category_language.routes'
import unitRouter from './unit.routes'
import offerRouter from './offer.routes'

const v1Router: ExpressRouter = Router()

//Routes
v1Router.use(authRoutes)
v1Router.use(languageRouter)
v1Router.use(userRouter)
v1Router.use(questionValidationRoutes)
v1Router.use(formTypeRouter)
v1Router.use(categoryRouter)
v1Router.use(categoryLanguageRouter)
v1Router.use(unitRouter)
v1Router.use(offerRouter)

export default v1Router
