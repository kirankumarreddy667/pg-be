import db from '@/config/database'
import { SubCategoryLanguage } from '@/models/sub_category_language.model'

interface SubCategoryLanguageResponse {
	sub_category_id: number
	sub_category_name: string | null
	sub_category_language_name: string
}

type SubCategoryLanguageRecord = {
	id: number
	sub_category_id: number
	sub_category_language_name: string
	subcategory: {
		id: number
		name: string
	} | null
}
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
	): Promise<SubCategoryLanguageResponse | null> {
		const record = (await db.SubCategoryLanguage.findOne({
			where: { sub_category_id, language_id, deleted_at: null },
			attributes: ['sub_category_id', 'sub_category_language_name'],
			include: [
				{
					model: db.Subcategory,
					as: 'subcategory',
					attributes: ['name'],
					where: { deleted_at: null },
				},
			],
			raw: true,
			nest: true,
		})) as unknown as {
			sub_category_id: number
			sub_category_language_name: string
			subcategory?: { name: string }
		} | null

		if (!record) return null

		return {
			sub_category_id: record.sub_category_id,
			sub_category_name: record.subcategory?.name || null,
			sub_category_language_name: record.sub_category_language_name,
		}
	}

	static async subCategoryExists(sub_category_id: number): Promise<boolean> {
		return Boolean(
			await db.Subcategory.findOne({
				where: { id: sub_category_id, deleted_at: null },
			}),
		)
	}

	static async languageExists(language_id: number): Promise<boolean> {
		return Boolean(
			await db.Language.findOne({
				where: { id: language_id, deleted_at: null },
			}),
		)
	}

	static async getAllByLanguage(
		language_id: number,
	): Promise<SubCategoryLanguageResponse[]> {
		const records = (await db.SubCategoryLanguage.findAll({
			where: { language_id, deleted_at: null },
			attributes: ['id', 'sub_category_id', 'sub_category_language_name'],
			include: [
				{
					model: db.Subcategory,
					as: 'subcategory',
					attributes: ['id', 'name'],
					where: { deleted_at: null },
				},
			],
			raw: true, // <-- this makes the result plain JSON
			nest: true, // <-- ensures nested includes are structured
		})) as unknown as SubCategoryLanguageRecord[]

		return records.map((record) => ({
			sub_category_id: record.sub_category_id,
			sub_category_name: record.subcategory?.name || null,
			sub_category_language_name: record.sub_category_language_name,
			sub_category_language_id: record.id,
		}))
	}

	static async update(
		id: number,
		data: { sub_category_language_name: string; language_id: number },
	): Promise<SubCategoryLanguage | null> {
		const record = await db.SubCategoryLanguage.findOne({
			where: { id, deleted_at: null },
		})
		if (!record) return null
		await record.update(data)
		return record
	}

	static async getByNameAndLanguage(
		sub_category_language_name: string,
		language_id: number,
	): Promise<SubCategoryLanguage | null> {
		return await db.SubCategoryLanguage.findOne({
			where: { sub_category_language_name, language_id, deleted_at: null },
		})
	}
}
