import { Router, type Router as ExpressRouter } from 'express';
import { FormTypeController } from '@/controllers/form_type.controller';
import { wrapAsync } from '@/utils/asyncHandler';
import { authenticate, authorize } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import { formTypeSchema } from '@/validations/form_type.validation';

const formTypeRouter: ExpressRouter = Router();

formTypeRouter.post(
  '/form-type',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  validateRequest(formTypeSchema),
  wrapAsync(FormTypeController.createFormType),
);

formTypeRouter.put(
  '/form-type/:id',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  validateRequest(formTypeSchema),
  wrapAsync(FormTypeController.updateFormType),
);

formTypeRouter.get(
  '/form-type',
  authenticate,
  wrapAsync(FormTypeController.getAllFormTypes),
);

formTypeRouter.get(
  '/form-type/:id',
  authenticate,
  wrapAsync(FormTypeController.getFormTypeById),
);

formTypeRouter.delete(
  '/form-type/:id',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  wrapAsync(FormTypeController.deleteFormTypeById),
);

export default formTypeRouter; 