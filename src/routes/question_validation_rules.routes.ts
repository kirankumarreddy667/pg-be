import { Router } from 'express'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { ValidationRuleController } from '@/controllers/validation_rule.controller'
import { validationRuleSchema } from '@/validations/validation_rule.validation'

const router: Router = Router()

router.post(
	'/validation',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(validationRuleSchema),
	wrapAsync(ValidationRuleController.create),
)

router.put(
	'/validation/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(validationRuleSchema),
	wrapAsync(ValidationRuleController.update),
)

router.get(
	'/validation',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(ValidationRuleController.getAll),
)

router.get(
	'/validation/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(ValidationRuleController.getById),
)

router.delete(
	'/validation/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(ValidationRuleController.deleteById),
)

export default router
