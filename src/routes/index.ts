import { Router, type Router as ExpressRouter } from 'express'
import authRoutes from './auth.routes'
import languageRouter from './language.routes'
import userRouter from './user.routes'
import questionValidationRoutes from './question_validation_rules.routes'

const v1Router: ExpressRouter = Router()

//Routes
v1Router.use(authRoutes)
v1Router.use(languageRouter)
v1Router.use(userRouter)
v1Router.use(questionValidationRoutes)

export default v1Router
