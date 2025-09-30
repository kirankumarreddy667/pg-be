import db from '@/config/database'
import { User } from '@/models/user.model'
import { Op, QueryTypes, Transaction } from 'sequelize'
import { ValidationRequestError } from '@/utils/errors'

export interface MilkDataInput {
	animal_id: number
	animal_number: string
	morning_milk_in_litres: number
	evening_milk_in_litres: number
}

export interface SaveDailyMilkRecordInput {
	record_date: string
	cows_daily_milk_data?: MilkDataInput[]
	buffalos_daily_milk_data?: MilkDataInput[]
}

export interface SaveDailyMilkRecordResult {
	success: boolean
	message: string
	data: unknown[]
}

export interface DailyMilkRecordResultItem {
	animal_number: string
	animal_id: number
	morning_milk_in_litres: number
	evening_milk_in_litres: number
	total_milk_in_litres: number
}

export interface GetDailyMilkRecordResult {
	cows_daily_milk_data: DailyMilkRecordResultItem[]
	buffalos_daily_milk_data: DailyMilkRecordResultItem[]
	record_date: string
	total_morning: number
	total_evening: number
	total_day_milk: number
}

// Add animal type constants
export const ANIMAL_ID_COW = 1
export const ANIMAL_ID_BUFFALO = 2

