import { Router, type Router as ExpressRouter } from 'express'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { UserController } from '@/controllers/user.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	sortUsersSchema,
	updateProfileSchema,
	updatePaymentStatusSchema,
} from '@/validations/user.validation'
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

router.get(
	'/get_user_by_id/:id',
	authenticate,
	wrapAsync(UserController.getUserById),
)

router.put(
	'/update_profile/:id',
	authenticate,
	validateRequest(updateProfileSchema),
	wrapAsync(UserController.updateProfile),
)

router.post(
	'/update_payment_status',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updatePaymentStatusSchema),
	wrapAsync(UserController.updatePaymentStatus),
)

export default router
