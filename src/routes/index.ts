import { Router, type Router as ExpressRouter } from 'express'
import authRoutes from './auth.routes'

const v1Router: ExpressRouter = Router()

//Routes
v1Router.use(authRoutes)

export default v1Router
