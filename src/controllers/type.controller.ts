import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { TypeService } from '@/services/type.service'

export class TypeController {
	public static readonly addType: RequestHandler = async (req, res, next) => {
		try {
			const result = await TypeService.create(
				req.body as {
					type: string
				},
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateType: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const id = Number(req.params.id)
			const type = await TypeService.findById(id)
			if (!type)
				return RESPONSE.FailureResponse(res, 404, { message: 'Not found' })
			const result = await TypeService.update(
				id,
				req.body as {
					type: string
				},
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getTypeById: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const id = Number(req.params.id)
			const type = await TypeService.findById(id)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: type,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAllTypes: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const types = await TypeService.listAll()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: types,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly deleteType: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const id = Number(req.params.id)
			const result = await TypeService.delete(id)
			if (!result)
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Something went wrong. Please try again',
				})
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}
}
