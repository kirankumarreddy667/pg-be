import { RequestHandler } from 'express'
import { PlanService } from '@/services/plan.service'
import RESPONSE from '@/utils/response'

interface CreatePlanBody {
	name: string
	amount: string
	plan_type_id: number
	language_id: number
}

export class PlanController {
	public static readonly addPlan: RequestHandler = async (req, res, next) => {
		try {
			const data = req.body as CreatePlanBody
			const plan = await PlanService.addPlan(data)

			RESPONSE.SuccessResponse(res, 201, {
				data: plan,
				message: 'Plan added successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAllPlans: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const language_id = Number(req.params.language_id)

			if (isNaN(language_id)) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Invalid language_id',
				})
			}

			const plans = await PlanService.getAllPlans(language_id)

			RESPONSE.SuccessResponse(res, 200, {
				data: plans,
				message: 'Plans fetched successfully',
			})
		} catch (error) {
			next(error)
		}
	}
}
