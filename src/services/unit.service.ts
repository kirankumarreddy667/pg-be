import db from '@/config/database'
import { Unit } from '@/models/unit.model'
import { ValidationRequestError } from '@/utils/errors'

interface UnitInput {
	name: string
	display_name: string
}

export class UnitService {
	static async getAllUnits(): Promise<Unit[]> {
		return await db.Unit.findAll({ where: { deleted_at: null } })
	}

	static async getUnitById(id: number): Promise<Unit | null> {
		return await db.Unit.findOne({ where: { id, deleted_at: null } })
	}

	static async createUnit(data: UnitInput): Promise<Unit> {
		const unit = await db.Unit.findOne({
			where: {
				name: data.name,
				deleted_at: null,
			},
		})
		if (unit) {
			throw new ValidationRequestError({
				name: ['The name has already been taken.'],
			})
		}
		return await db.Unit.create(data)
	}

	static async updateUnit(
		id: number,
		data: Partial<UnitInput>,
	): Promise<Unit | null> {
		const getUnit = await db.Unit.findOne({
			where: { name: data.name, deleted_at: null },
		})
		if (getUnit && getUnit.get('id') !== id)
			throw new ValidationRequestError({
				name: ['The name has already been taken.'],
			})

		const unit = await db.Unit.findByPk(id)
		if (!unit) return null
		await unit.update(data)
		return unit
	}

	static async deleteUnit(id: number): Promise<boolean> {
		const deleted = await db.Unit.destroy({ where: { id } })
		return deleted > 0
	}
}
