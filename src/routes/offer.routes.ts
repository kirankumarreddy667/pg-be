import { Router } from 'express'
import { offerController } from '@/controllers/offer.controller' // ✅ correct instance
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { createOfferSchema } from '@/validations/offer.validation'
import { wrapAsync } from '@/utils/asyncHandler'

const offerRouter: Router = Router()

offerRouter.get(
  '/offers',
  wrapAsync(offerController.getAllOffers)
)

offerRouter.get(
  '/offers/:language_id',
  wrapAsync(offerController.getOffersByLanguage)
)

offerRouter.post(
  '/offers',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  validateRequest(createOfferSchema),
  wrapAsync(offerController.createOffer)
)

export default offerRouter
