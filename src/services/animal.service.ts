import db from '@/config/database'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Animal, AnimalType } from '@/models'
import { Op, QueryTypes, Transaction } from 'sequelize'
import { AnimalImage } from '@/models/animal_image.model'
import type { User } from '@/types/index'
import type { Express } from 'express'
import { ValidationError, ValidationRequestError } from '@/utils/errors'

interface AnimalTypeRawResult {
	'Animal.name'?: string
}

type AnimalInfoResult =
	| { [animalName: string]: number }
	| { male: number }
	| { female: number }
	| { heifer: number }

type AnimalTypeRaw = {
	id: number
	animal_id: number
	type_id: number
	'Animal.id': number
	'Animal.name': string
	'Type.id': number
	'Type.type': string
}

interface AnimalDetailsRequest {
	animal_id: number
	type: string
	user_id: number
}

interface AnimalData {
	animal_number: string
	date_of_birth: string | null
	weight: string | null
	lactating_status: string | null
	pregnant_status: string | null
}

interface AnimalDetailsResponse {
	animal_name?: string
	pregnant_animal?: number
	non_pregnant_animal?: number
	lactating?: number
	nonLactating?: number
	animal_data: AnimalData[]
}

interface GenderCount {
	male: number
	female: number
	heifer: number
}

export interface AnimalAnswerRecord {
	answer?: string
	logic_value?: string
	animal_number: string
	animal_id?: number
	created_at?: Date | string
	[key: string]: unknown
}

export interface AnimalBreedingHistory {
	id: number
	user_id: number
	animal_id: number
	delivery_date: string
	mother_animal_number: string
	calf_animal_number: string
	created_at: string
	updated_at: string
}

interface AIHistoryItem {
	dateOfAI?: string
	bullNumber?: string
	motherYield?: string
	semenCompanyName?: string
}

interface DeliveryHistoryItem {
	dateOfDelivery?: string
	typeOfDelivery?: string
	calfNumber?: string | null
}

interface HeatHistoryItem {
	heatDate: string
}

interface BreedingHistoryResponse {
	aiHistory: AIHistoryItem[]
	deliveryHistory: DeliveryHistoryItem[]
	heatHistory: HeatHistoryItem[]
}

interface AnswerRaw {
	answer?: string
}

type date = string | Date | null
interface LactationHistoryRow {
	lactating_status?: string | null
	date?: date
}

interface LanguageQueryResult {
	animal_id: number
	question_id: number
	master_question: string
	date: string
	form_type_value: string
	default_hint: string
	question_unit: number
	question_tag: number
	question_language_id: number
	language_question: string
	language_form_type_value: string
	hint: string
	validation_rule: string
	constant_value: string
	form_type: string
	category_name: string
	sub_category_name: string
	question_unit_name: string
	question_tag_name: string
}

interface DefaultQueryResult {
	question_id: number
	animal_id: number
	master_question: string
	date: string
	form_type_value: string
	hint: string
	question_unit: number
	question_tag: number
	validation_rule: string
	constant_value: string
	form_type: string
	category_name: string
	sub_category_name: string
	question_unit_name: string
	question_tag_name: string
}

interface AnimalDataRow {
	animal_number: string
	gender_answer: string | null
	heifer_answer: string | null
	heifer_logic_value: string | null
}

interface LanguageQuestionData {
	animal_id: number
	validation_rule: string
	master_question: string
	language_question: string
	question_id: number
	form_type: string
	date: string
	form_type_value: string
	question_language_id: number
	constant_value: string
	question_unit: string
	question_tag: string
	language_form_type_value: string
	hint: string
}

interface DefaultQuestionData {
	animal_id: number
	validation_rule: string
	master_question: string
	question_id: number
	form_type: string
	date: string
	form_type_value: string
	constant_value: string
	question_unit?: string
	question_tag?: string
	hint: string
}

interface QuestionAnswer {
	answer?: string
	logic_value?: string
	animal_id?: number
	question_id?: number
	question?: string
	animal_number?: string
	answer_date?: Date
	question_tag?: number
}

