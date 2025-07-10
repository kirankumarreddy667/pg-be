import db from '@/config/database'
import { Type } from '@/models/type.model'

export class TypeService {
	static async create(data: { type: string }): Promise<{ message: string }> {
		await db.Type.create({ type: data.type })
		return {
			message: 'Type added successfully',
		}
	}

	static async update(
		id: number,
		data: { type: string },
	): Promise<{ message: string }> {
		const type = await db.Type.findByPk(id)
		if (!type) throw new Error('Type not found')
		type.type = data.type
		await type.save()
		return { message: 'Type details updated successfully' }
	}

	static async findById(id: number): Promise<Type | null> {
		return db.Type.findByPk(id)
	}

	static async listAll(): Promise<Type[]> {
		return db.Type.findAll()
	}

	static async delete(id: number): Promise<{ message: string }> {
		const deleted = await db.Type.destroy({ where: { id } })
		if (!deleted) throw new Error('Type not found')
		return { message: 'Type deleted successfully' }
	}
}
