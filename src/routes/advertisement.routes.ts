import { Router } from 'express'
import { AdvertisementController } from '@/controllers/advertisement.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { advertisementSchema } from '@/validations/advertisement.validation'

const router: Router = Router()

router.post(
	'/advertisement',
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.create),
)

router.get('/advertisement', wrapAsync(AdvertisementController.index))
router.get('/advertisement/:id', wrapAsync(AdvertisementController.show))
router.put(
	'/advertisement/:id',
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)
router.patch(
	'/advertisement/:id',
	validateRequest(advertisementSchema),
	wrapAsync(AdvertisementController.update),
)
router.delete('/advertisement/:id', wrapAsync(AdvertisementController.destroy))

export default router
