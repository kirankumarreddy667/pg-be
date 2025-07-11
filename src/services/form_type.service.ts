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
		return await db.FormType.findOne({ where: { name } })
	}

	static async getById(id: number): Promise<FormType | null> {
		return await db.FormType.findByPk(id)
	}

	static async updateFormType(
		id: number,
		data: { name?: string; description?: string | null },
	): Promise<FormType | null> {
		const formType = await db.FormType.findByPk(id)
		if (!formType) return null
		await formType.update(data)
		return formType
	}

	static async getAll(): Promise<FormType[]> {
		return await db.FormType.findAll()
	}

	static async deleteById(id: number): Promise<boolean> {
		const deleted = await db.FormType.destroy({ where: { id } })
		return Boolean(deleted)
	}
}
