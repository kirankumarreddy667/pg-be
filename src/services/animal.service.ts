import db from '@/config/database'
import { Animal, AnimalType } from '@/models'
import { Op } from 'sequelize'

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

	static async getAllAnimals(language_id: number): Promise<{
		message: string
		data: { id: number; name: string; language_id: number }[]
	}> {
		const animals = await db.AnimalLanguage.findAll({
			where: { language_id },
			attributes: ['animal_id', 'name', 'language_id'],
			raw: true,
		})

		const resData = animals.map((value) => ({
			id: value.animal_id,
			name: value.name,
			language_id: value.language_id,
		}))

		return { message: 'Success', data: resData }
	}

	static async getAnimalNumberByAnimalId(
		animal_id: number,
		user_id: number,
	): Promise<{ message: string; data: string[] }> {
		type AnimalNumberResult = { animal_number: string }
		const animalNumbers = (await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_id,
				user_id,
				status: false,
			},
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			raw: true,
		})) as AnimalNumberResult[]
		const numbers = animalNumbers.map((a) => a.animal_number)
		return { message: 'Success', data: numbers }
	}

	static async deleteUserAnimal(
		user_id: number,
		animal_id: number,
		animal_number: string,
		answers: { question_id: number; answer: string }[],
	): Promise<boolean> {
		const deleted = await db.AnimalQuestionAnswer.destroy({
			where: {
				user_id,
				animal_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
		})
		if (deleted) {
			const animalData = answers.map((value) => ({
				user_id,
				animal_id,
				animal_number,
				question_id: value.question_id,
				answer: value.answer,
				created_at: new Date(),
				updated_at: new Date(),
			}))
			await db.DeletedAnimalDetails.bulkCreate(animalData)
			return true
		}
		return false
	}

	static async updateAnimalNumberAnswer(user_id: number): Promise<boolean> {
		// Get all answers for question_id=6 for this user
		const answers = await db.AnimalQuestionAnswer.findAll({
			where: { question_id: 6, user_id },
			attributes: ['answer', 'animal_number', 'question_id'],
			order: [['created_at', 'DESC']],
			raw: true,
		})
		for (const answer of answers) {
			if (answer.animal_number !== answer.answer) {
				await db.AnimalQuestionAnswer.update(
					{ answer: answer.animal_number },
					{
						where: {
							question_id: 6,
							user_id,
							animal_number: answer.animal_number,
						},
					},
				)
			}
		}
		return true
	}

	static async farmAnimalCount(
		user_id: number,
	): Promise<{ animal_id: number; animal_name: string; count: number }[]> {
		// Get all animals
		const animals = await db.Animal.findAll({
			attributes: ['id', 'name'],
			raw: true,
		})
		const result: { animal_id: number; animal_name: string; count: number }[] =
			[]
		for (const animal of animals) {
			// Count distinct animal_number for this animal and user, status != 1
			const count = await db.AnimalQuestionAnswer.count({
				where: {
					animal_id: animal.id,
					user_id,
					status: { [Op.ne]: 1 },
				},
				distinct: true,
				col: 'animal_number',
			})
			result.push({ animal_id: animal.id, animal_name: animal.name, count })
		}
		return result
	}

	static async animalInfo(user_id: number, animal_id: number) {
		const dbModels = db
		// Get animal name
		const animal = await dbModels.Animal.findOne({
			where: { id: animal_id },
			raw: true,
		})
		if (!animal) return { message: 'Animal not found', data: [] }

		// Count distinct animal_number for this animal and user, status != 1
		const animalNumbers = await dbModels.AnimalQuestionAnswer.findAll({
			where: { animal_id, user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					dbModels.Sequelize.fn(
						'DISTINCT',
						dbModels.Sequelize.col('animal_number'),
					),
					'animal_number',
				],
			],
			raw: true,
		})
		const resData: any[] = []
		resData.push({ [animal.name]: animalNumbers.length })

		// Get all animal_numbers for this animal/user/status != 1 (for gender breakdown)
		const animalGenderNumbers = await dbModels.AnimalQuestionAnswer.findAll({
			where: { animal_id, user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					dbModels.Sequelize.fn(
						'DISTINCT',
						dbModels.Sequelize.col('animal_number'),
					),
					'animal_number',
				],
			],
			raw: true,
		})

		let gender: Record<string, string[]> = {}
		let cow1 = 0
		for (const value of animalGenderNumbers) {
			// Get latest gender answer for this animal_number
			const animalGenderLatest = await dbModels.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number: value.animal_number, user_id },
				include: [
					{
						model: dbModels.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 8 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			// Get latest heifer answer for this animal_number
			const heifer3 = await dbModels.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number: value.animal_number, user_id },
				include: [
					{
						model: dbModels.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 60 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			if (
				(!animalGenderLatest || !animalGenderLatest.answer) &&
				(!heifer3 || !heifer3.answer)
			) {
				cow1++
			} else if (
				(!animalGenderLatest || !animalGenderLatest.answer) &&
				heifer3 &&
				heifer3.logic_value &&
				['cow', 'buffalo'].includes(heifer3.logic_value.toLowerCase())
			) {
				cow1++
			} else if (animalGenderLatest && animalGenderLatest.answer) {
				const ans = animalGenderLatest.answer.toLowerCase()
				if (!gender[ans]) gender[ans] = []
				gender[ans].push(animalGenderLatest.animal_number)
			}
		}

		// Male count
		const maleCount = gender['male'] ? gender['male'].length : 0
		// Female count (with cow1 logic)
		let femaleCount = 0
		if (gender['female']) {
			let cow = 0
			for (const value1 of gender['female']) {
				const heifer1 = await dbModels.AnimalQuestionAnswer.findOne({
					where: { animal_id, animal_number: value1, user_id },
					include: [
						{
							model: dbModels.CommonQuestions,
							as: 'CommonQuestion',
							where: { question_tag: 60 },
							required: false,
						},
					],
					order: [['created_at', 'DESC']],
					raw: true,
				})
				if (
					heifer1 &&
					heifer1.logic_value &&
					['cow', 'buffalo'].includes(heifer1.logic_value.toLowerCase())
				) {
					cow++
				} else if (!heifer1 || !heifer1.logic_value) {
					cow++
				}
			}
			femaleCount = cow + cow1
		} else {
			femaleCount = cow1
		}

		// Heifer count
		const heiferNumbers = await dbModels.AnimalQuestionAnswer.findAll({
			where: { animal_id, user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					dbModels.Sequelize.fn(
						'DISTINCT',
						dbModels.Sequelize.col('animal_number'),
					),
					'animal_number',
				],
			],
			raw: true,
		})
		let heiferData: Record<string, string[]> = {}
		let heifer2 = 0
		for (const value1 of heiferNumbers) {
			const heiferVal = await dbModels.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number: value1.animal_number, user_id },
				include: [
					{
						model: dbModels.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 60 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			const animalGender1 = await dbModels.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number: value1.animal_number, user_id },
				include: [
					{
						model: dbModels.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 8 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			if (
				animalGender1 &&
				animalGender1.answer &&
				animalGender1.answer.toLowerCase() === 'female'
			) {
				if (!heiferData[heiferVal?.logic_value?.toLowerCase() || ''])
					heiferData[heiferVal?.logic_value?.toLowerCase() || ''] = []
				heiferData[heiferVal?.logic_value?.toLowerCase() || ''].push(
					value1.animal_number,
				)
			} else {
				if (
					(!animalGender1 || !animalGender1.answer) &&
					heiferVal &&
					heiferVal.logic_value &&
					heiferVal.logic_value.toLowerCase() === 'calf'
				) {
					heifer2++
				}
			}
		}
		const heiferCount = heiferData['calf'] ? heiferData['calf'].length : 0
		const Heifer = { heifer: heiferCount + heifer2 }

		resData.push({ male: maleCount })
		resData.push({ female: femaleCount })
		resData.push(Heifer)
		return { message: 'Success', data: resData }
	}
}
