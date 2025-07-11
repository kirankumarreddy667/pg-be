import { RequestHandler } from 'express'
import { UnitService } from '@/services/unit.service'
import RESPONSE from '@/utils/response'

export class UnitController {
	public static readonly getAllUnits: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const units = await UnitService.getAllUnits()
			RESPONSE.SuccessResponse(res, 200, {
				data: units,
				message: 'Units fetched successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getUnitById: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id: number = Number(req.params.id)
			const unit = await UnitService.getUnitById(id)
			if (!unit) {
				RESPONSE.FailureResponse(res, 404, { message: 'Unit not found' })
				return
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: unit,
				message: 'Unit fetched successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly createUnit: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const { name, display_name } = req.body as {
				name: string
				display_name: string
			}
			const unit = await UnitService.createUnit({ name, display_name })
			RESPONSE.SuccessResponse(res, 201, {
				data: unit,
				message: 'Unit created successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateUnit: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id: number = Number(req.params.id)
			const { name, display_name } = req.body as {
				name?: string
				display_name?: string
			}
			const updated = await UnitService.updateUnit(id, { name, display_name })
			if (!updated) {
				RESPONSE.FailureResponse(res, 404, { message: 'Unit not found' })
				return
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: updated,
				message: 'Unit updated successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly deleteUnit: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id: number = Number(req.params.id)
			const deleted = await UnitService.deleteUnit(id)
			if (!deleted) {
				RESPONSE.FailureResponse(res, 404, {
					message: 'Unit not found or already deleted',
				})
				return
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Unit deleted successfully',
			})
		} catch (error) {
			next(error)
		}
	}
}