export class AnimalService {
	static async create(
		data: {
			name: string
			language_id: number
		},
		transaction: Transaction,
	): Promise<void> {
		const exists = await db.Animal.findOne({
			where: { name: data.name, deleted_at: null },
		})

		if (exists)
			throw new ValidationRequestError({
				name: ['The name has already been taken.'],
			})

		const language = await db.Language.findOne({
			where: { id: data.language_id, deleted_at: null },
		})
		if (!language)
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid'],
			})

		await db.Animal.create(
			{ name: data.name, language_id: data.language_id },
			{ transaction },
		)
		// await db.AnimalLanguage.create(
		// 	{
		// 		language_id: data.language_id,
		// 		name: data.name,
		// 		animal_id: animal.id,
		// 	},
		// 	{ transaction },
		// )
	}

	static async update(
		id: number,
		data: { name: string; language_id: number },
	): Promise<void> {
		const exists = await db.Animal.findOne({
			where: { name: data.name, deleted_at: null },
		})

		if (exists && exists.get('id') !== id)
			throw new ValidationRequestError({
				name: ['The name has already been taken.'],
			})

		const language = await db.Language.findOne({
			where: { id: data.language_id, deleted_at: null },
		})
		if (!language)
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid'],
			})

		await db.Animal.update(data, { where: { id, deleted_at: null } })
		// await db.AnimalLanguage.update(data, {
		// 	where: { animal_id: id },
		// })
	}

	static async delete(id: number, transaction: Transaction): Promise<boolean> {
		await db.Animal.destroy({ where: { id }, transaction })
		await db.AnimalLanguage.destroy({ where: { animal_id: id }, transaction })
		return true
	}

	static async findById(id: number): Promise<Animal | null> {
		return db.Animal.findOne({ where: { id, deleted_at: null } })
	}

	static async addTypeOfAnAnimal(data: {
		animal_id: number
		type_id: number
	}): Promise<{ message: string }> {
		const animal = await db.Animal.findOne({
			where: { id: data.animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})

		const type = await db.Type.findOne({
			where: { id: data.type_id, deleted_at: null },
		})
		if (!type)
			throw new ValidationRequestError({
				type_id: ['The selected type id is invalid.'],
			})
		const exists = await db.AnimalType.findOne({
			where: {
				animal_id: data.animal_id,
				type_id: data.type_id,
				deleted_at: null,
			},
		})
		if (exists) throw new ValidationError('This animal type already exists')
		await db.AnimalType.create(data)
		return { message: 'Success' }
	}

	static async getTypesOfAnAnimal(
		id: number,
	): Promise<{ message: string; data: Record<string, unknown[]> | [] }> {
		const animalTypes = (await db.AnimalType.findAll({
			where: { animal_id: id, deleted_at: null },
			include: [
				{
					model: db.Animal,
					as: 'Animal',
					where: { deleted_at: null },
					attributes: ['name'],
				},
				{
					model: db.Type,
					as: 'Type',
					where: { deleted_at: null },
					attributes: ['type'],
				},
			],
			attributes: ['id', 'animal_id', 'type_id'],
			raw: true,
		})) as unknown as AnimalTypeRaw[]
		const formatted = animalTypes.map((row) => ({
			animal_type_id: row.id,
			animal_id: row.animal_id,
			type_id: row.type_id,
			animal_name: row['Animal.name'],
			animal_type: row['Type.type'],
		}))

		const grouped = groupBy(formatted, (row) => row.animal_name)

		if (!Object.keys(grouped).length) return { message: 'Success', data: [] }

		return { message: 'Success', data: grouped }
	}

	static async getAllAnimalsWithTheirTypes(): Promise<{
		message: string
		data: Record<string, unknown[]> | []
	}> {
		const animalData = (await db.AnimalType.findAll({
			include: [
				{
					model: db.Animal,
					as: 'Animal',
					where: { deleted_at: null },
					attributes: ['id', 'name'],
				},
				{
					model: db.Type,
					as: 'Type',
					where: { deleted_at: null },
					attributes: ['id', 'type'],
				},
			],
			attributes: ['id', 'animal_id', 'type_id'],
			raw: true,
			where: { deleted_at: null },
		})) as unknown as AnimalTypeRaw[]
		const formatted = animalData.map((row) => ({
			animal_type_id: row.id,
			animal_id: row.animal_id,
			type_id: row.type_id,
			animal_name: row['Animal.name'],
			animal_type: row['Type.type'],
		}))

		const grouped = groupBy(formatted, (row) => row.animal_name)

		if (!Object.keys(grouped).length) return { message: 'Success', data: [] }

		return { message: 'Success', data: grouped }
	}

	static async deleteAnimalType(
		id: number,
	): Promise<{ message: string; success: boolean }> {
		const deleted = await db.AnimalType.destroy({ where: { id } })
		return deleted
			? { message: 'Deleted successfully', success: true }
			: { message: 'Something went wrong. Please try again.', success: false }
	}

	static async findAnimalTypeById(id: number): Promise<AnimalType | null> {
		return db.AnimalType.findOne({ where: { id, deleted_at: null } })
	}

	static async getAllAnimals(language_id: number): Promise<{
		message: string
		data: { id: number; name: string; language_id: number }[]
	}> {
		const animals = await db.AnimalLanguage.findAll({
			where: { language_id, deleted_at: null },
			attributes: ['animal_id', 'name', 'language_id'],
			raw: true,
		})
		return {
			message: 'Success',
			data: animals.map((value) => ({
				id: value.animal_id,
				name: value.name,
				language_id: value.language_id,
			})),
		}
	}

	static async getAnimalNumberByAnimalId(
		animal_id: number,
		user_id: number,
	): Promise<{ message: string; data: string[] }> {
		type AnimalNumberResult = { animal_number: string }
		const animalNumbers = (await db.AnimalQuestionAnswer.findAll({
			where: { animal_id, user_id, status: 0, deleted_at: null },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			raw: true,
		})) as AnimalNumberResult[]
		return {
			message: 'Success',
			data: animalNumbers.map((a) => a.animal_number),
		}
	}

	static async deleteUserAnimal(
		user_id: number,
		animal_id: number,
		animal_number: string,
		answers: { question_id: number; answer: string }[],
	): Promise<boolean> {
		const animal = await db.Animal.findOne({
			where: { id: animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})

		const animalNumber = await db.AnimalQuestionAnswer.findOne({
			where: { animal_number, deleted_at: null },
		})
		if (!animalNumber)
			throw new ValidationRequestError({
				animal_number: ['The selected animal number is invalid.'],
			})
		const deleted = await db.AnimalQuestionAnswer.destroy({
			where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
		})
		if (deleted) {
			await db.DeletedAnimalDetails.bulkCreate(
				answers.map((value) => ({
					user_id,
					animal_id,
					animal_number,
					question_id: value.question_id,
					answer: value.answer,
				})),
			)
			return true
		}
		return false
	}

	static async updateAnimalNumberAnswer(user_id: number): Promise<boolean> {
		await db.sequelize.query(
			`
			UPDATE animal_question_answers 
			SET answer = animal_number 
			WHERE question_id = 6 
			AND deleted_at IS NULL
			AND user_id = :user_id 
			AND animal_number != answer
		`,
			{
				replacements: { user_id },
				type: QueryTypes.UPDATE,
			},
		)

		return true
	}

	static async userAnimalCount(
		user_id: number,
	): Promise<{ [animal_name: string]: number; animal_id: number }[]> {
		const query = `
		SELECT 
			a.id as animal_id,
			a.name as animal_name,
			COALESCE(COUNT(DISTINCT aqa.animal_number), 0) as count
		FROM animals a
		LEFT JOIN animal_question_answers aqa ON a.id = aqa.animal_id 
			AND aqa.user_id = :user_id 
			AND aqa.status != 1
			AND aqa.deleted_at IS NULL
		WHERE a.deleted_at IS NULL
		GROUP BY a.id, a.name
		ORDER BY a.id
	`

		const results = (await db.sequelize.query(query, {
			replacements: { user_id },
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as {
			animal_id: number
			animal_name: string
			count: number
		}[]

		return results.map((row) => ({
			[row.animal_name]: row.count,
			animal_id: row.animal_id,
		}))
	}

	static async animalInfo(
		user_id: number,
		animal_id: number,
	): Promise<{ message: string; data: AnimalInfoResult[] }> {
		try {
			const animal = await db.Animal.findOne({
				where: { id: animal_id, deleted_at: null },
				attributes: ['name'],
				raw: true,
			})
			if (!animal) {
				return { message: 'Success', data: [] }
			}

			const totalAnimalCount = await this.getTotalAnimalCount(
				animal_id,
				user_id,
			)
			const resData: AnimalInfoResult[] = [{ [animal.name]: totalAnimalCount }]

			if (totalAnimalCount === 0) {
				return this.getEmptyResults(resData)
			}

			const counts = await this.calculateAnimalCounts(animal_id, user_id)

			resData.push(
				{ male: counts.male },
				{ female: counts.female },
				{ heifer: counts.heifer },
			)

			return { message: 'Success', data: resData }
		} catch (error) {
			console.error('Error in animalInfo:', error)
			return { message: 'Error retrieving animal info', data: [] }
		}
	}

	private static getEmptyResults(resData: AnimalInfoResult[]): {
		message: string
		data: AnimalInfoResult[]
	} {
		resData.push({ male: 0 }, { female: 0 }, { heifer: 0 })
		return { message: 'Success', data: resData }
	}

	private static async getTotalAnimalCount(
		animal_id: number,
		user_id: number,
	): Promise<number> {
		const countAnimal = await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_id,
				user_id,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			raw: true,
		})
		return countAnimal.length
	}

	private static async calculateAnimalCounts(
		animal_id: number,
		user_id: number,
	): Promise<GenderCount> {
		const animalData = await this.getBulkAnimalData(animal_id, user_id)

		const counts = this.processBulkAnimalData(animalData)

		return counts
	}

	private static async getBulkAnimalData(
		animal_id: number,
		user_id: number,
	): Promise<AnimalDataRow[]> {
		const rawQuery = `
        WITH ranked_gender AS (
            SELECT 
                aqa.animal_number,
                aqa.answer as gender_answer,
                ROW_NUMBER() OVER (PARTITION BY aqa.animal_number ORDER BY aqa.created_at DESC) as rn
            FROM animal_question_answers aqa
            JOIN common_questions cq ON aqa.question_id = cq.id AND cq.deleted_at IS NULL
            WHERE aqa.animal_id = :animal_id
                AND aqa.user_id = :user_id
                AND aqa.status != 1
				AND aqa.deleted_at IS NULL
				AND cq.deleted_at IS NULL
                AND cq.question_tag = 8
        ),
        ranked_heifer AS (
            SELECT 
                aqa.animal_number,
                aqa.answer as heifer_answer,
                aqa.logic_value as heifer_logic_value,
                ROW_NUMBER() OVER (PARTITION BY aqa.animal_number ORDER BY aqa.created_at DESC) as rn
            FROM animal_question_answers aqa
            JOIN common_questions cq ON aqa.question_id = cq.id AND cq.deleted_at IS NULL
            WHERE aqa.animal_id = :animal_id
                AND aqa.user_id = :user_id
                AND aqa.status != 1
				AND aqa.deleted_at IS NULL
				AND cq.deleted_at IS NULL
                AND cq.question_tag = 60
        ),
        all_animals AS (
            SELECT DISTINCT aqa.animal_number
            FROM animal_question_answers aqa
            WHERE aqa.animal_id = :animal_id
                AND aqa.user_id = :user_id
                AND aqa.status != 1
				AND aqa.deleted_at IS NULL
        )
        SELECT 
            a.animal_number,
            g.gender_answer,
            h.heifer_answer,
            h.heifer_logic_value
        FROM all_animals a
        LEFT JOIN ranked_gender g ON a.animal_number = g.animal_number AND g.rn = 1
        LEFT JOIN ranked_heifer h ON a.animal_number = h.animal_number AND h.rn = 1
    `

		return (await db.sequelize.query(rawQuery, {
			replacements: { animal_id, user_id },
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as AnimalDataRow[]
	}

	private static processBulkAnimalData(
		animalData: AnimalDataRow[],
	): GenderCount {
		let maleCount = 0
		let cow1 = 0
		const femaleAnimals: AnimalDataRow[] = []
		let heifer2 = 0
		const heiferCalves: AnimalDataRow[] = []

		for (const animal of animalData) {
			const genderAnswer = animal.gender_answer?.toLowerCase()
			const heiferLogicValue = animal.heifer_logic_value?.toLowerCase()
			const hasGender = genderAnswer && genderAnswer.trim() !== ''
			const hasHeiferAnswer =
				animal.heifer_answer && animal.heifer_answer.trim() !== ''

			if (!hasGender && !hasHeiferAnswer) {
				cow1++
			} else if (!hasGender && heiferLogicValue) {
				if (heiferLogicValue === 'cow' || heiferLogicValue === 'buffalo') {
					cow1++
				}
			} else if (genderAnswer === 'male') {
				maleCount++
			} else if (genderAnswer === 'female') {
				femaleAnimals.push(animal)
			} else if (!hasGender && heiferLogicValue === 'calf') {
				heifer2++
			}

			if (animal.heifer_logic_value) {
				if (genderAnswer === 'female' && heiferLogicValue === 'calf') {
					heiferCalves.push(animal)
				}
			}
		}

		const cowCount = this.calculateFemaleCount(femaleAnimals)
		const totalFemaleCount = cowCount + cow1

		const totalHeiferCount = heiferCalves.length + heifer2

		return {
			male: maleCount,
			female: totalFemaleCount,
			heifer: totalHeiferCount,
		}
	}

	private static calculateFemaleCount(femaleAnimals: AnimalDataRow[]): number {
		let cowCount = 0

		for (const animal of femaleAnimals) {
			const heiferLogicValue = animal.heifer_logic_value?.toLowerCase()

			if (!heiferLogicValue || heiferLogicValue === '') {
				cowCount++
			} else if (heiferLogicValue === 'cow' || heiferLogicValue === 'buffalo') {
				cowCount++
			}
		}

		return cowCount
	}

	static async addAnimalQuestion(data: {
		animal_id: number
		question_id: number[]
	}): Promise<{ message: string; data: [] }> {
		const t = await db.sequelize.transaction()
		try {
			const { animal_id, question_id } = data

			const animal = await db.Animal.findOne({
				where: { id: data.animal_id, deleted_at: null },
			})

			if (!animal) {
				throw new ValidationRequestError({
					animal_id: ['The selected animal id is invalid.'],
				})
			}

			const count = await db.CommonQuestions.count({
				where: {
					id: { [Op.in]: data.question_id },
					deleted_at: null,
				},
			})
			if (count !== data.question_id.length) {
				throw new ValidationRequestError({
					question_id: ['The selected question id is invalid.'],
				})
			}

			const existingRecords = await db.AnimalQuestions.findAll({
				where: {
					animal_id: animal_id,
					question_id: question_id,
					deleted_at: null,
				},
				transaction: t,
			})

			const existingQuestionIds = new Set(
				existingRecords.map((record) => record.get('question_id')),
			)

			const existingIds = question_id.filter((qid) =>
				existingQuestionIds.has(qid),
			)
			const newIds = question_id.filter((qid) => !existingQuestionIds.has(qid))

			if (existingIds.length > 0) {
				await db.AnimalQuestions.update(
					{
						animal_id: animal_id,
					},
					{
						where: {
							animal_id: animal_id,
							question_id: { [Op.in]: existingIds },
							deleted_at: null,
						},
						transaction: t,
					},
				)
			}

			if (newIds.length > 0) {
				const recordsToInsert = newIds.map((qid) => ({
					animal_id: animal_id,
					question_id: qid,
				}))

				await db.AnimalQuestions.bulkCreate(recordsToInsert, {
					transaction: t,
				})
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
	): Promise<{ success: boolean; message: string }> {
		const deleted = await db.AnimalQuestions.destroy({ where: { id } })
		return deleted
			? { success: true, message: 'Success' }
			: {
					success: false,
					message: 'Something went wrong. Please try again',
				}
	}

	private static buildLanguageQuery(
		animal_id: number,
		language_id: number,
	): {
		sql: string
		replacements: Record<string, string | number>
	} {
		return {
			sql: `
            SELECT 
                cq.id as question_id,
                cq.question as master_question,
                cq.date,
                cq.form_type_value,
                cq.hint as default_hint,
                cq.category_id,
                cq.sub_category_id,
                cq.validation_rule_id,
                ql.id as question_language_id,
                ql.question as language_question,
                ql.form_type_value as language_form_type_value,
                ql.hint,
                vr.name as validation_rule,
                vr.constant_value,
                ft.name as form_type,
                cl.category_language_name as category_name,
                scl.sub_category_language_name as sub_category_name,
                qu.name as question_unit_name,
                qt.name as question_tag_name,
                aq.animal_id
            FROM common_questions cq
            INNER JOIN animal_questions aq ON aq.question_id = cq.id AND aq.deleted_at IS NULL
            INNER JOIN question_language ql ON cq.id = ql.question_id AND ql.language_id = :language_id AND ql.deleted_at IS NULL
            INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
            INNER JOIN category_language cl ON cl.category_id = cq.category_id AND cl.language_id = :language_id AND cl.deleted_at IS NULL
            LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id AND scl.language_id = :language_id AND scl.deleted_at IS NULL
            LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
            LEFT JOIN question_units qu ON qu.id = cq.question_unit AND qu.deleted_at IS NULL
            LEFT JOIN question_tags qt ON qt.id = cq.question_tag AND qt.deleted_at IS NULL
            WHERE aq.animal_id = :animal_id 
				AND cq.deleted_at IS NULL
        `,
			replacements: { animal_id, language_id },
		}
	}

	private static buildDefaultQuery(animal_id: number): {
		sql: string
		replacements: Record<string, string | number>
	} {
		return {
			sql: `
            SELECT 
                cq.id as question_id,
                cq.question as master_question,
                cq.date,
                cq.form_type_value,
                cq.hint,
                vr.name as validation_rule,
                vr.constant_value,
                ft.name as form_type,
                c.name as category_name,
                s.name as sub_category_name,
                aq.animal_id
            FROM common_questions cq
            INNER JOIN animal_questions aq ON aq.question_id = cq.id AND aq.deleted_at IS NULL
            INNER JOIN categories c ON c.id = cq.category_id AND c.deleted_at IS NULL
            LEFT JOIN subcategories s ON s.id = cq.sub_category_id AND s.deleted_at IS NULL
            LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
            INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
            WHERE aq.animal_id = :animal_id 
                AND cq.deleted_at IS NULL
        `,
			replacements: { animal_id },
		}
	}

	private static createLanguageQuestionData(
		row: LanguageQueryResult,
	): LanguageQuestionData {
		return {
			animal_id: row.animal_id,
			validation_rule: row.validation_rule,
			master_question: row.master_question,
			language_question: row.language_question,
			question_id: row.question_id,
			form_type: row.form_type,
			date: row.date,
			form_type_value: row.form_type_value,
			question_language_id: row.question_language_id,
			constant_value: row.constant_value,
			question_unit: row.question_unit_name,
			question_tag: row.question_tag_name,
			language_form_type_value: row.language_form_type_value,
			hint: row.hint,
		}
	}

	private static createDefaultQuestionData(
		row: DefaultQueryResult,
	): DefaultQuestionData {
		return {
			animal_id: row.animal_id,
			validation_rule: row.validation_rule,
			master_question: row.master_question,
			question_id: row.question_id,
			form_type: row.form_type,
			date: row.date,
			form_type_value: row.form_type_value,
			constant_value: row.constant_value,
			hint: row.hint,
		}
	}

	private static groupQuestionsByCategory<T>(
		rows: Array<T & { category_name: string; sub_category_name: string }>,
		transformFn: (row: T) => unknown,
	): Record<string, Record<string, unknown[]>> {
		return rows.reduce(
			(acc, row) => {
				const categoryName = row.category_name || ''
				const subCategoryName = row.sub_category_name || ''

				if (!acc[categoryName]) {
					acc[categoryName] = {}
				}

				if (!acc[categoryName][subCategoryName]) {
					acc[categoryName][subCategoryName] = []
				}

				acc[categoryName][subCategoryName].push(transformFn(row))

				return acc
			},
			{} as Record<string, Record<string, unknown[]>>,
		)
	}

	static async getQuestionsBasedOnAnimalId(
		animal_id: number,
		language_id?: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, unknown[]>> | []
	}> {
		const query = language_id
			? AnimalService.buildLanguageQuery(animal_id, language_id)
			: AnimalService.buildDefaultQuery(animal_id)

		const rows = await db.sequelize.query(query.sql, {
			replacements: query.replacements,
			type: QueryTypes.SELECT,
		})

		const typedRows = rows as (LanguageQueryResult | DefaultQueryResult)[] | []

		if (!typedRows?.length) {
			return { message: 'Success', data: [] }
		}

		const resData = language_id
			? AnimalService.groupQuestionsByCategory(
					typedRows as LanguageQueryResult[],
					(row) => AnimalService.createLanguageQuestionData(row),
				)
			: AnimalService.groupQuestionsByCategory(
					typedRows as DefaultQueryResult[],
					(row) => AnimalService.createDefaultQuestionData(row),
				)

		return { message: 'Success', data: resData }
	}

	public static async _getLatestAnswerByTag(
		user_id: number,
		animal_id: number,
		animal_number: string,
		tag: number,
	): Promise<AnimalAnswerRecord | null> {
		const [record] = await db.sequelize.query(
			`
		SELECT aqa.*
		FROM animal_question_answers aqa
		INNER JOIN common_questions cq ON aqa.question_id = cq.id AND cq.deleted_at IS NULL
		WHERE aqa.user_id = :user_id
		  AND aqa.animal_id = :animal_id
		  AND aqa.animal_number = :animal_number
		  AND aqa.deleted_at IS NULL
		  AND cq.question_tag = :tag
		  AND aqa.status != 1
		ORDER BY aqa.created_at DESC
		LIMIT 1
		`,
			{
				replacements: { user_id, animal_id, animal_number, tag },
				type: QueryTypes.SELECT,
			},
		)

		return (record as AnimalAnswerRecord) || null
	}

	static async animalDetailsBasedOnAnimalType({
		animal_id,
		type,
		user_id,
	}: AnimalDetailsRequest): Promise<AnimalDetailsResponse> {
		const animal = await db.Animal.findOne({
			where: { id: animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})
		const animalType = type.toLowerCase()
		let resData: AnimalDetailsResponse
		switch (animalType) {
			case 'cow':
			case 'buffalo':
				resData = await this.getCowOrBuffaloDetails(
					animal_id,
					user_id,
					animal.name,
				)
				break
			case 'heifer':
				resData = await this.getHeiferDetails(animal_id, user_id, animal.name)
				break
			case 'bull':
				resData = await this.getBullDetails(animal_id, user_id)
				break
			default:
				resData = await this.getOtherAnimalDetails(animal_id, user_id)
				break
		}
		return resData
	}
	private static async getDistinctAnimalNumbers(
		userId: number,
		animalId: number,
		questionTag: number | null = null,
		status: boolean = true,
	): Promise<
		{
			animal_number: string
			animal_name: string
		}[]
	> {
		let query = `
            SELECT DISTINCT(aqa.animal_number), a.name as animal_name
            FROM animal_question_answers as aqa
            JOIN animals as a ON a.id = aqa.animal_id
            WHERE aqa.user_id = :userId
            AND aqa.animal_id = :animalId
			AND aqa.deleted_at IS NULL
			AND a.deleted_at IS NULL
        `

		if (status) {
			query += ' AND aqa.status != 1'
		}

		if (questionTag) {
			query = `
                SELECT DISTINCT(aqa.animal_number), a.name as animal_name
                FROM common_questions as cq
                JOIN animal_question_answers as aqa ON aqa.question_id = cq.id
                JOIN animals as a ON a.id = aqa.animal_id
                WHERE cq.question_tag = :questionTag
                AND aqa.user_id = :userId
                AND aqa.animal_id = :animalId
                AND aqa.status != 1
				AND aqa.deleted_at IS NULL
				AND a.deleted_at IS NULL
				AND cq.deleted_at IS NULL
            `
		}

		const replacements: { [key: string]: number | string } = {
			userId,
			animalId,
		}
		if (questionTag) replacements.questionTag = questionTag

		return await db.sequelize.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		})
	}
	private static async getQuestionAnswer(
		questionTag: number,
		userId: number,
		animalId: number,
		animalNumber: string,
		selectFields: string = 'aqa.answer',
	): Promise<QuestionAnswer | null> {
		const query = `
            SELECT ${selectFields}
            FROM common_questions as cq
            JOIN animal_question_answers as aqa ON aqa.question_id = cq.id
            JOIN animals as a ON a.id = aqa.animal_id
            WHERE cq.question_tag = :questionTag
            AND aqa.user_id = :userId
            AND aqa.animal_id = :animalId
            AND aqa.animal_number = :animalNumber
            AND aqa.deleted_at IS NULL
            AND a.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            ORDER BY aqa.created_at DESC
            LIMIT 1
        `

		const result = await db.sequelize.query(query, {
			replacements: { questionTag, userId, animalId, animalNumber },
			type: QueryTypes.SELECT,
		})

		return (result[0] as QuestionAnswer) || null
	}
	private static async getAnimalSex(
		userId: number,
		animalId: number,
		animalNumber: string,
	): Promise<QuestionAnswer | null> {
		return await this.getQuestionAnswer(
			8,
			userId,
			animalId,
			animalNumber,
			'cq.id as question_id, aqa.answer, cq.question, aqa.animal_id, aqa.animal_number, aqa.created_at as answer_date, cq.question_tag',
		)
	}
	private static async isAnimalCalf(
		userId: number,
		animalId: number,
		animalNumber: string,
	): Promise<boolean> {
		const result = await this.getQuestionAnswer(
			60,
			userId,
			animalId,
			animalNumber,
			'aqa.answer, aqa.logic_value',
		)
		return result?.logic_value?.toLowerCase() === 'calf'
	}
	private static async getMilkingStatus(
		userId: number,
		animalId: number,
		animalNumber: string,
	): Promise<QuestionAnswer | null> {
		return await this.getQuestionAnswer(16, userId, animalId, animalNumber)
	}
	private static async getDateOfBirth(
		userId: number,
		animalId: number,
		animalNumber: string,
	): Promise<QuestionAnswer | null> {
		return await this.getQuestionAnswer(
			9,
			userId,
			animalId,
			animalNumber,
			'aqa.answer, aqa.animal_id',
		)
	}
	private static async getWeight(
		userId: number,
		animalId: number,
		animalNumber: string,
	): Promise<QuestionAnswer | null> {
		return await this.getQuestionAnswer(
			12,
			userId,
			animalId,
			animalNumber,
			'aqa.answer, aqa.animal_id',
		)
	}
	private static async getPregnancyStatus(
		userId: number,
		animalId: number,
		animalNumber: string,
	): Promise<QuestionAnswer | null> {
		return await this.getQuestionAnswer(
			15,
			userId,
			animalId,
			animalNumber,
			'cq.id as question_id, aqa.answer, cq.question, aqa.animal_id, aqa.animal_number, aqa.created_at as answer_date, cq.question_tag',
		)
	}
	private static async buildAnimalData(
		userId: number,
		animalId: number,
		animalNumber: string,
		includeReproductiveStatus: boolean = true,
	): Promise<AnimalData> {
		const [DOB, weight, milkingStatus, pregnancyStatus] = await Promise.all([
			this.getDateOfBirth(userId, animalId, animalNumber),
			this.getWeight(userId, animalId, animalNumber),
			includeReproductiveStatus
				? this.getMilkingStatus(userId, animalId, animalNumber)
				: null,
			includeReproductiveStatus
				? this.getPregnancyStatus(userId, animalId, animalNumber)
				: null,
		])

		return {
			animal_number: animalNumber,
			date_of_birth: DOB?.answer || null,
			weight: weight?.answer || null,
			lactating_status: milkingStatus?.answer || null,
			pregnant_status: pregnancyStatus?.answer || null,
		}
	}
	private static async shouldProcessAnimal(
		userId: number,
		animalId: number,
		animalNumber: string,
		checkCalf: boolean = true,
	): Promise<{ shouldProcess: boolean; isMale?: boolean; isCalf?: boolean }> {
		const animalSex = await this.getAnimalSex(userId, animalId, animalNumber)

		// Skip males (unless no sex data)
		if (animalSex?.answer && animalSex.answer.toLowerCase() === 'male') {
			return { shouldProcess: false, isMale: true }
		}

		// Skip calves if checking for calves
		if (checkCalf) {
			const isCalf = await this.isAnimalCalf(userId, animalId, animalNumber)
			if (isCalf) {
				return { shouldProcess: false, isCalf: true }
			}
		}

		return { shouldProcess: true }
	}
	private static async getCowOrBuffaloDetails(
		animalId: number,
		userId: number,
		animalName: string,
	): Promise<AnimalDetailsResponse> {
		let lactating = 0
		let nonLactating = 0
		let pregnantAnimal = 0
		let nonPregnantAnimal = 0
		const animalData: AnimalData[] = []

		const animals = await this.getDistinctAnimalNumbers(userId, animalId)

		for (const animal of animals) {
			const { shouldProcess } = await this.shouldProcessAnimal(
				userId,
				animalId,
				animal.animal_number,
			)

			if (!shouldProcess) continue

			// Get milking status
			const milkingStatus = await this.getMilkingStatus(
				userId,
				animalId,
				animal.animal_number,
			)
			if (milkingStatus?.answer?.toLowerCase() === 'yes') {
				lactating++
			} else {
				nonLactating++
			}

			// Get pregnancy status
			const pregnancyStatus = await this.getPregnancyStatus(
				userId,
				animalId,
				animal.animal_number,
			)
			if (pregnancyStatus?.answer?.toLowerCase() === 'yes') {
				pregnantAnimal++
			} else {
				nonPregnantAnimal++
			}

			// Build complete animal data
			const data = await this.buildAnimalData(
				userId,
				animalId,
				animal.animal_number,
			)
			animalData.push(data)
		}

		return {
			animal_name: animalName,
			pregnant_animal: pregnantAnimal,
			non_pregnant_animal: nonPregnantAnimal,
			lactating: lactating,
			nonLactating: nonLactating,
			animal_data: animalData,
		}
	}
	private static async getHeiferDetails(
		animalId: number,
		userId: number,
		animalName: string,
	): Promise<AnimalDetailsResponse> {
		let pregnantAnimal = 0
		let nonPregnantAnimal = 0
		const animalData: AnimalData[] = []

		// Get heifers (question_tag = 60)
		const heifers = await this.getDistinctAnimalNumbers(userId, animalId, 60)

		for (const heifer of heifers) {
			// Only process calves for heifers
			const isCalf = await this.isAnimalCalf(
				userId,
				animalId,
				heifer.animal_number,
			)
			if (!isCalf) continue

			const { shouldProcess } = await this.shouldProcessAnimal(
				userId,
				animalId,
				heifer.animal_number,
				false,
			)
			if (!shouldProcess) continue

			// Get pregnancy status
			const pregnancyStatus = await this.getPregnancyStatus(
				userId,
				animalId,
				heifer.animal_number,
			)
			if (pregnancyStatus?.answer?.toLowerCase() === 'yes') {
				pregnantAnimal++
			} else {
				nonPregnantAnimal++
			}

			// Build complete animal data
			const data = await this.buildAnimalData(
				userId,
				animalId,
				heifer.animal_number,
			)
			animalData.push(data)
		}

		return {
			animal_name: animalName,
			pregnant_animal: pregnantAnimal,
			non_pregnant_animal: nonPregnantAnimal,
			animal_data: animalData,
		}
	}
	private static async getBullDetails(
		animalId: number,
		userId: number,
	): Promise<AnimalDetailsResponse> {
		const animalData: AnimalData[] = []
		const animals = await this.getDistinctAnimalNumbers(userId, animalId)

		for (const animal of animals) {
			const animalSex = await this.getAnimalSex(
				userId,
				animalId,
				animal.animal_number,
			)

			// Only process males for bulls
			if (!animalSex?.answer || animalSex.answer.toLowerCase() !== 'male') {
				continue
			}

			// Build animal data without reproductive status
			const data = await this.buildAnimalData(
				userId,
				animalId,
				animal.animal_number,
				false,
			)
			animalData.push(data)
		}

		return {
			animal_data: animalData,
		}
	}
	private static async getOtherAnimalDetails(
		animalId: number,
		userId: number,
	): Promise<AnimalDetailsResponse> {
		const animalData: AnimalData[] = []
		const animals = await this.getDistinctAnimalNumbers(userId, animalId)

		for (const animal of animals) {
			// Build basic animal data without reproductive status
			const data = await this.buildAnimalData(
				userId,
				animalId,
				animal.animal_number,
				false,
			)
			animalData.push(data)
		}

		return {
			animal_data: animalData,
		}
	}

	private static async _getAIHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<AIHistoryItem[]> {
		const aiAnswers = (await db.sequelize.query(
			`
		SELECT aqa.answer, aqa.created_at, cq.question_tag
		FROM animal_question_answers aqa
		INNER JOIN common_questions cq ON aqa.question_id = cq.id AND cq.deleted_at IS NULL
		WHERE aqa.user_id = :user_id
		  AND aqa.animal_id = :animal_id
		  AND aqa.animal_number = :animal_number
		  AND aqa.status <> 1
		  AND aqa.deleted_at IS NULL
		  AND cq.question_tag IN (23, 35, 14, 42)
		ORDER BY aqa.created_at DESC
		`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			answer: string
			created_at: Date
			question_tag: number
		}[]

		const ai: Record<string, Partial<AIHistoryItem>> = {}
		const aiHistory: Record<string, AIHistoryItem> = {}

		for (const item of aiAnswers) {
			const key = item.created_at.toString()
			if (!ai[key]) ai[key] = {}

			if (item.question_tag === 23) {
				ai[key].dateOfAI = item.answer
			} else if (item.question_tag === 35) {
				ai[key].bullNumber = item.answer
			} else if (item.question_tag === 14) {
				ai[key].motherYield = item.answer
			} else if (item.question_tag === 42) {
				ai[key].semenCompanyName = item.answer
			}

			aiHistory[key] = ai[key] as AIHistoryItem
		}

		return Object.values(aiHistory)
	}

	private static async _getDeliveryHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<DeliveryHistoryItem[]> {
		const deliveryAnswers = (await db.sequelize.query(
			`
		SELECT aqa.answer, aqa.created_at, cq.question_tag
		FROM animal_question_answers aqa
		INNER JOIN common_questions cq ON aqa.question_id = cq.id
		WHERE aqa.user_id = :user_id
		  AND aqa.animal_id = :animal_id
		  AND aqa.animal_number = :animal_number
		  AND aqa.status <> 1
		  AND aqa.deleted_at IS NULL
		  AND cq.deleted_at IS NULL
		  AND cq.question_tag IN (65, 66)
		ORDER BY aqa.created_at DESC
		`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			answer: string
			created_at: Date
			question_tag: number
		}[]

		const delivery: Record<string, Partial<DeliveryHistoryItem>> = {}
		const deliveryHistory: Record<string, DeliveryHistoryItem> = {}

		for (const item of deliveryAnswers) {
			const key = item.created_at.toString()
			if (!delivery[key]) delivery[key] = {}

			if (item.question_tag === 66) {
				delivery[key].dateOfDelivery = item.answer

				const calf = await db.AnimalMotherCalf.findOne({
					where: {
						user_id,
						animal_id,
						mother_animal_number: animal_number,
						delivery_date: item.answer,
					},
					attributes: ['calf_animal_number'],
					raw: true,
				})
				delivery[key].calfNumber = calf?.calf_animal_number ?? null
			} else if (item.question_tag === 65) {
				delivery[key].typeOfDelivery = item.answer
			}

			deliveryHistory[key] = delivery[key] as DeliveryHistoryItem
		}

		return Object.values(deliveryHistory)
	}

	private static async _getHeatHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<HeatHistoryItem[]> {
		const heatAnswers = (await db.sequelize.query(
			`
		SELECT aqa.answer, aqa.created_at, cq.question_tag
		FROM animal_question_answers aqa
		INNER JOIN common_questions cq ON aqa.question_id = cq.id AND cq.deleted_at IS NULL
		WHERE aqa.user_id = :user_id
		  AND aqa.animal_id = :animal_id
		  AND aqa.animal_number = :animal_number
		  AND aqa.status <> 1
		  AND aqa.deleted_at IS NULL
		  AND cq.question_tag = 64
		ORDER BY aqa.created_at DESC
		`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			answer: string
			created_at: Date
			question_tag: number
		}[]

		const heatEventDates: HeatHistoryItem[] = []

		for (const item of heatAnswers) {
			heatEventDates.push({ heatDate: item.answer })
		}

		return heatEventDates
	}

	static async getAnimalBreedingHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<BreedingHistoryResponse> {
		const [aiHistory, deliveryHistory, heatHistory] = await Promise.all([
			this._getAIHistory(user_id, animal_id, animal_number),
			this._getDeliveryHistory(user_id, animal_id, animal_number),
			this._getHeatHistory(user_id, animal_id, animal_number),
		])

		return {
			aiHistory,
			deliveryHistory,
			heatHistory,
		}
	}

	static async uploadAnimalImage(params: {
		user_id: number
		animal_id: number
		animal_number: string
		file: Express.Multer.File
	}): Promise<{ message: string }> {
		const { user_id, animal_id, animal_number, file } = params

		// Validate animal_id exists in animals table (like PHP exists:animals,id)
		const animalExists = await Animal.findOne({
			where: { id: animal_id, deleted_at: null },
		})
		if (!animalExists) {
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})
		}

		const animalNumberExists = await db.AnimalQuestionAnswer.findOne({
			where: { animal_number, user_id, deleted_at: null },
		})
		if (!animalNumberExists) {
			throw new ValidationRequestError({
				animal_number: ['The selected animal_number is invalid.'],
			})
		}

		const imageDir = path.join(process.cwd(), 'public', 'profile_img')
		const thumbDir = path.join(imageDir, 'thumb')

		// Create directories if they don't exist
		if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true })
		if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true })

		const existing = await AnimalImage.findOne({
			where: {
				user_id,
				animal_id,
				animal_number,
				deleted_at: null,
			},
		})

		// Generate filename
		const randomString = crypto.randomBytes(25).toString('hex')
		const extension = path.extname(file.originalname).toLowerCase()
		const filename = `${randomString}${extension}`

		sharp.cache(false)

		await sharp(file.path)
			.resize(100, 100)
			.toFile(path.join(thumbDir, filename))

		const newPath = path.join(imageDir, filename)
		fs.copyFileSync(file.path, newPath)
		fs.unlinkSync(file.path)

		if (existing) {
			const oldImagePath = path.join(imageDir, existing.get('image'))
			const oldThumbPath = path.join(thumbDir, existing.get('image'))

			if (fs.existsSync(oldImagePath)) {
				fs.unlinkSync(oldImagePath)
			}
			if (fs.existsSync(oldThumbPath)) {
				fs.unlinkSync(oldThumbPath)
			}

			// Update existing record
			await db.AnimalImage.update(
				{ image: filename },
				{ where: { id: existing.get('id') || existing.id } },
			)
		} else {
			// Create new record
			await AnimalImage.create({
				user_id,
				animal_id,
				animal_number,
				image: filename,
			})
		}

		return { message: 'Animal image added successfully' }
	}

	// --- Animal Profile API ---
	private static async _getGeneralInfo(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<{
		animalType: AnimalTypeRawResult
		dateOfBirth: AnimalAnswerRecord | null
		weight: AnimalAnswerRecord | null
		breeding: AnimalAnswerRecord | null
		pregnancyCycle: AnimalAnswerRecord | null
	}> {
		let breeding: Promise<AnimalAnswerRecord | null>
		if (animal_id === 1) {
			breeding = AnimalService._getLatestAnswerByTag(
				user.id,
				animal_id,
				animal_number,
				62,
			)
		} else if (animal_id === 2) {
			breeding = AnimalService._getLatestAnswerByTag(
				user.id,
				animal_id,
				animal_number,
				63,
			)
		} else {
			breeding = Promise.resolve(null)
		}
		const [animalType, dateOfBirth, weight, breedingResult, pregnancyCycle] =
			await Promise.all([
				db.AnimalQuestionAnswer.findOne({
					where: {
						user_id: user.id,
						animal_id,
						animal_number,
						status: { [Op.ne]: 1 },
						deleted_at: null,
					},
					include: [
						{
							model: db.Animal,
							as: 'Animal',
							where: { deleted_at: null },
							attributes: ['name'],
						},
					],
					attributes: [],
					raw: true,
				}) as AnimalTypeRawResult,
				AnimalService._getLatestAnswerByTag(
					user.id,
					animal_id,
					animal_number,
					9,
				), // DOB
				AnimalService._getLatestAnswerByTag(
					user.id,
					animal_id,
					animal_number,
					12,
				), // weight
				breeding,
				AnimalService._getLatestAnswerByTag(
					user.id,
					animal_id,
					animal_number,
					59,
				), // pregnancy cycle
			])
		return {
			animalType,
			dateOfBirth,
			weight,
			breeding: breedingResult,
			pregnancyCycle,
		}
	}

	private static async _getLactationStats(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<{
		m_fat: number
		e_fat: number
		last_known_fat: number
		m_snf: number
		e_snf: number
		last_known_snf: number
		pregnantStatus: AnimalAnswerRecord | null
		milkingStatus: AnimalAnswerRecord | null
		lastDeliveryDate: AnimalAnswerRecord | null
		BullNoForAI: AnimalAnswerRecord | null
		days_in_milk1: number
		current_lactation_milk_yield: number
		last_lactation_milk_yield: number
	}> {
		const [
			morning_fat,
			evening_fat,
			morning_snf,
			evening_snf,
			pregnantStatus,
			milkingStatus,
			lastDeliveryDate,
			BullNoForAI,
		] = await fetchLactationStatsAnswers(user, animal_id, animal_number)
		const m_fat = parseFloat(morning_fat?.answer ?? '0')
		const e_fat = parseFloat(evening_fat?.answer ?? '0')
		const last_known_fat = m_fat + e_fat
		const m_snf = parseFloat(morning_snf?.answer ?? '0')
		const e_snf = parseFloat(evening_snf?.answer ?? '0')
		const last_known_snf = m_snf + e_snf

		const lactationHistory = await db.AnimalLactationYieldHistory.findAll({
			where: { user_id: user.id, animal_id, animal_number, deleted_at: null },
			order: [['created_at', 'ASC']],
			raw: true,
		})

		const { days_in_milk1, current_lactation_milk_yield } =
			await calculateCurrentLactationYield(
				user,
				animal_id,
				animal_number,
				lactationHistory,
			)
		const last_lactation_milk_yield = await calculateLastLactationYield(
			user,
			animal_id,
			animal_number,
			lactationHistory,
		)
		return {
			m_fat,
			e_fat,
			last_known_fat,
			m_snf,
			e_snf,
			last_known_snf,
			pregnantStatus,
			milkingStatus,
			lastDeliveryDate,
			BullNoForAI,
			days_in_milk1,
			current_lactation_milk_yield,
			last_lactation_milk_yield,
		}
	}

	private static async _getVaccinationList(
		user: User,
		animal_number: string,
	): Promise<{ type: string; date: string }[]> {
		const results = (await db.sequelize.query(
			`
        SELECT vt.type, vd.date 
        FROM vaccination_details vd
        JOIN animal_vaccinations av ON av.vaccination_id = vd.id
        JOIN user_vaccination_type uvt ON uvt.vaccination_id = vd.id
        JOIN vaccination_types vt ON vt.id = uvt.type_id
        WHERE vd.user_id = :userId 
		AND vd.deleted_at IS NULL
		AND av.deleted_at IS NULL
		AND vt.deleted_at IS NULL
        AND av.animal_number = :animalNumber
    `,
			{
				replacements: {
					userId: user.id,
					animalNumber: animal_number,
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			type: string
			date: string
		}[]

		return results.map((row) => ({
			type: row.type ?? '',
			date: row.date ?? '',
		}))
	}

	private static async _getPedigree(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<{
		mother: { tag_no: string; milk_yield: number }
		father: {
			tag_no: string
			semen_co_name: string
			sire_dam_yield: number | string
			daughter_yield: string
		}
	}> {
		const motherNo = await db.AnimalMotherCalf.findOne({
			where: {
				user_id: user.id,
				animal_id,
				calf_animal_number: animal_number,
				deleted_at: null,
			},
			attributes: ['mother_animal_number', 'delivery_date'],
			raw: true,
		})
		let mother_milk_yield = 0
		let motherBullNoUsedForAI = ''
		let semen_co_name = ''
		let sire_dam_yield = ''
		if (motherNo) {
			mother_milk_yield =
				((await db.DailyMilkRecord.sum('morning_milk_in_litres', {
					where: {
						user_id: user.id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
						deleted_at: null,
					},
				})) ?? 0) +
				((await db.DailyMilkRecord.sum('evening_milk_in_litres', {
					where: {
						user_id: user.id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
						deleted_at: null,
					},
				})) ?? 0)
			const dateOfAI = await db.AnimalQuestionAnswer.findOne({
				where: {
					user_id: user.id,
					animal_id,
					animal_number: motherNo.mother_animal_number,
					status: { [Op.ne]: 1 },
					deleted_at: null,
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 23, deleted_at: null },
						attributes: [],
					},
				],
				order: [['created_at', 'DESC']],
				attributes: ['answer', 'created_at'],
				raw: true,
			})
			if (dateOfAI) {
				const [noOfBullUsedForAI, semenCoName, bullMotherYield] =
					await Promise.all([
						db.AnimalQuestionAnswer.findOne({
							where: {
								user_id: user.id,
								animal_id,
								animal_number: motherNo.mother_animal_number,
								status: { [Op.ne]: 1 },
								created_at: dateOfAI.created_at,
								deleted_at: null,
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 35, deleted_at: null },
									attributes: [],
								},
							],
							attributes: ['answer'],
							raw: true,
						}) as Promise<AnswerRaw | null>,
						db.AnimalQuestionAnswer.findOne({
							where: {
								user_id: user.id,
								animal_id,
								animal_number: motherNo.mother_animal_number,
								status: { [Op.ne]: 1 },
								created_at: dateOfAI.created_at,
								deleted_at: null,
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 42, deleted_at: null },
									attributes: [],
								},
							],
							attributes: ['answer'],
							raw: true,
						}) as Promise<AnswerRaw | null>,
						db.AnimalQuestionAnswer.findOne({
							where: {
								user_id: user.id,
								animal_id,
								animal_number: motherNo.mother_animal_number,
								status: { [Op.ne]: 1 },
								created_at: dateOfAI.created_at,
								deleted_at: null,
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 14, deleted_at: null },
									attributes: [],
								},
							],
							attributes: ['answer'],
							raw: true,
						}) as Promise<AnswerRaw | null>,
					])
				motherBullNoUsedForAI = noOfBullUsedForAI?.answer ?? ''
				semen_co_name = semenCoName?.answer ?? ''
				sire_dam_yield = bullMotherYield?.answer ?? ''
			}
		}
		return {
			mother: {
				tag_no: motherNo?.mother_animal_number ?? '',
				milk_yield: Number(mother_milk_yield.toFixed(1)),
			},
			father: {
				tag_no: motherBullNoUsedForAI,
				semen_co_name: semen_co_name,
				sire_dam_yield: sire_dam_yield
					? Number(parseFloat(sire_dam_yield).toFixed(1))
					: '',
				daughter_yield: '',
			},
		}
	}

	private static async _getProfileImage(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<{ image: string }> {
		const animalImage = await AnimalImage.findOne({
			where: { user_id: user.id, animal_id, animal_number, deleted_at: null },
			raw: true,
		})
		return {
			image: animalImage?.image
				? `${process.env.APP_URL}/profile_img/${animalImage.image}`
				: '',
		}
	}

	static async getAnimalProfile(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<Record<string, unknown>> {
		const [general, lactation, vaccination_details, pedigree, profile_img] =
			await Promise.all([
				this._getGeneralInfo(user, animal_id, animal_number),
				this._getLactationStats(user, animal_id, animal_number),
				this._getVaccinationList(user, animal_number),
				this._getPedigree(user, animal_id, animal_number),
				this._getProfileImage(user, animal_id, animal_number),
			])
		const breed = general.breeding?.answer ?? ''
		const age =
			general.dateOfBirth?.answer &&
			!isNaN(new Date(general.dateOfBirth.answer).getFullYear())
				? Math.max(
						0,
						new Date().getFullYear() -
							new Date(general.dateOfBirth.answer).getFullYear(),
					)
				: 0

		return {
			profile_img,
			general: {
				animal_type: general?.animalType?.['Animal.name'] ?? '',
				birth: general.dateOfBirth?.answer ?? '',
				weight: general.weight?.answer ?? '',
				age,
				breed,
				lactation_number: general.pregnancyCycle?.answer ?? '',
			},
			breeding_details: {
				pregnant_status: lactation.pregnantStatus?.answer ?? '',
				lactating_status: lactation.milkingStatus?.answer ?? '',
				last_delivery_date: lactation.lastDeliveryDate?.answer ?? '',
				days_in_milk: lactation.days_in_milk1,
				last_breeding_bull_no: lactation.BullNoForAI?.answer ?? '',
			},
			milk_details: {
				average_daily_milk:
					lactation.days_in_milk1 > 0
						? Number(
								(
									lactation.current_lactation_milk_yield /
									lactation.days_in_milk1
								).toFixed(2),
							)
						: '',
				current_lactation_milk_yield: lactation.current_lactation_milk_yield,
				last_lactation_milk_yield: lactation.last_lactation_milk_yield,
				last_known_snf: Number((lactation.last_known_snf / 2).toFixed(2)),
				last_known_fat: Number((lactation.last_known_fat / 2).toFixed(2)),
			},
			vaccination_details,
			pedigree,
		}
	}

	public static async getUserDeletedAnimalHistory(
		user_id: number,
		animal_id: number,
	): Promise<
		{
			animal_number: string
			type: 'Sold' | 'Died' | 'Removed'
			reason: string
			date: string
			selling_price?: string
			death_reason?: string
		}[]
	> {
		const results = (await db.sequelize.query(
			`
        SELECT 
            animal_number,
            MAX(CASE WHEN question_id = 25 THEN answer END) as reason,
            MAX(CASE WHEN question_id = 26 THEN answer END) as date,
            MAX(CASE WHEN question_id = 27 THEN answer END) as selling_price,
            MAX(CASE WHEN question_id = 28 THEN answer END) as death_reason,
            MAX(created_at) as created_at
        FROM deleted_animal_details 
        WHERE user_id = :user_id
            AND animal_id = :animal_id
            AND question_id IN (25, 26, 27, 28)
        GROUP BY animal_number, created_at
        ORDER BY created_at DESC
        `,
			{
				replacements: {
					user_id,
					animal_id: Number(animal_id),
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			animal_number: string
			reason: string
			date: string
			selling_price: string | null
			death_reason: string | null
			created_at: Date
		}[]

		return results.map((record) => ({
			animal_number: record.animal_number,
			type: record.selling_price
				? 'Sold'
				: record.death_reason
					? 'Died'
					: 'Removed',
			reason: record.reason || '',
			date: record.date || '',
			...(record.selling_price && { selling_price: record.selling_price }),
			...(record.death_reason && { death_reason: record.death_reason }),
		}))
	}
}

function updateCurrentPeriod(
	currentPeriod: { start: date; end: date } | undefined,
	currentRow: LactationHistoryRow,
): { start: date; end: date } {
	if (!currentPeriod) {
		return { start: currentRow.date || '', end: '' }
	} else {
		currentPeriod.end = currentRow.date || ''
		return currentPeriod
	}
}

function getLactationPeriods(
	history: LactationHistoryRow[],
): { start: date; end: date }[] {
	const periods: { start: date; end: date }[] = []
	let currentPeriod: { start: date; end: date } | undefined

	for (let i = 0; i < history.length; i++) {
		const currentRow = history[i]
		const nextRow = history[i + 1]
		const isLactating = currentRow.lactating_status?.toLowerCase() === 'yes'
		const isNextLactating = nextRow?.lactating_status?.toLowerCase() === 'yes'

		if (isLactating && (!isNextLactating || !nextRow)) {
			currentPeriod = updateCurrentPeriod(currentPeriod, currentRow)
			currentPeriod = closeCurrentPeriod(periods, currentPeriod)
		} else if (!isLactating && currentPeriod) {
			currentPeriod = closeCurrentPeriod(periods, currentPeriod)
		}

		if (isLactating) {
			currentPeriod = updateCurrentPeriod(currentPeriod, currentRow)
		}
	}

	return periods
}

async function fetchLactationStatsAnswers(
	user: User,
	animal_id: number,
	animal_number: string,
): Promise<
	[
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
		AnimalAnswerRecord | null,
	]
> {
	return Promise.all([
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 17), // morning fat
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 19), // evening fat
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 18), // morning snf
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 20), // evening snf
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 15), // pregnant status
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 16), // milking status
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 66), // last delivery date
		AnimalService._getLatestAnswerByTag(user.id, animal_id, animal_number, 35), // bull no for AI
	])
}

