import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { TypeService } from '@/services/type.service'

export class TypeController {
	static addType: RequestHandler = async (req, res, next) => {
		try {
			const result = await TypeService.create(
				req.body as {
					type: string
				},
			)
			RESPONSE.SuccessResponse(res, 201, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static updateType: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
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

	static getTypeById: RequestHandler = async (req, res, next) => {
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

	static getAllTypes: RequestHandler = async (req, res, next) => {
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

	static deleteType: RequestHandler = async (req, res, next) => {
		try {
			const id = Number(req.params.id)
			const result = await TypeService.delete(id)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}
}