export class DailyMilkRecordService {
	private static async validateAnimalsData(
		user: User,
		animalData: Array<{
			animal_id: number
			animal_number: string
		}>,
		dataType: string,
	): Promise<void> {
		if (!animalData || animalData.length === 0) return

		const animalIds = animalData.map((item) => item.animal_id)
		const animalNumbers = animalData.map((item) => item.animal_number)

		const animals = await db.Animal.findAll({
			where: {
				id: animalIds,
				deleted_at: null,
			},
			attributes: ['id'],
		})

		const validAnimalIds = new Set(animals.map((animal) => animal.get('id')))

		const animalNumberRecords = await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_number: animalNumbers,
				animal_id: animalIds,
				user_id: user.id,
				deleted_at: null,
				status: 0,
			},
			attributes: ['animal_id', 'animal_number'],
		})

		const validAnimalNumberPairs = new Set(
			animalNumberRecords.map(
				(record) => `${record.get('animal_id')}-${record.get('animal_number')}`,
			),
		)

		const errors: Record<string, string[]> = {}

		animalData.forEach((item, index) => {
			if (!validAnimalIds.has(item.animal_id)) {
				errors[`${dataType}.${index}.animal_id`] = [
					`The selected ${dataType}.${index}.animal_id is invalid.`,
				]
			}

			const pairKey = `${item.animal_id}-${item.animal_number}`
			if (!validAnimalNumberPairs.has(pairKey)) {
				errors[`${dataType}.${index}.animal_number`] = [
					`The selected ${dataType}.${index}.animal_number is invalid.`,
				]
			}
		})

		if (Object.keys(errors).length > 0) {
			throw new ValidationRequestError(errors)
		}
	}

	private static buildMilkRecords(
		user: User,
		data: SaveDailyMilkRecordInput,
	): Array<{
		user_id: number
		animal_id: number
		animal_number: string
		morning_milk_in_litres: number
		evening_milk_in_litres: number
		record_date: Date
	}> {
		const records: Array<{
			user_id: number
			animal_id: number
			animal_number: string
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: Date
		}> = []

		const recordDate = new Date(data.record_date)

		// Process cows data
		if (data?.cows_daily_milk_data && data?.cows_daily_milk_data?.length > 0) {
			records.push(
				...data.cows_daily_milk_data.map((cow) => ({
					user_id: user.id,
					animal_id: cow.animal_id,
					animal_number: cow.animal_number,
					morning_milk_in_litres: cow.morning_milk_in_litres,
					evening_milk_in_litres: cow.evening_milk_in_litres,
					record_date: recordDate,
				})),
			)
		}

		// Process buffalos data
		if (
			data?.buffalos_daily_milk_data &&
			data?.buffalos_daily_milk_data?.length > 0
		) {
			records.push(
				...data.buffalos_daily_milk_data.map((buffalo) => ({
					user_id: user.id,
					animal_id: buffalo.animal_id,
					animal_number: buffalo.animal_number,
					morning_milk_in_litres: buffalo.morning_milk_in_litres,
					evening_milk_in_litres: buffalo.evening_milk_in_litres,
					record_date: recordDate,
				})),
			)
		}

		return records
	}

	private static async processDailyMilkRecord(
		user: User,
		data: SaveDailyMilkRecordInput,
	): Promise<
		Array<{
			user_id: number
			animal_id: number
			animal_number: string
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: Date
		}>
	> {
		// Validate cows data
		await this.validateAnimalsData(
			user,
			data.cows_daily_milk_data || [],
			'cows_daily_milk_data',
		)

		// Validate buffalos data
		await this.validateAnimalsData(
			user,
			data.buffalos_daily_milk_data || [],
			'buffalos_daily_milk_data',
		)

		// Build records array
		return this.buildMilkRecords(user, data)
	}

	// Save daily milk record
	public static async saveDailyMilkRecord(
		user: User,
		data: SaveDailyMilkRecordInput,
	): Promise<void> {
		const records = await this.processDailyMilkRecord(user, data)

		if (records.length > 0) {
			await db.DailyMilkRecord.bulkCreate(records)
		}
	}

	// Update daily milk record
	public static async updateDailyMilkRecord(
		user: User,
		date: string,
		data: SaveDailyMilkRecordInput,
		transaction: Transaction,
	): Promise<void> {
		const records = await this.processDailyMilkRecord(user, data)

		// Delete existing records for the date
		await db.DailyMilkRecord.destroy({
			where: {
				user_id: user.id,
				record_date: new Date(date),
				deleted_at: null,
			},
			transaction,
		})

		// Create new records
		if (records.length > 0) {
			await db.DailyMilkRecord.bulkCreate(records, { transaction })
		}
	}

	// Get daily milk record
	public static async getDailyMilkRecord(
		user: User,
		date?: string,
	): Promise<GetDailyMilkRecordResult> {
		await this.checkAndInsertLactatingYield(user)

		const dbDate = date || new Date().toISOString().slice(0, 10)
		const lactating = await this.getLactatingAnimals(user.id)

		if (lactating.length === 0) {
			return {
				cows_daily_milk_data: [],
				buffalos_daily_milk_data: [],
				record_date: dbDate,
				total_morning: 0,
				total_evening: 0,
				total_day_milk: 0,
			}
		}

		const lactatingAnimal: {
			animal_id: number
			animal_number: string
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: string
		}[] = []

		for (const animal of lactating) {
			const milkingStatus = await this.getMilkingStatusForAnimal(
				user.id,
				animal.animal_number,
				dbDate,
				date,
			)

			if (milkingStatus) {
				const animalGender = await this.getLastQuestionAnswerByQuestionTag(
					milkingStatus.animal_id,
					animal.animal_number,
					8,
					user.id,
				)

				if (animalGender && animalGender.answer.toLowerCase() === 'female') {
					if (milkingStatus.lactating_status?.toLowerCase() === 'yes') {
						lactatingAnimal.push(milkingStatus)
					}
				}
			}
		}

		return this.buildResultFromLactatingAnimals(lactatingAnimal)
	}
	private static async checkAndInsertLactatingYield(
		user: User,
	): Promise<boolean> {
		const userDetails = await db.User.findOne({
			where: {
				id: user.id,
				deleted_at: null,
			},
			raw: true,
			attributes: ['record_milk_refresh'],
		})

		if (!userDetails || userDetails.record_milk_refresh !== null) {
			return true
		}

		const animalNumbers = (await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id: user.id,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
				'animal_id',
			],
			raw: true,
		})) as Array<{ animal_number: string; animal_id: number }>

		if (animalNumbers && animalNumbers.length > 0) {
			const insertPromises = animalNumbers.map(async (value) => {
				const yieldExists = await this.animalGestationHistory(
					value.animal_id,
					value.animal_number,
					user.id,
				)

				if (!yieldExists) {
					const lactation = await this.instantOfQuestionAnswerByQuestionTag(
						value.animal_id,
						value.animal_number,
						16,
						user.id,
					)

					if (lactation) {
						const dateOfBirth = await this.getLastQuestionAnswerByQuestionTag(
							value.animal_id,
							value.animal_number,
							9,
							user.id,
						)

						const date = dateOfBirth
							? dateOfBirth.answer
							: new Date(lactation.created_at).toISOString().slice(0, 10)

						const pregnancyStatus =
							await this.getLastQuestionAnswerByQuestionTag(
								value.animal_id,
								value.animal_number,
								15,
								user.id,
							)

						const lactationYield = {
							user_id: user.id,
							animal_id: value.animal_id,
							animal_number: value.animal_number,
							date: date ? new Date(date) : null,
							pregnancy_status: pregnancyStatus ? pregnancyStatus.answer : null,
							lactating_status: lactation.answer,
							created_at: lactation.created_at,
							updated_at: new Date(),
						}

						return db.AnimalLactationYieldHistory.create(lactationYield)
					}
				}
				return null
			})

			await Promise.all(insertPromises)
		}

		await db.User.update(
			{ record_milk_refresh: 'Yes' },
			{ where: { id: user.id } },
		)

		return true
	}
	private static async animalGestationHistory(
		animalId: number,
		animalNumber: string,
		userId: number,
	): Promise<boolean> {
		const result = await db.AnimalLactationYieldHistory.findOne({
			where: {
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				deleted_at: null,
			},
		})

		return !!result
	}
	private static async instantOfQuestionAnswerByQuestionTag(
		animalId: number,
		animalNumber: string,
		questionTag: number,
		userId: number,
	): Promise<{ answer: string; created_at: Date } | null> {
		const result = (await db.AnimalQuestionAnswer.findOne({
			where: {
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: {
						question_tag: questionTag,
						deleted_at: null,
					},
					required: true,
				},
			],
			order: [['created_at', 'DESC']],
			raw: true,
		})) as unknown as { answer: string; created_at: Date }

		return result
			? { answer: result.answer, created_at: new Date(result?.created_at) }
			: null
	}
	private static async getLastQuestionAnswerByQuestionTag(
		animalId: number,
		animalNumber: string,
		questionTag: number,
		userId: number,
	): Promise<{ answer: string } | null> {
		const result = await db.AnimalQuestionAnswer.findOne({
			where: {
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: {
						question_tag: questionTag,
						deleted_at: null,
					},
					required: true,
				},
			],
			order: [['created_at', 'DESC']],
			raw: true,
		})

		return result ? { answer: result.answer } : null
	}
	private static async getLactatingAnimals(
		userId: number,
	): Promise<{ animal_number: string }[]> {
		return (await db.sequelize.query(
			`
		SELECT DISTINCT(aqa.animal_number) as animal_number
		FROM common_questions cq
		INNER JOIN animal_question_answers aqa ON aqa.question_id = cq.id
		INNER JOIN animals a ON a.id = aqa.animal_id
		WHERE aqa.user_id = :userId
		AND cq.question_tag = 16
		AND aqa.status != 1
		AND cq.deleted_at IS NULL
		AND aqa.deleted_at IS NULL
		AND a.deleted_at IS NULL
	`,
			{
				replacements: { userId },
				type: QueryTypes.SELECT,
			},
		)) as unknown as Promise<{ animal_number: string }[]>
	}
	private static async getMilkingStatusForAnimal(
		userId: number,
		animalNumber: string,
		dbDate: string,
		requestDate?: string,
	): Promise<{
		animal_id: number
		animal_number: string
		lactating_status: string
		morning_milk_in_litres: number
		evening_milk_in_litres: number
		record_date: string
	} | null> {
		const dateCondition = requestDate
			? 'AND dmr.record_date = :requestDate'
			: ''

		const query = `
		SELECT 
			aly.animal_id,
			aly.animal_number,
			aly.lactating_status,
			dmr.morning_milk_in_litres,
			dmr.evening_milk_in_litres,
			dmr.record_date
		FROM animal_lactation_yield_history aly
		LEFT JOIN daily_milk_records dmr ON (
			dmr.animal_number = aly.animal_number
			AND dmr.user_id = :userId
			${dateCondition}
			AND dmr.deleted_at IS NULL
		)
		WHERE aly.user_id = :userId
		AND aly.animal_number = :animalNumber
		AND aly.date <= :dbDate
		AND aly.deleted_at IS NULL
		ORDER BY aly.date DESC
		LIMIT 1
	`

		const results = (await db.sequelize.query(query, {
			replacements: {
				userId,
				animalNumber,
				dbDate,
				...(requestDate && { requestDate }),
			},
			type: QueryTypes.SELECT,
		})) as unknown as {
			animal_id: number
			animal_number: string
			lactating_status: string
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: string
		}[]

		return results.length > 0 ? results[0] : null
	}
	private static buildResultFromLactatingAnimals(
		lactatingAnimal: {
			animal_id: number
			animal_number: string
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: string
		}[],
	): GetDailyMilkRecordResult {
		const cows: DailyMilkRecordResultItem[] = []
		const buffalos: DailyMilkRecordResultItem[] = []
		let record_date = ''
		let total_morning = 0
		let total_evening = 0

		// Exact PHP foreach logic
		for (const item of lactatingAnimal) {
			if (item.record_date) {
				record_date = item.record_date
			}

			const morningMilk = item.morning_milk_in_litres ?? 0
			const eveningMilk = item.evening_milk_in_litres ?? 0

			const animalData = {
				animal_number: item.animal_number,
				animal_id: item.animal_id,
				morning_milk_in_litres: morningMilk,
				evening_milk_in_litres: eveningMilk,
				total_milk_in_litres: morningMilk + eveningMilk,
			}

			if (item.animal_id === ANIMAL_ID_COW) {
				cows.push(animalData)
				total_morning += morningMilk
				total_evening += eveningMilk
			} else if (item.animal_id === ANIMAL_ID_BUFFALO) {
				buffalos.push(animalData)
				total_morning += morningMilk
				total_evening += eveningMilk
			}
		}

		return {
			cows_daily_milk_data: cows,
			buffalos_daily_milk_data: buffalos,
			record_date: record_date,
			total_morning: total_morning,
			total_evening: total_evening,
			total_day_milk: total_morning + total_evening,
		}
	}
}
