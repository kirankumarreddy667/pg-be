import db from '@/config/database'
import { Animal, AnimalType } from '@/models'

export class AnimalService {
	static async create(data: {
		name: string
		language_id: number
	}): Promise<Animal> {
		const animal = await db.Animal.create({
			name: data.name,
			language_id: data.language_id,
		})
		return animal
	}

	static async update(
		id: number,
		data: { name?: string; language_id?: number | null },
	): Promise<Animal> {
		const animal = await db.Animal.findByPk(id)
		if (!animal) throw new Error('Animal not found')
		if (data.name !== undefined) animal.name = data.name
		if ('language_id' in data) animal.language_id = data.language_id ?? null
		await animal.save()
		return animal
	}

	static async delete(id: number): Promise<boolean> {
		const deleted = await db.Animal.destroy({ where: { id } })
		return !!deleted
	}

	static async findById(id: number): Promise<Animal | null> {
		return db.Animal.findByPk(id)
	}
	static async addTypeOfAnAnimal(data: {
		animal_id: number
		type_id: number
	}): Promise<{ message: string }> {
		const exists = await db.AnimalType.findOne({
			where: { animal_id: data.animal_id, type_id: data.type_id },
		})

		if (exists) {
			throw new Error('Animal type already exists')
		}
		await db.AnimalType.create(data)
		return { message: 'Animal type added successfully' }
	}

	static async getTypesOfAnAnimal(
		id: number,
	): Promise<{ message: string; data: Record<string, unknown[]> }> {
		const animalTypes = await db.AnimalType.findAll({
			where: { animal_id: id },
			include: [
				{ model: db.Animal, as: 'Animal', attributes: ['id', 'name'] },
				{ model: db.Type, as: 'Type', attributes: ['id', 'type'] },
			],
			attributes: ['id', 'animal_id', 'type_id'],
			raw: true,
		})

		const resData: Record<string, unknown[]> = {}
		animalTypes.forEach(
			(row: {
				id: number
				animal_id: number
				type_id: number
				'Animal.id'?: number
				'Animal.name'?: string
				'Type.id'?: number
				'Type.type'?: string
			}) => {
				const animalName = row['Animal.name']
				if (!animalName) return
				if (!resData[animalName]) resData[animalName] = []
				resData[animalName].push({
					animal_type_id: row.id,
					animal_id: row.animal_id,
					type_id: row.type_id,
					animal_name: animalName,
					animal_type: row['Type.type'],
				})
			},
		)
		return { message: 'Success', data: resData }
	}

	static async getAllAnimalsWithTheirTypes(): Promise<{
		message: string
		data: Record<string, unknown[]>
	}> {
		const animalData = await db.AnimalType.findAll({
			include: [
				{ model: db.Animal, as: 'Animal', attributes: ['id', 'name'] },
				{ model: db.Type, as: 'Type', attributes: ['id', 'type'] },
			],
			attributes: ['id', 'animal_id', 'type_id'],
			raw: true,
		})

		const resData: Record<string, unknown[]> = {}
		animalData.forEach(
			(row: {
				id: number
				animal_id: number
				type_id: number
				'Animal.id'?: number
				'Animal.name'?: string
				'Type.id'?: number
				'Type.type'?: string
			}) => {
				const animalName = row['Animal.name']
				if (!animalName) return
				if (!resData[animalName]) resData[animalName] = []
				resData[animalName].push({
					animal_type_id: row.id,
					animal_id: row.animal_id,
					type_id: row.type_id,
					animal_name: animalName,
					animal_type: row['Type.type'],
				})
			},
		)

		return { message: 'Success', data: resData }
	}

	static async deleteAnimalType(
		id: number,
	): Promise<{ message: string; success: boolean }> {
		const deleted = await db.AnimalType.destroy({ where: { id } })
		if (deleted) {
			return { message: 'Deleted successfully', success: true }
		} else {
			return {
				message: 'Something went wrong. Please try again.',
				success: false,
			}
		}
	}

	static async findAnimalTypeById(id: number): Promise<AnimalType | null> {
		return db.AnimalType.findByPk(id)
	}
}
