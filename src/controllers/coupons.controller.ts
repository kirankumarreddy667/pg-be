import { RequestHandler } from 'express'
import { CouponService } from '@/services/coupons.service'
import RESPONSE from '@/utils/response'

export class CouponController {
	public static readonly getAllCoupons: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const coupons = await CouponService.getAllCoupons()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: coupons,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly createCoupon: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			if (!req.file) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'CSV file is required',
				})
			}

			const result = await CouponService.createFromCSV(req.file)

			if (result) {
				RESPONSE.SuccessResponse(res, 201, {
					message: 'Coupons created successfully',
				})
			} else {
				RESPONSE.FailureResponse(res, 500, {
					message: 'Failed to create coupons',
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly checkCoupon: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { code, type } = req.params
			const coupon = await CouponService.findByCode(code, type)

			if (coupon) {
				RESPONSE.SuccessResponse(res, 200, {
					message: 'Valid coupon',
					data: coupon,
				})
			} else {
				RESPONSE.FailureResponse(res, 404, {
					message: 'Invalid coupon',
				})
			}
		} catch (error) {
			next(error)
		}
	}
}
