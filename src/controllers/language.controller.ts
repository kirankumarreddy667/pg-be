import { RequestHandler } from 'express'
import { LanguageService } from '@/services/language.service'
import { UserService } from '@/services/user.service'
import RESPONSE from '@/utils/response'
import { User } from '@/models/user.model'

interface UpdateUserLanguageBody {
	language_id: number
}

export class LanguageController {
	public static readonly getAllLanguages: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const languages = await LanguageService.getAllLanguages()
			RESPONSE.SuccessResponse(res, 200, {
				data: languages,
				message: 'success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly createLanguage: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { name, language_code } = req.body as {
				name: string
				language_code: string
			}
			const language = await LanguageService.createLanguage({
				name,
				language_code,
			})
			RESPONSE.SuccessResponse(res, 201, {
				data: language,
				message: 'Language created successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateLanguage: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params
			const { name, language_code } = req.body as {
				name?: string
				language_code?: string
			}
			const updated = await LanguageService.updateLanguage(Number(id), {
				name,
				language_code,
			})
			if (!updated) {
				RESPONSE.FailureResponse(res, 404, { message: 'Language not found' })
				return
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: updated,
				message: 'Language updated successfully',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateUserLanguage: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = Number((req.user as User)?.id)
			const { language_id } = req.body as UpdateUserLanguageBody
			const updated = await UserService.updateUserLanguage(
				userId,
				Number(language_id),
			)
			if (!updated) {
				RESPONSE.FailureResponse(res, 404, { message: 'User not found' })
				return
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
