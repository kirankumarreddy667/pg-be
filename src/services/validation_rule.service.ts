import db from '@/config/database'
import { ValidationRule } from '@/models/validation_rule.model'

export class ValidationRuleService {
	static async create(data: {
		name: string
		description?: string | null
		constant_value: number
	}): Promise<ValidationRule> {
		return await db.ValidationRule.create(data)
	}

	static async getValidationRuleByName(
		name: string,
	): Promise<ValidationRule | null> {
		return await db.ValidationRule.findOne({
			where: { name, deleted_at: null },
		})
	}

	static async update(
		id: number,
		data: { name: string; description?: string | null; constant_value: number },
	): Promise<ValidationRule | null> {
		const rule = await db.ValidationRule.findOne({
			where: { id, deleted_at: null },
		})
		if (!rule) return null
		await db.ValidationRule.update(data, { where: { id } })
		return rule
	}

	static async getAll(): Promise<ValidationRule[]> {
		return await db.ValidationRule.findAll({ where: { deleted_at: null } })
	}

	static async getById(id: number): Promise<ValidationRule | null> {
		return await db.ValidationRule.findOne({ where: { id, deleted_at: null } })
	}

	static async deleteById(id: number): Promise<boolean> {
		const rule = await db.ValidationRule.findOne({
			where: { id, deleted_at: null },
		})
		if (!rule) return false
		await db.ValidationRule.destroy({ where: { id } })
		return true
	}
}
