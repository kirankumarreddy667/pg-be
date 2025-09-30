import db from '@/config/database'
import { Category } from '@/models/category.model'

export class CategoryService {
	static async createCategory(data: {
		name: string
		sequence_number: number
	}): Promise<Category> {
		return await db.Category.create(data)
	}

	static async getCategoryByName(name: string): Promise<Category | null> {
		return await db.Category.findOne({ where: { name, deleted_at: null } })
	}

	static async getById(id: number): Promise<Category | null> {
		const category = await db.Category.findOne({
			where: { id, deleted_at: null },
		})
		if (!category || category.deleted_at) return null
		return category
	}

	static async getAll(): Promise<Category[]> {
		return await db.Category.findAll({ where: { deleted_at: null } })
	}

	static async updateCategory(
		id: number,
		data: { name: string },
	): Promise<Category | null> {
		const category = await db.Category.findOne({
			where: { id, deleted_at: null },
		})
		if (!category) return null
		await category.update(data)
		return category
	}

	static async deleteById(id: number): Promise<boolean> {
		const deleted = await db.Category.destroy({ where: { id } })
		return Boolean(deleted)
	}
}
