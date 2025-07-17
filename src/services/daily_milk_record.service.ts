import db from '@/config/database'
import { User } from '@/models/user.model'
import { ModelStatic, Op } from 'sequelize'
import { AnimalQuestionAnswer } from '@/models/animal_question_answers.model'

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

// Add animal type constants at the top for clarity
export const ANIMAL_ID_COW = 1
export const ANIMAL_ID_BUFFALO = 2

export class DailyMilkRecordService {
	private static async validateAndCollectRecords(
		animalData: MilkDataInput[] | undefined,
		animalTypeId: number,
		user: User,
		AnimalQuestionAnswer: ModelStatic<AnimalQuestionAnswer>,
		errorMsg: string,
		errors: string[],
		records: MilkDataInput[],
	): Promise<void> {
		if (animalData && animalData.length > 0) {
			for (const animal of animalData) {
				const exists = await AnimalQuestionAnswer.findOne({
					where: {
						animal_number: animal.animal_number,
						animal_id: animalTypeId,
						user_id: user.id,
					},
				})
				if (!exists) {
					errors.push(errorMsg)
					continue
				}
				records.push({
					animal_id: animal.animal_id,
					animal_number: animal.animal_number,
					morning_milk_in_litres: animal.morning_milk_in_litres,
					evening_milk_in_litres: animal.evening_milk_in_litres,
				})
			}
		}
	}

	static async saveDailyMilkRecord(
		user: User,
		data: SaveDailyMilkRecordInput,
	): Promise<SaveDailyMilkRecordResult> {
		const { DailyMilkRecord, AnimalQuestionAnswer } = db
		const errors: string[] = []
		const records: MilkDataInput[] = []

		await this.validateAndCollectRecords(
			data.cows_daily_milk_data,
			ANIMAL_ID_COW,
			user,
			AnimalQuestionAnswer,
			'The selected cows_daily_milk_data animal_number is invalid.',
			errors,
			records,
		)

		await this.validateAndCollectRecords(
			data.buffalos_daily_milk_data,
			ANIMAL_ID_BUFFALO,
			user,
			AnimalQuestionAnswer,
			'The selected buffalos_daily_milk_data animal_number is invalid.',
			errors,
			records,
		)

		if (errors.length > 0) {
			return { success: false, message: errors.join(' '), data: [] }
		}
		if (records.length > 0) {
			await DailyMilkRecord.bulkCreate(
				records.map((record) => ({
					user_id: user.id,
					animal_id: record.animal_id,
					animal_number: record.animal_number,
					morning_milk_in_litres: record.morning_milk_in_litres,
					evening_milk_in_litres: record.evening_milk_in_litres,
					record_date: new Date(data.record_date),
				})),
			)
		}
		return { success: true, message: 'Added successfully.', data: [] }
	}

	static async updateDailyMilkRecord(
		user: User,
		date: string,
		data: SaveDailyMilkRecordInput,
	): Promise<SaveDailyMilkRecordResult> {
		const { DailyMilkRecord } = db
		await DailyMilkRecord.destroy({
			where: {
				user_id: user.id,
				record_date: new Date(date),
			},
		})
		return this.saveDailyMilkRecord(user, { ...data, record_date: date })
	}

