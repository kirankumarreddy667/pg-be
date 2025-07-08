import { Router } from 'express'
import { BusinessOutletController } from '@/controllers/business_outlet.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import { businessOutletSchema } from '@/validations/business_outlet.validation'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'

const router: Router = Router()

router.post(
	'/business_outlet',
    authenticate,
	validateRequest(businessOutletSchema),
    wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.store),
)

router.get(
	'/business_outlet',
    authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.list),
)

router.put(
	'/business_outlet/:id',
    authenticate,
	validateRequest(businessOutletSchema),
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.update),
)

router.delete(
	'/business_outlet/:id',
    authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(BusinessOutletController.delete),
)

export default router
