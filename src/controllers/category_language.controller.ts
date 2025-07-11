import { RequestHandler } from 'express'
import { CategoryLanguageService } from '@/services/category_language.service'
import RESPONSE from '@/utils/response'

export class CategoryLanguageController {
	public static readonly add: RequestHandler = async (req, res, next) => {
		try {
			const { category_id, language_id, category_language_name } = req.body as {
				category_id: number
				language_id: number
				category_language_name: string
			}
			// Check if category exists
			if (!(await CategoryLanguageService.categoryExists(category_id))) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Category not found.',
					data: [],
				})
			}
			// Check if language exists
			if (!(await CategoryLanguageService.languageExists(language_id))) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Language not found.',
					data: [],
				})
			}
			// Check for uniqueness
			const existing = await CategoryLanguageService.getByCategoryAndLanguage(
				category_id,
				language_id,
			)
			if (existing) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						category_id: [
							'This category already has a translation in this language.',
						],
					},
				})
			}
			await CategoryLanguageService.addCategoryInOtherLanguage({
				category_id,
				language_id,
				category_language_name,
			})
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
			const { language_id } = req.params
			const records = await CategoryLanguageService.getAllByLanguage(
				Number(language_id),
			)
			return RESPONSE.SuccessResponse(res, 200, {
				data: records,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getById: RequestHandler = async (req, res, next) => {
		try {
			const { category_id, language_id } = req.params
			const record = await CategoryLanguageService.getByCategoryAndLanguage(
				Number(category_id),
				Number(language_id),
			)
			if (!record) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
					data: [],
				})
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: record,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const { category_language_name, language_id } = req.body as {
				category_language_name: string
				language_id: number
			}
			// Check for uniqueness (except current record)
			const existing = await CategoryLanguageService.getByNameAndLanguage(
				category_language_name,
				language_id,
			)
			if (existing && existing.id !== Number(id)) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						category_language_name: [
							'This name already exists for this language.',
						],
					},
				})
			}
			const updated = await CategoryLanguageService.update(Number(id), {
				category_language_name,
				language_id,
			})
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
}
