import db from '@/config/database'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { Animal, AnimalType } from '@/models'
import { IncludeOptions, Op } from 'sequelize'
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
import { AnimalImage } from '@/models/animal_image.model'

import type { User } from '@/types/index'
import type { Express } from 'express'

// Add these interfaces after imports, before the AnimalService class
type VaccinationListRaw = {
	date: string
	'UserVaccinationTypes.VaccinationType.type'?: string
}

interface AnimalTypeRawResult {
	'Animal.name'?: string
}

// Generic groupBy utility
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

function buildInclude(language_id?: number): IncludeOptions[] {
	if (language_id) {
		return [
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
		]
	} else {
		return [
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
		]
	}
}

function pushToResult(
	resData: Record<string, Record<string, unknown[]>>,
	categoryName: string,
	subCategoryName: string,
	question: Record<string, unknown>,
): void {
	if (!resData[categoryName]) resData[categoryName] = {}
	if (!resData[categoryName][subCategoryName])
		resData[categoryName][subCategoryName] = []
	resData[categoryName][subCategoryName].push(question)
}

type AnimalInfoResultAlias =
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

type BreedingAnswerRaw = {
	answer: string
	created_at: Date
	'CommonQuestion.question_tag': number
}

// Helper type for answer result
interface AnswerRaw {
	answer?: string
}

type date = string | Date | null
interface LactationHistoryRow {
	lactating_status?: string | null
	date?: date
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

// Helper to fetch all required answers in parallel
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

// Helper to get date range array
function getDateRangeArray(from: Date, to: Date): string[] {
	const dates: string[] = []
	for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
		dates.push(d.toISOString().slice(0, 10))
	}
	return dates
}

// Helper to sum milk for a date range
async function sumMilkForDateRange(
	user: User,
	animal_id: number,
	animal_number: string,
	dates: string[],
): Promise<number> {
	const milkSum = await db.DailyMilkRecord.sum('morning_milk_in_litres', {
		where: { user_id: user.id, animal_number, animal_id, record_date: dates },
	})
	const milkSumEvening = await db.DailyMilkRecord.sum(
		'evening_milk_in_litres',
		{
			where: { user_id: user.id, animal_number, animal_id, record_date: dates },
		},
	)
	return (Number(milkSum) || 0) + (Number(milkSumEvening) || 0)
}

// Helper to convert a period's start/end to Date objects
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

// Helper to sum milk for a period
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

// Refactored: Helper to calculate last lactation yield
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

// Refactored: Helper to calculate current lactation yield
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

export class AnimalService {
	static async create(data: {
		name: string
		language_id: number
	}): Promise<Animal> {
		return db.Animal.create({ name: data.name, language_id: data.language_id })
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
		return !!(await db.Animal.destroy({ where: { id } }))
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
		if (exists) throw new Error('Animal type already exists')
		await db.AnimalType.create(data)
		return { message: 'Animal type added successfully' }
	}

	static async getTypesOfAnAnimal(
		id: number,
	): Promise<{ message: string; data: Record<string, unknown[]> }> {
		const animalTypes = (await db.AnimalType.findAll({
			where: { animal_id: id },
			include: [
				{ model: db.Animal, as: 'Animal', attributes: ['id', 'name'] },
				{ model: db.Type, as: 'Type', attributes: ['id', 'type'] },
			],
			attributes: ['id', 'animal_id', 'type_id'],
			raw: true,
		})) as unknown as AnimalTypeRaw[]
		const grouped = groupBy(animalTypes, (row) => row['Animal.name'])
		return { message: 'Success', data: grouped }
	}

