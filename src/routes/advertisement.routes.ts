import { Router } from 'express'
import { AdvertisementController } from '@/controllers/advertisement.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { advertisementSchema } from '@/validations/advertisement.validation'
import { authenticate } from '@/middlewares/auth.middleware'

const router: Router = Router()

router.post(
	'/advertisement',
	authenticate,
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.create),
)

router.get(
	'/advertisement',
	authenticate,
	wrapAsync(AdvertisementController.index),
)
router.get(
	'/advertisement/:id',
	authenticate,
	wrapAsync(AdvertisementController.show),
)
router.put(
	'/advertisement/:id',
	authenticate,
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)
router.patch(
	'/advertisement/:id',
	authenticate,
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)
router.delete('/advertisement/:id', wrapAsync(AdvertisementController.destroy))

export default router
