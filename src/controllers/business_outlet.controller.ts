import { NextFunction, Request, Response } from 'express'
import RESPONSE from '@/utils/response'
import { BusinessOutletService } from '@/services/business_outlet.service'

export const BusinessOutletController = {
	store: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			await BusinessOutletService.create(
				req.body as {
					business_name: string
					owner_name: string
					email: string
					mobile: string
					business_address: string
				},
			)
			RESPONSE.SuccessResponse(res, 201, {
				message: 'Business outlet created successfully',
				data: [],
			})
			return
		} catch (error) {
			next(error)
		}
	},

	list: async (
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const outlets = await BusinessOutletService.list()
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: outlets })
		} catch (error) {
			next(error)
		}
	},

	update: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const id = Number(req.params.id)
			await BusinessOutletService.update(
				id,
				req.body as {
					business_name: string
					owner_name: string
					email: string
					mobile: string
					business_address: string
				},
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Business outlet updated',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	},

	delete: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const id = Number(req.params.id)
			await BusinessOutletService.delete(id)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	},
}
