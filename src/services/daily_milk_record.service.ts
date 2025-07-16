import db from '@/config/database'
import { User } from '@/models/user.model'
import type { ModelStatic } from 'sequelize'
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
			1,
			user,
			AnimalQuestionAnswer,
			'The selected cows_daily_milk_data animal_number is invalid.',
			errors,
			records,
		)

		await this.validateAndCollectRecords(
			data.buffalos_daily_milk_data,
			2,
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
}
