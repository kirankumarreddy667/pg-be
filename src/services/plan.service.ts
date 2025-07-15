import db from '@/config/database'
import { Plan } from '@/models/plan.model'


interface PlanResponse {
  id: number
  plan_name: string
  plan_amount: string
  plan_type: string
  plan_type_id: number
}

interface PlanWithType extends Plan {
  PlanType?: {
    name: string
  }
}

export class PlanService {
  static async addPlan(data: {
    name: string
    amount: string
    plan_type_id: number
    language_id: number
  }): Promise<Plan> {
    return db.Plan.create(data)
  }

  static async getAllPlans(language_id: number): Promise<PlanResponse[]> {
    const plans = await db.Plan.findAll({
      where: { language_id },
      include: [
        {
          model: db.PlanType,
          as: 'PlanType',
          attributes: ['name'],
        },
      ],
    })

    return plans.map((plan) => {
      const plainPlan = plan.get({ plain: true }) as PlanWithType

      return {
        id: plainPlan.id,
        plan_name: plainPlan.name,
        plan_amount: plainPlan.amount,
        plan_type: plainPlan.PlanType?.name ?? '',
        plan_type_id: plainPlan.plan_type_id,
      }
    })
  }
}
