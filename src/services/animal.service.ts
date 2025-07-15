import db from '@/config/database'
import { Animal, AnimalType } from '@/models'
import { Op } from 'sequelize'
import type { AnimalQuestions } from '@/models/animal_questions.model'
import type { CommonQuestions } from '@/models/common_questions.model'
import type { Category } from '@/models/category.model'
import type { Subcategory } from '@/models/sub_category.model'
import type { ValidationRule } from '@/models/validation_rule.model'
import type { FormType } from '@/models/form_type.model'
import type { QuestionTag } from '@/models/question_tag.model'
import type { QuestionUnit } from '@/models/question_unit.model'
import type { QuestionLanguage } from '@/models/question_language.model'
import type { CategoryLanguage } from '@/models/category_language.model'
import type { SubCategoryLanguage } from '@/models/sub_category_language.model'

type AnimalInfoResult =
	| { [animalName: string]: number }
	| { male: number }
	| { female: number }
	| { heifer: number }

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

	static async animalInfo(
		user_id: number,
		animal_id: number,
	): Promise<{ message: string; data: AnimalInfoResult[] }> {
		const animal = await db.Animal.findOne({
			where: { id: animal_id },
			raw: true,
		})
		if (!animal) return { message: 'Animal not found', data: [] }

		const animalNumbers = await db.AnimalQuestionAnswer.findAll({
			where: { animal_id, user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			raw: true,
		})
		const resData: AnimalInfoResult[] = []
		resData.push({ [animal.name]: animalNumbers.length })

		const animalGenderNumbers = animalNumbers.map((a) => a.animal_number)

		const { gender, cow1 } = await AnimalService.getGenderBreakdown(
			animal_id,
			user_id,
			animalGenderNumbers,
		)
		const maleCount = gender['male'] ? gender['male'].length : 0
		const femaleCount = await AnimalService.getFemaleCount(
			animal_id,
			user_id,
			gender['female'] || [],
			cow1,
		)
		const heiferCount = await AnimalService.getHeiferCount(animal_id, user_id)

		resData.push({ male: maleCount })
		resData.push({ female: femaleCount })
		resData.push({ heifer: heiferCount })

		return { message: 'Success', data: resData }
	}

	static async addAnimalQuestion(data: {
		animal_id: number
		question_id: number[]
	}): Promise<{ message: string; data: [] }> {
		const t = await db.sequelize.transaction()
		try {
			const { animal_id, question_id } = data
			// Find existing mappings
			const existing = await db.AnimalQuestions.findAll({
				where: { animal_id, question_id },
				transaction: t,
			})
			const existingSet = new Set(existing.map((q) => q.question_id))
			const toInsert = question_id
				.filter((qid) => !existingSet.has(qid))
				.map((qid) => ({
					animal_id,
					question_id: qid,
					created_at: new Date(),
					updated_at: new Date(),
				}))
			if (toInsert.length > 0) {
				await db.AnimalQuestions.bulkCreate(toInsert, { transaction: t })
			}
			await t.commit()
			return { message: 'Success', data: [] }
		} catch (err) {
			await t.rollback()
			throw err
		}
	}

	static async deleteAnimalQuestion(
		id: number,
	): Promise<{ message: string; data: [] }> {
		const deleted = await db.AnimalQuestions.destroy({ where: { id } })
		if (deleted) {
			return { message: 'Success', data: [] }
		} else {
			return { message: 'Something went wrong. Please try again', data: [] }
		}
	}

	static async getQuestionsBasedOnAnimalId(
		animal_id: number,
		language_id?: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, unknown[]>>
	}> {
		type CQWithLang = CommonQuestions & {
			QuestionLanguages?: QuestionLanguage[]
			FormType?: FormType
			ValidationRule?: ValidationRule
			CategoryLanguage?: CategoryLanguage
			SubCategoryLanguage?: SubCategoryLanguage
			QuestionUnit?: QuestionUnit
			QuestionTag?: QuestionTag
			Category?: Category
			Subcategory?: Subcategory
		}
		type AQWithCQ = AnimalQuestions & { CommonQuestion?: CQWithLang }

		if (language_id) {
			const questions = (await db.AnimalQuestions.findAll({
				where: { animal_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						include: [
							{
								model: db.QuestionLanguage,
								as: 'QuestionLanguages',
								where: { language_id },
								required: true,
							},
							{
								model: db.FormType,
								as: 'FormType',
								attributes: ['id', 'name'],
								required: false,
							},
							{
								model: db.ValidationRule,
								as: 'ValidationRule',
								attributes: ['id', 'name', 'constant_value'],
							},
							{
								model: db.CategoryLanguage,
								as: 'CategoryLanguage',
								where: { language_id },
								required: false,
								attributes: ['category_language_name'],
							},
							{
								model: db.SubCategoryLanguage,
								as: 'SubCategoryLanguage',
								where: { language_id },
								required: false,
								attributes: ['sub_category_language_name'],
							},
							{
								model: db.QuestionUnit,
								as: 'QuestionUnit',
								attributes: ['id', 'name'],
								required: false,
							},
							{
								model: db.QuestionTag,
								as: 'QuestionTag',
								attributes: ['id', 'name'],
								required: false,
							},
						],
					},
				],
			})) as AQWithCQ[]
			const resData: Record<string, Record<string, unknown[]>> = {}
			for (const aq of questions) {
				const cq = aq.CommonQuestion
				if (!cq) continue
				const ql = cq.QuestionLanguages && cq.QuestionLanguages[0]
				const categoryName =
					cq.CategoryLanguage?.category_language_name || 'Uncategorized'
				const subCategoryName =
					cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
				if (!resData[categoryName]) resData[categoryName] = {}
				if (!resData[categoryName][subCategoryName])
					resData[categoryName][subCategoryName] = []
				resData[categoryName][subCategoryName].push({
					animal_id,
					validation_rule: cq.ValidationRule?.name ?? null,
					master_question: cq.question,
					language_question: ql?.question ?? null,
					question_id: cq.id,
					form_type: cq.FormType?.name ?? null,
					date: cq.date,
					form_type_value: cq.form_type_value,
					question_language_id: ql?.id ?? null,
					constant_value: cq.ValidationRule?.constant_value ?? null,
					question_unit: cq.QuestionUnit?.name ?? null,
					question_tag: cq.QuestionTag?.name ?? null,
					language_form_type_value: ql?.form_type_value ?? null,
					hint: ql?.hint ?? null,
				})
			}
			return { message: 'Success', data: resData }
		} else {
			const questions = (await db.AnimalQuestions.findAll({
				where: { animal_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						include: [
							{ model: db.Category, as: 'Category', attributes: ['name'] },
							{
								model: db.Subcategory,
								as: 'Subcategory',
								attributes: ['name'],
								required: false,
							},
							{
								model: db.FormType,
								as: 'FormType',
								attributes: ['id', 'name'],
								required: false,
							},
							{
								model: db.ValidationRule,
								as: 'ValidationRule',
								attributes: ['id', 'name', 'constant_value'],
							},
							{
								model: db.QuestionUnit,
								as: 'QuestionUnit',
								attributes: ['id', 'name'],
								required: false,
							},
							{
								model: db.QuestionTag,
								as: 'QuestionTag',
								attributes: ['id', 'name'],
								required: false,
							},
						],
					},
				],
			})) as AQWithCQ[]
			const resData: Record<string, Record<string, unknown[]>> = {}
			for (const aq of questions) {
				const cq = aq.CommonQuestion
				if (!cq) continue
				const categoryName = cq.Category?.name || 'Uncategorized'
				const subCategoryName = cq.Subcategory?.name || 'Uncategorized'
				if (!resData[categoryName]) resData[categoryName] = {}
				if (!resData[categoryName][subCategoryName])
					resData[categoryName][subCategoryName] = []
				resData[categoryName][subCategoryName].push({
					animal_id,
					validation_rule: cq.ValidationRule?.name ?? null,
					master_question: cq.question,
					question_id: cq.id,
					form_type: cq.FormType?.name ?? null,
					date: cq.date,
					form_type_value: cq.form_type_value,
					constant_value: cq.ValidationRule?.constant_value ?? null,
					question_unit: cq.QuestionUnit?.name ?? null,
					question_tag: cq.QuestionTag?.name ?? null,
					hint: cq.hint ?? null,
				})
			}
			return { message: 'Success', data: resData }
		}
	}

	private static async getGenderBreakdown(
		animal_id: number,
		user_id: number,
		animalNumbers: string[],
	): Promise<{ gender: Record<string, string[]>; cow1: number }> {
		const gender: Record<string, string[]> = {}
		let cow1 = 0
		for (const animal_number of animalNumbers) {
			const animalGenderLatest = await db.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number, user_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 8 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			const heifer3 = await db.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number, user_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 60 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			if (!animalGenderLatest?.answer && !heifer3?.answer) {
				cow1++
			} else if (
				!animalGenderLatest?.answer &&
				heifer3?.logic_value &&
				['cow', 'buffalo'].includes(heifer3.logic_value.toLowerCase())
			) {
				cow1++
			} else if (animalGenderLatest?.answer) {
				const ans = animalGenderLatest.answer.toLowerCase()
				if (!gender[ans]) gender[ans] = []
				gender[ans].push(animalGenderLatest.animal_number)
			}
		}
		return { gender, cow1 }
	}

	private static async getFemaleCount(
		animal_id: number,
		user_id: number,
		femaleNumbers: string[],
		cow1: number,
	): Promise<number> {
		let cow = 0
		for (const animal_number of femaleNumbers) {
			const heifer1 = await db.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number, user_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 60 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			const logicValue = heifer1?.logic_value?.toLowerCase?.() ?? ''
			if (!heifer1?.logic_value || ['cow', 'buffalo'].includes(logicValue)) {
				cow++
			}
		}
		return cow + cow1
	}

	private static async getHeiferCount(
		animal_id: number,
		user_id: number,
	): Promise<number> {
		const heiferNumbers = await db.AnimalQuestionAnswer.findAll({
			where: { animal_id, user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			raw: true,
		})
		const heiferData: Record<string, string[]> = {}
		let heifer2 = 0
		for (const value1 of heiferNumbers) {
			const animal_number = value1.animal_number
			const heiferVal = await db.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number, user_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 60 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			const animalGender1 = await db.AnimalQuestionAnswer.findOne({
				where: { animal_id, animal_number, user_id },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 8 },
						required: false,
					},
				],
				order: [['created_at', 'DESC']],
				raw: true,
			})
			if (animalGender1?.answer?.toLowerCase() === 'female') {
				const key = heiferVal?.logic_value?.toLowerCase() || ''
				if (!heiferData[key]) heiferData[key] = []
				heiferData[key].push(animal_number)
			} else if (
				!animalGender1?.answer &&
				heiferVal?.logic_value?.toLowerCase() === 'calf'
			) {
				heifer2++
			}
		}
		const heiferCount = heiferData['calf'] ? heiferData['calf'].length : 0
		return heiferCount + heifer2
	}
}