function getDateRangeArray(from: Date, to: Date): string[] {
	const dates: string[] = []
	for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
		dates.push(d.toISOString().slice(0, 10))
	}
	return dates
}

async function sumMilkForDateRange(
	user: User,
	animal_id: number,
	animal_number: string,
	dates: string[],
): Promise<number> {
	const milkSum = await db.DailyMilkRecord.sum('morning_milk_in_litres', {
		where: {
			user_id: user.id,
			animal_number,
			animal_id,
			record_date: dates,
			deleted_at: null,
		},
	})
	const milkSumEvening = await db.DailyMilkRecord.sum(
		'evening_milk_in_litres',
		{
			where: {
				user_id: user.id,
				animal_number,
				animal_id,
				record_date: dates,
				deleted_at: null,
			},
		},
	)
	return (Number(milkSum) || 0) + (Number(milkSumEvening) || 0)
}

function getPeriodDateRange(period: {
	start: date
	end: date
}): { from: Date; to: Date } | undefined {
	let startDateStr: string | undefined
	let endDateStr: string | undefined
	if (typeof period.start === 'string') {
		startDateStr = period.start
	} else if (period.start instanceof Date) {
		startDateStr = period.start.toISOString().slice(0, 10)
	}
	if (typeof period.end === 'string') {
		endDateStr = period.end
	} else if (period.end instanceof Date) {
		endDateStr = period.end.toISOString().slice(0, 10)
	}
	if (!startDateStr || !endDateStr) return undefined
	return { from: new Date(startDateStr), to: new Date(endDateStr) }
}

