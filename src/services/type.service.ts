import db from '@/config/database'
import { Type } from '@/models/type.model'
import { ValidationRequestError } from '@/utils/errors'

export class TypeService {
	static async create(data: { type: string }): Promise<{ message: string }> {
		const exists = await db.Type.findOne({
			where: { type: data.type, deleted_at: null },
		})

		if (exists)
			throw new ValidationRequestError({
				type: ['The type has already been taken.'],
			})
		await db.Type.create({ type: data.type })
		return {
			message: 'Animal type added successfully',
		}
	}

	static async update(
		id: number,
		data: { type: string },
	): Promise<{ message: string }> {
		const type = await db.Type.findOne({
			where: { type: data.type, deleted_at: null },
		})
		if (type)
			throw new ValidationRequestError({
				type: ['The type has already been taken.'],
			})

		await db.Type.update(data, { where: { id } })
		return { message: 'Animal details updated successfull' }
	}

	static async findById(id: number): Promise<Type | null> {
		return db.Type.findOne({ where: { id, deleted_at: null } })
	}

	static async listAll(): Promise<Type[]> {
		return db.Type.findAll({ where: { deleted_at: null } })
	}

	static async delete(id: number): Promise<boolean> {
		const deleted = await db.Type.destroy({ where: { id } })
		if (!deleted) return false
		return true
	}
}
