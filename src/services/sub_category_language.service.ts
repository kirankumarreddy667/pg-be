import db from '@/config/database'
import { SubCategoryLanguage } from '@/models/sub_category_language.model'

export class SubCategoryLanguageService {
	static async add(data: {
		sub_category_id: number
		language_id: number
		sub_category_language_name: string
	}): Promise<SubCategoryLanguage> {
		return await db.SubCategoryLanguage.create(data)
	}

	static async getBySubCategoryAndLanguage(
		sub_category_id: number,
		language_id: number,
	): Promise<SubCategoryLanguage | null> {
		return await db.SubCategoryLanguage.findOne({
			where: { sub_category_id, language_id },
		})
	}

	static async subCategoryExists(sub_category_id: number): Promise<boolean> {
		return Boolean(await db.Subcategory.findByPk(sub_category_id))
	}

	static async languageExists(language_id: number): Promise<boolean> {
		return Boolean(await db.Language.findByPk(language_id))
	}

	static async getAllByLanguage(
		language_id: number,
	): Promise<SubCategoryLanguage[]> {
		return await db.SubCategoryLanguage.findAll({ where: { language_id } })
	}

	static async update(
		id: number,
		data: { sub_category_language_name: string; language_id: number },
	): Promise<SubCategoryLanguage | null> {
		const record = await db.SubCategoryLanguage.findByPk(id)
		if (!record) return null
		await record.update(data)
		return record
	}

	static async getByNameAndLanguage(
		sub_category_language_name: string,
		language_id: number,
	): Promise<SubCategoryLanguage | null> {
		return await db.SubCategoryLanguage.findOne({
			where: { sub_category_language_name, language_id },
		})
	}
}
