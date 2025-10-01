import { RequestHandler } from 'express'
import { UserPaymentService } from '@/services/user_payment.service'
import { Plan } from '@/models'
import { User } from '@/models/user.model'
import RESPONSE from '@/utils/response'
import { ValidationRequestError } from '@/utils/errors'
import { PaymentVerify } from '@/types/payment'

export class UserPaymentController {
	static readonly createUserPayment: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			if (!req.user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}

			const userId = (req.user as User).id
			const { plan_id, quantity, offer_id, coupon_id } = req.body as {
				plan_id: number
				quantity?: number
				offer_id?: number
				coupon_id?: number
			}

			const plan = await Plan.findOne({
				where: { id: plan_id, deleted_at: null },
			})
			if (!plan) {
				throw new ValidationRequestError({
					plan_id: ['The selected plan id is invalid.'],
				})
			}

			const planAmountRaw = Number(plan.get('amount'))
			if (isNaN(planAmountRaw) || planAmountRaw <= 0) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Invalid plan amount',
					data: [],
				})
			}

			const totalAmount = planAmountRaw * (quantity || 1)

			const paymentData = {
				plan_id,
				amount: totalAmount,
				offer_id,
				coupon_id,
			}

			const result = await UserPaymentService.createPaymentOrder(
				userId,
				paymentData,
			)

			if (result.success) {
				return RESPONSE.SuccessResponse(res, 200, {
					data: result.data,
					message: 'Success',
				})
			}
			return RESPONSE.FailureResponse(res, 500, {
				message: 'Something went wrong. Please try again later.',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static readonly verifyAndProcessPayment: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			if (!req.user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}

			const userId = (req.user as User).id
			const data = req.body as PaymentVerify
			const result = await UserPaymentService.verifyAndProcessPayment(
				userId,
				data,
			)
			if (result.success) {
				return RESPONSE.SuccessResponse(res, 200, {
					data: result.data,
					message: result.message,
				})
			}
			return RESPONSE.FailureResponse(res, 400, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static readonly handleWebhook: RequestHandler = async (req, res, next) => {
		try {
			const signature = (req.headers['x-razorpay-signature'] as string) || ''
			const result = await UserPaymentService.handleWebhook(
				signature,
				req.body as Buffer,
			)

			// Send proper HTTP response
			if (result.success) {
				return RESPONSE.SuccessResponse(res, 200, {
					message: result.message,
					data: result.data,
				})
			} else {
				return RESPONSE.FailureResponse(res, 400, {
					message: result.message,
					data: result.data,
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly getPlanPaymentHistory: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			const userId = user.id
			const history = await UserPaymentService.getPlanPaymentHistory(userId)
			return RESPONSE.SuccessResponse(res, 200, {
				data: history,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
