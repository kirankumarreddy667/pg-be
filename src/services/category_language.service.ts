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
	): Promise<{
		category_id: number
		category_language_name: string
		category_name: string
	} | null> {
		const record = await db.CategoryLanguage.findOne({
			where: { category_id, language_id, deleted_at: null },
			include: [
				{
					model: db.Category,
					as: 'category',
					where: { deleted_at: null },
					attributes: ['name'],
				},
			],
		})

		if (!record) return null

		const plain = record.get({ plain: true }) as CategoryLanguage & {
			category?: { name?: string }
		}

		return {
			category_id: plain.category_id,
			category_language_name: plain.category_language_name,
			category_name: plain.category?.name || plain.category_language_name, // fallback
		}
	}

	static async categoryExists(category_id: number): Promise<boolean> {
		return !!(await db.Category.findOne({
			where: { id: category_id, deleted_at: null },
		}))
	}

	static async languageExists(language_id: number): Promise<boolean> {
		return !!(await db.Language.findOne({
			where: { id: language_id, deleted_at: null },
		}))
	}

	static async getAll(): Promise<CategoryLanguage[]> {
		return await db.CategoryLanguage.findAll({
			where: { deleted_at: null },
		})
	}

	static async getById(id: number): Promise<CategoryLanguage | null> {
		return await db.CategoryLanguage.findOne({
			where: { id, deleted_at: null },
		})
	}

	static async update(
		id: number,
		data: { category_language_name: string; language_id: number },
	): Promise<CategoryLanguage | null> {
		const record = await db.CategoryLanguage.findOne({
			where: { id, deleted_at: null },
		})
		if (!record) return null
		await record.update(data)
		return record
	}

	static async getByNameAndLanguage(
		category_language_name: string,
		language_id: number,
	): Promise<CategoryLanguage | null> {
		return await db.CategoryLanguage.findOne({
			where: { category_language_name, language_id, deleted_at: null },
		})
	}

	static async getAllByLanguage(language_id: number): Promise<
		{
			category_id: number
			category_language_name: string
			category_name: string
			category_language_id: number
		}[]
	> {
		const records = await db.CategoryLanguage.findAll({
			where: { language_id, deleted_at: null },
			include: [
				{
					model: db.Category,
					as: 'category',
					where: { deleted_at: null },
					attributes: ['name'],
				},
			],
		})

		return records.map((rec) => {
			const plain = rec.get({ plain: true }) as CategoryLanguage & {
				category?: { name?: string }
			}
			return {
				category_id: plain.category_id,
				category_language_name: plain.category_language_name,
				category_name: plain.category?.name || plain.category_language_name,
				category_language_id: plain.id ?? 0,
			}
		})
	}
}