	static async getAllAnimalsWithTheirTypes(): Promise<{
		message: string
		data: Record<string, unknown[]>
	}> {
		const animalData = (await db.AnimalType.findAll({
			include: [
				{ model: db.Animal, as: 'Animal', attributes: ['id', 'name'] },
				{ model: db.Type, as: 'Type', attributes: ['id', 'type'] },
			],
			attributes: ['id', 'animal_id', 'type_id'],
			raw: true,
		})) as unknown as AnimalTypeRaw[]
		const grouped = groupBy(animalData, (row) => row['Animal.name'])
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
			where: { animal_id, user_id, status: false },
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
					created_at: new Date(),
					updated_at: new Date(),
				})),
			)
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
		// Use Promise.all for parallel updates
		await Promise.all(
			answers
				.filter((answer) => answer.animal_number !== answer.answer)
				.map((answer) =>
					db.AnimalQuestionAnswer.update(
						{ answer: answer.animal_number },
						{
							where: {
								question_id: 6,
								user_id,
								animal_number: answer.animal_number,
							},
						},
					),
				),
		)
		return true
	}

	static async farmAnimalCount(
		user_id: number,
	): Promise<{ animal_id: number; animal_name: string; count: number }[]> {
		const animals = await db.Animal.findAll({
			attributes: ['id', 'name'],
			raw: true,
		})
		// Get all counts in parallel
		return Promise.all(
			animals.map(async (animal) => {
				const count = await db.AnimalQuestionAnswer.count({
					where: { animal_id: animal.id, user_id, status: { [Op.ne]: 1 } },
					distinct: true,
					col: 'animal_number',
				})
				return { animal_id: animal.id, animal_name: animal.name, count }
			}),
		)
	}

	static async animalInfo(
		user_id: number,
		animal_id: number,
	): Promise<{ message: string; data: AnimalInfoResultAlias[] }> {
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
		const resData: AnimalInfoResultAlias[] = []
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
		return deleted
			? { message: 'Success', data: [] }
			: { message: 'Something went wrong. Please try again', data: [] }
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

		const questions = (await db.AnimalQuestions.findAll({
			where: { animal_id },
			include: buildInclude(language_id),
		})) as AQWithCQ[]

		const resData: Record<string, Record<string, unknown[]>> = {}
		for (const aq of questions) {
			const cq = aq.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			if (language_id) {
				const categoryName =
					cq.CategoryLanguage?.category_language_name || 'Uncategorized'
				const subCategoryName =
					cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
				pushToResult(resData, categoryName, subCategoryName, {
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
			} else {
				const categoryName = cq.Category?.name || 'Uncategorized'
				const subCategoryName = cq.Subcategory?.name || 'Uncategorized'
				pushToResult(resData, categoryName, subCategoryName, {
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
		}
		return { message: 'Success', data: resData }
	}

	// The following methods still use loops for sequential DB calls due to their logic,
	// but could be further optimized with more advanced queries if needed.
	private static async getGenderBreakdown(
		animal_id: number,
		user_id: number,
		animalNumbers: string[],
	): Promise<{ gender: Record<string, string[]>; cow1: number }> {
		const gender: Record<string, string[]> = {}
		let cow1 = 0
		await Promise.all(
			animalNumbers.map(async (animal_number) => {
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
			}),
		)
		return { gender, cow1 }
	}

	private static async getFemaleCount(
		animal_id: number,
		user_id: number,
		femaleNumbers: string[],
		cow1: number,
	): Promise<number> {
		let cow = 0
		await Promise.all(
			femaleNumbers.map(async (animal_number) => {
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
			}),
		)
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
		await Promise.all(
			heiferNumbers.map(async (value1) => {
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
			}),
		)
		const heiferCount = heiferData['calf'] ? heiferData['calf'].length : 0
		return heiferCount + heifer2
	}

	static async animalDetailsBasedOnAnimalType({
		animal_id,
		type,
		user_id,
	}: AnimalDetailsRequest): Promise<AnimalDetailsResponse> {
		const animalType = type.toLowerCase()
		if (animalType === 'cow' || animalType === 'buffalo') {
			return this._getCowOrBuffaloDetails(animal_id, animalType, user_id)
		}
		if (animalType === 'heifer') {
			return this._getHeiferDetails(animal_id, user_id)
		}
		if (animalType === 'bull') {
			return this._getBullDetails(animal_id, user_id)
		}
		return this._getOtherAnimalDetails(animal_id, user_id)
	}

	private static async _getCowOrBuffaloDetails(
		animal_id: number,
		animalType: string,
		user_id: number,
	): Promise<AnimalDetailsResponse> {
		const animalName = await db.Animal.findOne({
			where: { id: animal_id },
			attributes: ['name'],
			raw: true,
		})
		const animalNumbers = await this._getDistinctAnimalNumbers(
			animal_id,
			user_id,
		)
		let pregnantAnimal = 0
		let nonPregnantAnimal = 0
		let lactating = 0
		let nonLactating = 0
		const animal_data: AnimalData[] = []
		for (const animal_number of animalNumbers) {
			const sex = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				8,
			)
			if (
				!sex ||
				typeof sex.answer !== 'string' ||
				sex.answer.toLowerCase() !== 'male'
			)
				continue
			if (await this._isCalf(user_id, animal_id, animal_number)) continue
			const milkingStatus = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				16,
			)
			if (milkingStatus?.answer?.toLowerCase() === 'yes') {
				lactating++
			} else {
				nonLactating++
			}
			const DOB = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				9,
			)
			const weight = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				12,
			)
			const pregnancy = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				15,
			)
			if (
				pregnancy &&
				typeof pregnancy.answer === 'string' &&
				pregnancy.answer.toLowerCase() === 'yes'
			) {
				pregnantAnimal++
			} else {
				nonPregnantAnimal++
			}
			animal_data.push({
				animal_number,
				date_of_birth: DOB?.answer ?? null,
				weight: weight?.answer ?? null,
				lactating_status: milkingStatus?.answer ?? null,
				pregnant_status: pregnancy?.answer ?? null,
			})
		}
		return {
			animal_name: animalName?.name ?? animalType,
			pregnant_animal: pregnantAnimal,
			non_pregnant_animal: nonPregnantAnimal,
			lactating,
			nonLactating,
			animal_data,
		}
	}

	private static async _getHeiferDetails(
		animal_id: number,
		user_id: number,
	): Promise<AnimalDetailsResponse> {
		const animalName = await db.Animal.findOne({
			where: { id: animal_id },
			attributes: ['name'],
			raw: true,
		})
		const animalNumbers = await this._getDistinctAnimalNumbersByTag(
			animal_id,
			user_id,
			60,
		)
		let pregnantAnimal = 0
		let nonPregnantAnimal = 0
		const animal_data: AnimalData[] = []
		for (const animal_number of animalNumbers) {
			const heiferCalf = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				60,
			)
			if (!heiferCalf || heiferCalf.logic_value?.toLowerCase() !== 'calf')
				continue
			const sex = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				8,
			)
			if (sex?.answer?.toLowerCase() === 'male') continue
			const DOB = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				9,
			)
			const weight = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				12,
			)
			const pregnancy = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				15,
			)
			if (pregnancy?.answer?.toLowerCase() === 'yes') {
				pregnantAnimal++
			} else {
				nonPregnantAnimal++
			}
			animal_data.push({
				animal_number,
				date_of_birth: DOB?.answer ?? null,
				weight: weight?.answer ?? null,
				lactating_status: null,
				pregnant_status: pregnancy?.answer ?? null,
			})
		}
		return {
			animal_name: animalName?.name ?? 'heifer',
			pregnant_animal: pregnantAnimal,
			non_pregnant_animal: nonPregnantAnimal,
			animal_data,
		}
	}

	private static async _getBullDetails(
		animal_id: number,
		user_id: number,
	): Promise<AnimalDetailsResponse> {
		const animalNumbers = await this._getDistinctAnimalNumbers(
			animal_id,
			user_id,
		)
		const animal_data: AnimalData[] = []
		for (const animal_number of animalNumbers) {
			const sex = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				8,
			)
			if (
				!sex ||
				typeof sex.answer !== 'string' ||
				sex.answer.toLowerCase() !== 'male'
			)
				continue
			const DOB = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				9,
			)
			const weight = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				12,
			)
			animal_data.push({
				animal_number,
				date_of_birth: DOB?.answer ?? null,
				weight: weight?.answer ?? null,
				lactating_status: null,
				pregnant_status: null,
			})
		}
		return { animal_data }
	}

	private static async _getOtherAnimalDetails(
		animal_id: number,
		user_id: number,
	): Promise<AnimalDetailsResponse> {
		const animalNumbers = await this._getDistinctAnimalNumbers(
			animal_id,
			user_id,
		)
		const animal_data: AnimalData[] = []
		for (const animal_number of animalNumbers) {
			const DOB = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				9,
			)
			const weight = await this._getLatestAnswerByTag(
				user_id,
				animal_id,
				animal_number,
				12,
			)
			animal_data.push({
				animal_number,
				date_of_birth: DOB?.answer ?? null,
				weight: weight?.answer ?? null,
				lactating_status: null,
				pregnant_status: null,
			})
		}
		return { animal_data }
	}

	// --- Helper functions ---
	public static async _getLatestAnswerByTag(
		user_id: number,
		animal_id: number,
		animal_number: string,
		tag: number,
	): Promise<AnimalAnswerRecord | null> {
		// Find latest answer for a given tag
		const record = await db.AnimalQuestionAnswer.findOne({
			where: { user_id, animal_id, animal_number },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: tag },
					attributes: [],
				},
			],
			order: [['created_at', 'DESC']],
			raw: true,
		})
		return record as AnimalAnswerRecord | null
	}

	private static async _isCalf(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<boolean> {
		const record = await AnimalService._getLatestAnswerByTag(
			user_id,
			animal_id,
			animal_number,
			60,
		)
		return !!(
			record &&
			typeof record.logic_value === 'string' &&
			record.logic_value.toLowerCase() === 'calf'
		)
	}

	private static async _getDistinctAnimalNumbers(
		animal_id: number,
		user_id: number,
	): Promise<string[]> {
		const records: { animal_number: string }[] =
			await db.AnimalQuestionAnswer.findAll({
				where: { animal_id, user_id, status: { [Op.ne]: 1 } },
				attributes: [
					[
						db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
						'animal_number',
					],
				],
				raw: true,
			})
		return records.map((r) => r.animal_number)
	}

	private static async _getDistinctAnimalNumbersByTag(
		animal_id: number,
		user_id: number,
		tag: number,
	): Promise<string[]> {
		// For heifer, tag 60
		const records: { animal_number: string }[] =
			await db.AnimalQuestionAnswer.findAll({
				where: { animal_id, user_id, status: { [Op.ne]: 1 } },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: tag },
						attributes: [],
					},
				],
				attributes: [
					[
						db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
						'animal_number',
					],
				],
				raw: true,
			})
		return records.map((r) => r.animal_number)
	}

	private static async _getAIHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<AIHistoryItem[]> {
		const aiAnswers = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: { [Op.in]: [23, 35, 14, 42] } },
					attributes: ['question_tag'],
					required: true,
				},
			],
			attributes: ['answer', 'created_at'],
			order: [['created_at', 'DESC']],
			raw: true,
		})) as unknown as BreedingAnswerRaw[]

		const aiHistoryMap: Record<string, AIHistoryItem> = {}
		for (const item of aiAnswers) {
			const key = item.created_at.toISOString()
			if (!aiHistoryMap[key]) aiHistoryMap[key] = {}
			const tag = item['CommonQuestion.question_tag']
			if (tag === 23) aiHistoryMap[key].dateOfAI = item.answer
			else if (tag === 35) aiHistoryMap[key].bullNumber = item.answer
			else if (tag === 14) aiHistoryMap[key].motherYield = item.answer
			else if (tag === 42) aiHistoryMap[key].semenCompanyName = item.answer
		}
		return Object.values(aiHistoryMap)
	}

	private static async _getDeliveryHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<DeliveryHistoryItem[]> {
		const deliveryAnswers = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: { [Op.in]: [65, 66] } },
					attributes: ['question_tag'],
					required: true,
				},
			],
			attributes: ['answer', 'created_at'],
			order: [['created_at', 'DESC']],
			raw: true,
		})) as unknown as BreedingAnswerRaw[]

		const deliveryHistoryMap: Record<string, DeliveryHistoryItem> = {}
		for (const item of deliveryAnswers) {
			const key = item.created_at.toISOString()
			if (!deliveryHistoryMap[key]) deliveryHistoryMap[key] = {}
			const tag = item['CommonQuestion.question_tag']

			if (tag === 66) {
				deliveryHistoryMap[key].dateOfDelivery = item.answer
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
				deliveryHistoryMap[key].calfNumber = calf?.calf_animal_number ?? null
			} else if (tag === 65) {
				deliveryHistoryMap[key].typeOfDelivery = item.answer
			}
		}
		return Object.values(deliveryHistoryMap)
	}

	private static async _getHeatHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<HeatHistoryItem[]> {
		const heatAnswers = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 64 },
					attributes: [],
					required: true,
				},
			],
			attributes: ['answer'],
			order: [['created_at', 'DESC']],
			raw: true,
		})) as { answer: string }[]

		return heatAnswers.map((item) => ({ heatDate: item.answer }))
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
		const imageDir = path.join(process.cwd(), 'public', 'profile_img')
		const thumbDir = path.join(imageDir, 'thumb')
		if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true })
		const filename = file.filename
		// Create thumbnail
		await sharp(file.path)
			.resize(100, 100)
			.toFile(path.join(thumbDir, filename))
		// Check for existing image
		const existing = await AnimalImage.findOne({
			where: { user_id, animal_id, animal_number },
		})
		if (existing) {
			// Delete old files
			const oldImage = path.join(imageDir, existing.image)
			const oldThumb = path.join(thumbDir, existing.image)
			if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage)
			if (fs.existsSync(oldThumb)) fs.unlinkSync(oldThumb)
			existing.image = filename
			await existing.save()
		} else {
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
					},
					include: [{ model: db.Animal, as: 'Animal', attributes: ['name'] }],
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

	// Refactored _getLactationStats
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
			where: { user_id: user.id, animal_id, animal_number },
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
		const vaccinations = (await db.VaccinationDetail.findAll({
			where: { user_id: user.id },
			include: [
				{
					model: db.AnimalVaccination,
					as: 'AnimalVaccinations',
					where: { animal_number },
					attributes: [],
				},
				{
					model: db.UserVaccinationType,
					as: 'UserVaccinationTypes',
					attributes: [],
					include: [
						{
							model: db.VaccinationType,
							as: 'VaccinationType',
							attributes: ['type'],
						},
					],
				},
			],
			attributes: ['date'],
			raw: true,
		})) as unknown as VaccinationListRaw[]
		return vaccinations.map((v) => ({
			type: v['UserVaccinationTypes.VaccinationType.type'] ?? '',
			date: v.date ?? '',
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
			where: { user_id: user.id, animal_id, calf_animal_number: animal_number },
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
					},
				})) ?? 0) +
				((await db.DailyMilkRecord.sum('evening_milk_in_litres', {
					where: {
						user_id: user.id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
					},
				})) ?? 0)
			const dateOfAI = await db.AnimalQuestionAnswer.findOne({
				where: {
					user_id: user.id,
					animal_id,
					animal_number: motherNo.mother_animal_number,
					status: { [Op.ne]: 1 },
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 23 },
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
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 35 },
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
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 42 },
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
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 14 },
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
			where: { user_id: user.id, animal_id, animal_number },
			raw: true,
		})
		return {
			image: animalImage?.image ? `/profile_img/${animalImage.image}` : '',
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
				animal_type: general.animalType['Animal.name'] ?? '',
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
}
