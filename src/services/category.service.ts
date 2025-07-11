import db from '@/config/database'
import { Category } from '@/models/category.model'

export class CategoryService {
	static async createCategory(data: { name: string }): Promise<Category> {
		return await db.Category.create(data)
	}

	static async getCategoryByName(name: string): Promise<Category | null> {
		return await db.Category.findOne({ where: { name } })
	}

	static async getById(id: number): Promise<Category | null> {
		return await db.Category.findByPk(id)
	}

	static async getAll(): Promise<Category[]> {
		return await db.Category.findAll()
	}

	static async updateCategory(
		id: number,
		data: { name: string },
	): Promise<Category | null> {
		const category = await db.Category.findByPk(id)
		if (!category) return null
		await category.update(data)
		return category
	}

	static async deleteById(id: number): Promise<boolean> {
		const deleted = await db.Category.destroy({ where: { id } })
		return Boolean(deleted)
	}
}
