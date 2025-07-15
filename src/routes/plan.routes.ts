import { Router } from 'express';
import { PlanController } from '@/controllers/plan.controller';
import { wrapAsync } from '@/utils/asyncHandler';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import { createPlanSchema } from '@/validations/plan.validation';

const planRouter: Router = Router();

planRouter.post(
  '/plan',
  authenticate,
  validateRequest(createPlanSchema),
  wrapAsync(PlanController.addPlan)
);

planRouter.get(
  '/plan/:language_id',
  authenticate,
  wrapAsync(PlanController.getAllPlans)
);

export default planRouter;
