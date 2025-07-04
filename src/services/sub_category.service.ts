import db from '@/config/database'
import { Subcategory } from '@/models/sub_category.model'

export class SubcategoryService {
  static async create(data: { name: string }): Promise<Subcategory> {
    return await db.Subcategory.create(data)
  }

  static async getByName(name: string): Promise<Subcategory | null> {
    return await db.Subcategory.findOne({ where: { name } })
  }

  static async getById(id: number): Promise<Subcategory | null> {
    return await db.Subcategory.findByPk(id)
  }

  static async getAll(): Promise<Subcategory[]> {
    return await db.Subcategory.findAll()
  }

  static async update(id: number, data: { name: string }): Promise<Subcategory | null> {
    const subcategory = await db.Subcategory.findByPk(id)
    if (!subcategory) return null
    await subcategory.update(data)
    return subcategory
  }

  static async deleteById(id: number): Promise<boolean> {
    const deleted = await db.Subcategory.destroy({ where: { id } })
    return !!deleted
  }
} 