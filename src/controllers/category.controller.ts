import { RequestHandler } from 'express'
import { CategoryService } from '@/services/category.service'
import RESPONSE from '@/utils/response'

export class CategoryController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const { name } = req.body as { name: string }
			const existingCategory = await CategoryService.getCategoryByName(name)
			if (existingCategory) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						name: ['The category name has already been taken.'],
					},
				})
			}
			await CategoryService.createCategory({ name })
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
			const categories = await CategoryService.getAll()
			return RESPONSE.SuccessResponse(res, 200, {
				data: categories,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getById: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const category = await CategoryService.getById(Number(id))
			if (!category) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
					data: [],
				})
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: category,
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
			const existingCategory = await CategoryService.getCategoryByName(name)
			if (existingCategory && existingCategory.get('id') !== Number(id)) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						name: ['The category name has already been taken.'],
					},
				})
			}
			const updated = await CategoryService.updateCategory(Number(id), { name })
			if (!updated) {
				return res.status(404).json({ message: 'Not found.', data: [] })
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
			const deleted = await CategoryService.deleteById(Number(id))
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
