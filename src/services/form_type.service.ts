import db from '@/config/database'
import { FormType } from '@/models/form_type.model'

export class FormTypeService {
	static async createFormType(data: {
		name: string
		description?: string | null
	}): Promise<FormType> {
		return await db.FormType.create(data)
	}

	static async getFormTypeByName(name: string): Promise<FormType | null> {
		return await db.FormType.findOne({ where: { name, deleted_at: null } })
	}

	static async getById(id: number): Promise<FormType | null> {
		return await db.FormType.findOne({ where: { id, deleted_at: null } })
	}

	static async updateFormType(
		id: number,
		data: { name: string; description: string },
	): Promise<FormType | null> {
		const formType = await db.FormType.findOne({
			where: { id, deleted_at: null },
		})
		if (!formType) return null
		await db.FormType.update(data, { where: { id } })
		return formType
	}

	static async getAll(): Promise<FormType[]> {
		return await db.FormType.findAll({ where: { deleted_at: null } })
	}

	static async deleteById(id: number): Promise<boolean> {
		const deleted = await db.FormType.destroy({ where: { id } })
		return Boolean(deleted)
	}
}
