import db from '@/config/database'
import { CategoryLanguage } from '@/models/category_language.model'

export class CategoryLanguageService {
	static async addCategoryInOtherLanguage(data: {
		category_id: number
		language_id: number
		category_language_name: string
	}): Promise<CategoryLanguage> {
		return await db.CategoryLanguage.create(data)
	}

	static async getByCategoryAndLanguage(
		category_id: number,
		language_id: number,
	): Promise<CategoryLanguage | null> {
		return await db.CategoryLanguage.findOne({
			where: { category_id, language_id },
		})
	}

	static async categoryExists(category_id: number): Promise<boolean> {
		return !!(await db.Category.findByPk(category_id))
	}

	static async languageExists(language_id: number): Promise<boolean> {
		return !!(await db.Language.findByPk(language_id))
	}

	static async getAll(): Promise<CategoryLanguage[]> {
		return await db.CategoryLanguage.findAll()
	}

	static async getById(id: number): Promise<CategoryLanguage | null> {
		return await db.CategoryLanguage.findByPk(id)
	}

	static async update(
		id: number,
		data: { category_language_name: string; language_id: number },
	): Promise<CategoryLanguage | null> {
		const record = await db.CategoryLanguage.findByPk(id)
		if (!record) return null
		await record.update(data)
		return record
	}

	static async getByNameAndLanguage(
		category_language_name: string,
		language_id: number,
	): Promise<CategoryLanguage | null> {
		return await db.CategoryLanguage.findOne({
			where: { category_language_name, language_id },
		})
	}

	static async getAllByLanguage(
		language_id: number,
	): Promise<CategoryLanguage[]> {
		return await db.CategoryLanguage.findAll({ where: { language_id } })
	}
}
