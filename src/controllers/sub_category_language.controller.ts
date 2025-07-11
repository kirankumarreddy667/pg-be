import { RequestHandler } from 'express'
import { SubCategoryLanguageService } from '@/services/sub_category_language.service'
import RESPONSE from '@/utils/response'

export class SubCategoryLanguageController {
	public static readonly add: RequestHandler = async (req, res, next) => {
		try {
			const { sub_category_id, language_id, sub_category_language_name } =
				req.body as {
					sub_category_id: number
					language_id: number
					sub_category_language_name: string
				}
			if (
				!(await SubCategoryLanguageService.subCategoryExists(sub_category_id))
			) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Subcategory not found.',
					data: [],
				})
			}
			if (!(await SubCategoryLanguageService.languageExists(language_id))) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Language not found.',
					data: [],
				})
			}
			const existing =
				await SubCategoryLanguageService.getBySubCategoryAndLanguage(
					sub_category_id,
					language_id,
				)
			if (existing) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						sub_category_id: [
							'This subcategory already has a translation in this language.',
						],
					},
				})
			}
			await SubCategoryLanguageService.add({
				sub_category_id,
				language_id,
				sub_category_language_name,
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
			const records = await SubCategoryLanguageService.getAllByLanguage(
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
			const { sub_category_id, language_id } = req.params
			const record =
				await SubCategoryLanguageService.getBySubCategoryAndLanguage(
					Number(sub_category_id),
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
			const { sub_category_language_name, language_id } = req.body as {
				sub_category_language_name: string
				language_id: number
			}
			// Check for uniqueness (except current record)
			const existing = await SubCategoryLanguageService.getByNameAndLanguage(
				sub_category_language_name,
				language_id,
			)
			if (existing && existing.id !== Number(id)) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						sub_category_language_name: [
							'This name already exists for this language.',
						],
					},
				})
			}
			const updated = await SubCategoryLanguageService.update(Number(id), {
				sub_category_language_name,
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
