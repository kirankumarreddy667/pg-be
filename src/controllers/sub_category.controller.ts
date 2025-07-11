import { RequestHandler } from 'express'
import { SubcategoryService } from '@/services/sub_category.service'
import RESPONSE from '@/utils/response'

export class SubcategoryController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const { name } = req.body as { name: string }
			const existing = await SubcategoryService.getByName(name)
			if (existing) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						name: ['The subcategory name has already been taken.'],
					},
				})
			}
			await SubcategoryService.create({ name })
			return RESPONSE.SuccessResponse(res, 201, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAll: RequestHandler = async (req, res, next) => {
		try {
			const subcategories = await SubcategoryService.getAll()
			return RESPONSE.SuccessResponse(res, 200, {
				data: subcategories,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getById: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const subcategory = await SubcategoryService.getById(Number(id))
			if (!subcategory) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
					data: [],
				})
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: subcategory,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const { name } = req.body as { name: string }
			const existing = await SubcategoryService.getByName(name)
			if (existing && existing.get('id') !== Number(id)) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						name: ['The subcategory name has already been taken.'],
					},
				})
			}
			const updated = await SubcategoryService.update(Number(id), { name })
			if (!updated) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
					data: [],
				})
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly delete: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const deleted = await SubcategoryService.deleteById(Number(id))
			if (!deleted) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
					data: [],
				})
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
