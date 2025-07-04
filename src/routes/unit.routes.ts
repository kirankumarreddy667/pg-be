import { Router, type Router as ExpressRouter } from 'express'
import { UnitController } from '@/controllers/unit.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
  createUnitSchema,
  updateUnitSchema,
} from '@/validations/unit.validation'

const unitRouter: ExpressRouter = Router()

unitRouter.get(
  '/unit',
  authenticate,
  wrapAsync(UnitController.getAllUnits)
)

unitRouter.get(
  '/unit/:id',
  authenticate,
  wrapAsync(UnitController.getUnitById)
)

unitRouter.post(
  '/unit',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  validateRequest(createUnitSchema),
  wrapAsync(UnitController.createUnit)
)

unitRouter.put(
  '/unit/:id',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  validateRequest(updateUnitSchema),
  wrapAsync(UnitController.updateUnit)
)

unitRouter.delete(
  '/unit/:id',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  wrapAsync(UnitController.deleteUnit)
)

export default unitRouter
