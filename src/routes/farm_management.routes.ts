import { Router } from 'express'
import { FarmManagementController } from '@/controllers/farm_management.controller'
import { userFarmDetailsSchema } from '@/validations/user_farm_details.validation'
import { fixedInvestmentDetailsSchema } from '@/validations/fixed_investment_details.validation'
import { validateRequest } from '@/middlewares/validateRequest'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'

const router: Router = Router()

router.post(
	'/farm_details',
	authenticate,
	validateRequest(userFarmDetailsSchema),
	wrapAsync(FarmManagementController.storeFarmDetails),
)

router.get(
	'/farm_details/:id',
	authenticate,
	wrapAsync(FarmManagementController.showFarmDetails),
)

router.put(
	'/farm_details/:id',
	authenticate,
	wrapAsync(FarmManagementController.updateFarmDetails),
)

router.get(
	'/farm_types/:language_id',
	authenticate,
	wrapAsync(FarmManagementController.farmTypes),
)

router.get(
	'/investment_type/:language_id',
	authenticate,
	wrapAsync(FarmManagementController.investmentTypes),
)

router.post(
	'/farm_investment_details',
	authenticate,
	validateRequest(fixedInvestmentDetailsSchema),
	wrapAsync(FarmManagementController.storeFixedInvestmentDetails),
)

router.get(
	'/investment_details_report/:id',
	authenticate,
	wrapAsync(FarmManagementController.investmentDetailsReport),
)

export default router
