import { Router, type Router as ExpressRouter } from 'express'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { UserController } from '@/controllers/user.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import { sortUsersSchema } from '@/validations/user.validation'
const router: ExpressRouter = Router()

router.get(
	'/get_all_users',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(UserController.getAllUsers),
)

router.post(
	'/get_all_users',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(UserController.getFilteredUsers),
)

router.post(
	'/sort_users',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(sortUsersSchema),
	wrapAsync(UserController.sortUsers),
)

export default router
