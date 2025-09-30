import db from '@/config/database'
import { Language } from '@/models/language.model'
import { ValidationRequestError } from '@/utils/errors'

export class LanguageService {
	static async getAllLanguages(): Promise<Language[]> {
		return await db.Language.findAll({ where: { deleted_at: null } })
	}

	static async createLanguage(
		language: {
			name: string
			language_code: string
		}[],
	): Promise<Language[]> {
		for (const lang of language) {
			const getLanguage = await db.Language.findOne({
				where: {
					name: lang.name,
					deleted_at: null,
				},
			})
			if (getLanguage) {
				throw new ValidationRequestError({
					[`language.${language.indexOf(lang)}.name`]: [
						`The language.${language.indexOf(lang)}.name has already been taken.`,
					],
				})
			}

			const getLanguageCode = await db.Language.findOne({
				where: {
					language_code: lang.language_code,
					deleted_at: null,
				},
			})
			if (getLanguageCode)
				throw new ValidationRequestError({
					[`language.${language.indexOf(lang)}.language_code`]: [
						`The language.${language.indexOf(lang)}.language_code has already been taken.`,
					],
				})
		}

		return await db.Language.bulkCreate(language)
	}

	static async updateLanguage(
		id: number,
		data: { name?: string; language_code?: string },
	): Promise<Language | null> {
		const getLanguage = await db.Language.findOne({
			where: {
				name: data.name,
				deleted_at: null,
			},
		})

		if (getLanguage && getLanguage?.get('id') !== id) {
			throw new ValidationRequestError({
				name: [`The name has already been taken.`],
			})
		}

		const getLanguageCode = await db.Language.findOne({
			where: {
				language_code: data.language_code,
				deleted_at: null,
			},
		})
		if (getLanguageCode && getLanguageCode?.get('id') !== id)
			throw new ValidationRequestError({
				language_code: [`The language code has already been taken.`],
			})
		const language = await db.Language.findByPk(id)
		if (!language) return null
		await language.update(data)
		return language
	}
}
