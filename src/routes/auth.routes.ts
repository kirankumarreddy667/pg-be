import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import {
	refreshTokenMiddleware,
	csrfProtection,
} from '../middlewares/auth.middleware'
import { wrapAsync } from '../utils/asyncHandler'
import { validateRequest } from '../middlewares/validateRequest'
import { registerSchema } from '../validations/auth.validation'

const router: Router = Router()

// Public routes
router.post(
	'/register',
	validateRequest(registerSchema),
	wrapAsync(AuthController.register),
)
// router.post('/login', wrapAsync(AuthController.login))
// router.post('/logout', wrapAsync(AuthController.logout))

// Protected routes
router.post(
	'/refresh',
	csrfProtection,
	wrapAsync(refreshTokenMiddleware),
	wrapAsync(AuthController.refreshToken),
)

export default router
