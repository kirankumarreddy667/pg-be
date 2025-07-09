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

	mapUserWithBusinessOutlet: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const { user_id, business_outlet_id } = req.body as {
				user_id: number
				business_outlet_id: number
			}
			const mapping = await BusinessOutletService.mapUserWithBusinessOutlet({
				user_id,
				business_outlet_id,
			})
			RESPONSE.SuccessResponse(res, 201, {
				message: 'Mapping created',
				data: mapping,
			})
		} catch (error) {
			next(error)
		}
	},

	businessOutletFarmers: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const business_outlet_id = Number(req.params.id)
			const farmers =
				await BusinessOutletService.businessOutletFarmers(business_outlet_id)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: farmers,
			})
		} catch (error) {
			next(error)
		}
	},

	farmersList: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const { start_date, end_date, search } = req.body as {
				start_date?: string
				end_date?: string
				search: string
			}
			const farmers = await BusinessOutletService.farmersList({
				start_date,
				end_date,
				search,
			})
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: farmers,
			})
		} catch (error) {
			next(error)
		}
	},

	deleteMappedFarmerToBusinessOutlet: async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const farmer_id = Number(req.params.farmer_id)
			const business_outlet_id = Number(req.params.business_outlet_id)
			await BusinessOutletService.deleteMappedFarmerToBusinessOutlet(
				farmer_id,
				business_outlet_id,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Mapping deleted',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	},
}