	// Helper: Get all lactating animal numbers for this user
	private static async getLactatingAnimals(
		user: User,
	): Promise<{ animal_number: string; animal_id: number }[]> {
		return db.AnimalQuestionAnswer.findAll({
			where: {
				user_id: user.id,
				status: { [Op.ne]: 1 },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 16 },
					required: true,
				},
				{
					model: db.Animal,
					as: 'Animal',
					required: true,
				},
			],
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
				'animal_id',
			],
			raw: true,
		}) as Promise<{ animal_number: string; animal_id: number }[]>
	}

	// Helper: Build result item
	private static buildResultItem(
		animal: { animal_number: string; animal_id: number },
		milkRecord: {
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: string
		},
	): DailyMilkRecordResultItem {
		return {
			animal_number: animal.animal_number,
			animal_id: animal.animal_id,
			morning_milk_in_litres: milkRecord.morning_milk_in_litres ?? 0,
			evening_milk_in_litres: milkRecord.evening_milk_in_litres ?? 0,
			total_milk_in_litres:
				(milkRecord.morning_milk_in_litres ?? 0) +
				(milkRecord.evening_milk_in_litres ?? 0),
		}
	}

	// Helper: Batch fetch and map latest lactation statuses
	private static async batchFetchLactationStatuses(
		user: User,
		animalNumbers: string[],
		dbDate: string,
	): Promise<
		Map<
			string,
			{
				animal_id: number
				animal_number: string
				lactating_status?: string | null
			}
		>
	> {
		const raw = (await db.AnimalLactationYieldHistory.findAll({
			where: {
				user_id: user.id,
				animal_number: animalNumbers,
				date: { [Op.lte]: dbDate },
			},
			order: [
				['animal_number', 'ASC'],
				['date', 'DESC'],
			],
			raw: true,
		})) as Array<{
			animal_id: number
			animal_number: string
			lactating_status?: string | null
			date: Date | null
		}>
		const map = new Map<
			string,
			{
				animal_id: number
				animal_number: string
				lactating_status?: string | null
			}
		>()
		for (const row of raw) {
			if (!map.has(row.animal_number)) {
				map.set(row.animal_number, {
					animal_id: row.animal_id,
					animal_number: row.animal_number,
					lactating_status: row.lactating_status,
				})
			}
		}
		return map
	}

	// Helper: Batch fetch and map latest gender answers
	private static async batchFetchLatestGenders(
		user: User,
		animalIds: number[],
		animalNumbers: string[],
	): Promise<Map<string, string>> {
		const raw = (await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id: user.id,
				animal_id: animalIds,
				animal_number: animalNumbers,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 8 },
					required: true,
				},
			],
			order: [
				['animal_number', 'ASC'],
				['created_at', 'DESC'],
			],
			raw: true,
		})) as Array<{
			animal_id: number
			animal_number: string
			answer?: string
			created_at: Date
		}>
		const map = new Map<string, string>()
		for (const row of raw) {
			if (!map.has(row.animal_number)) {
				map.set(row.animal_number, row.answer?.toLowerCase() ?? '')
			}
		}
		return map
	}

	// Helper: Batch fetch and map milk records
	private static async batchFetchMilkRecords(
		user: User,
		animalNumbers: string[],
		dbDate: string,
	): Promise<
		Map<
			string,
			{
				morning_milk_in_litres: number
				evening_milk_in_litres: number
				record_date: string
			}
		>
	> {
		const raw = (await db.DailyMilkRecord.findAll({
			where: {
				user_id: user.id,
				animal_number: animalNumbers,
				record_date: dbDate,
			},
			raw: true,
		})) as Array<{
			animal_number: string
			animal_id: number
			morning_milk_in_litres: number
			evening_milk_in_litres: number
			record_date: Date
		}>
		const map = new Map<
			string,
			{
				morning_milk_in_litres: number
				evening_milk_in_litres: number
				record_date: string
			}
		>()
		for (const row of raw) {
			map.set(row.animal_number, {
				morning_milk_in_litres: row.morning_milk_in_litres,
				evening_milk_in_litres: row.evening_milk_in_litres,
				record_date: row.record_date
					? row.record_date.toISOString().slice(0, 10)
					: '',
			})
		}
		return map
	}

	// Helper: Build result arrays and totals
	private static buildMilkRecordResult(
		lactating: { animal_number: string; animal_id: number }[],
		latestLactationStatus: Map<
			string,
			{
				animal_id: number
				animal_number: string
				lactating_status?: string | null
			}
		>,
		latestGender: Map<string, string>,
		milkRecordsMap: Map<
			string,
			{
				morning_milk_in_litres: number
				evening_milk_in_litres: number
				record_date: string
			}
		>,
	): {
		cows: DailyMilkRecordResultItem[]
		buffalos: DailyMilkRecordResultItem[]
		record_date: string
		total_morning: number
		total_evening: number
	} {
		const cows: DailyMilkRecordResultItem[] = []
		const buffalos: DailyMilkRecordResultItem[] = []
		let record_date = ''
		let total_morning = 0
		let total_evening = 0
		for (const animal of lactating) {
			const milkingStatus = latestLactationStatus.get(animal.animal_number)
			if (!milkingStatus) continue
			const gender = latestGender.get(animal.animal_number)
			if (gender !== 'female') continue
			if (milkingStatus.lactating_status?.toLowerCase() !== 'yes') continue
			const milkRecord = milkRecordsMap.get(animal.animal_number)
			if (!milkRecord) continue
			const item = this.buildResultItem(animal, milkRecord)
			record_date = milkRecord.record_date
			if (animal.animal_id === ANIMAL_ID_COW) {
				cows.push(item)
				total_morning += item.morning_milk_in_litres
				total_evening += item.evening_milk_in_litres
			} else if (animal.animal_id === ANIMAL_ID_BUFFALO) {
				buffalos.push(item)
				total_morning += item.morning_milk_in_litres
				total_evening += item.evening_milk_in_litres
			}
		}
		return { cows, buffalos, record_date, total_morning, total_evening }
	}

	static async getDailyMilkRecord(
		user: User,
		date?: string,
	): Promise<GetDailyMilkRecordResult> {
		const dbDate = date || new Date().toISOString().slice(0, 10)
		const lactating = await this.getLactatingAnimals(user)
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
		const animalNumbers = lactating.map((a) => a.animal_number)
		const animalIds = lactating.map((a) => a.animal_id)
		const [latestLactationStatus, latestGender, milkRecordsMap] =
			await Promise.all([
				this.batchFetchLactationStatuses(user, animalNumbers, dbDate),
				this.batchFetchLatestGenders(user, animalIds, animalNumbers),
				this.batchFetchMilkRecords(user, animalNumbers, dbDate),
			])
		const { cows, buffalos, record_date, total_morning, total_evening } =
			this.buildMilkRecordResult(
				lactating,
				latestLactationStatus,
				latestGender,
				milkRecordsMap,
			)
		return {
			cows_daily_milk_data: cows,
			buffalos_daily_milk_data: buffalos,
			record_date,
			total_morning,
			total_evening,
			total_day_milk: total_morning + total_evening,
		}
	}
}