async function sumMilkForPeriod(
	user: User,
	animal_id: number,
	animal_number: string,
	period: { start: date; end: date },
): Promise<number> {
	const range = getPeriodDateRange(period)
	if (!range) return 0
	const dates = getDateRangeArray(range.from, range.to)
	if (!dates.length || dates[0] === '1970-01-01') return 0
	return sumMilkForDateRange(user, animal_id, animal_number, dates)
}

async function calculateLastLactationYield(
	user: User,
	animal_id: number,
	animal_number: string,
	lactationHistory: LactationHistoryRow[],
): Promise<number> {
	if (lactationHistory.length <= 1) return 0
	const periods = getLactationPeriods(lactationHistory)
	if (!periods.length) return 0
	const lastPeriod = periods[periods.length - 1]
	return sumMilkForPeriod(user, animal_id, animal_number, lastPeriod)
}

async function calculateCurrentLactationYield(
	user: User,
	animal_id: number,
	animal_number: string,
	lactationHistory: LactationHistoryRow[],
): Promise<{ days_in_milk1: number; current_lactation_milk_yield: number }> {
	if (!lactationHistory.length)
		return { days_in_milk1: 0, current_lactation_milk_yield: 0 }
	const lastLactation = lactationHistory[lactationHistory.length - 1]
	if (
		!lastLactation.lactating_status ||
		lastLactation.lactating_status.toLowerCase() !== 'yes' ||
		!lastLactation.date
	) {
		return { days_in_milk1: 0, current_lactation_milk_yield: 0 }
	}
	let fromDateStr: string | undefined
	if (typeof lastLactation.date === 'string') {
		fromDateStr = lastLactation.date
	} else if (lastLactation.date instanceof Date) {
		fromDateStr = lastLactation.date.toISOString().slice(0, 10)
	}
	if (!fromDateStr) return { days_in_milk1: 0, current_lactation_milk_yield: 0 }
	const from = new Date(fromDateStr)
	const to = new Date()
	const days_in_milk1 = Math.floor(
		(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
	)
	const dates = getDateRangeArray(from, to)
	if (!dates.length || dates[0] === '1970-01-01')
		return { days_in_milk1, current_lactation_milk_yield: 0 }
	const current_lactation_milk_yield = await sumMilkForDateRange(
		user,
		animal_id,
		animal_number,
		dates,
	)
	return { days_in_milk1, current_lactation_milk_yield }
}

function groupBy<T, K extends string | number>(
	arr: T[],
	key: (item: T) => K,
): Record<K, T[]> {
	return arr.reduce(
		(acc, item) => {
			const k = key(item)
			if (!acc[k]) acc[k] = []
			acc[k].push(item)
			return acc
		},
		{} as Record<K, T[]>,
	)
}

function closeCurrentPeriod(
	periods: { start: date; end: date }[],
	currentPeriod: { start: date; end: date } | undefined,
): { start: date; end: date } | undefined {
	if (currentPeriod) {
		periods.push(currentPeriod)
		return undefined
	}
	return currentPeriod
}
