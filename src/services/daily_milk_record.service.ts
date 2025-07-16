import db from '@/config/database'
import { User } from '@/models/user.model'

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
	static async saveDailyMilkRecord(
		user: User,
		data: SaveDailyMilkRecordInput,
	): Promise<SaveDailyMilkRecordResult> {
		const { DailyMilkRecord, AnimalQuestionAnswer } = db
		const errors: string[] = []
		const records: MilkDataInput[] = []

		if (data.cows_daily_milk_data && data.cows_daily_milk_data.length > 0) {
			for (const cow of data.cows_daily_milk_data) {
				const exists = await AnimalQuestionAnswer.findOne({
					where: {
						animal_number: cow.animal_number,
						animal_id: 1,
						user_id: user.id,
					},
				})
				if (!exists) {
					errors.push(
						'The selected cows_daily_milk_data animal_number is invalid.',
					)
					continue
				}
				records.push({
					animal_id: cow.animal_id,
					animal_number: cow.animal_number,
					morning_milk_in_litres: cow.morning_milk_in_litres,
					evening_milk_in_litres: cow.evening_milk_in_litres,
				})
			}
		}

		if (
			data.buffalos_daily_milk_data &&
			data.buffalos_daily_milk_data.length > 0
		) {
			for (const buffalo of data.buffalos_daily_milk_data) {
				const exists = await AnimalQuestionAnswer.findOne({
					where: {
						animal_number: buffalo.animal_number,
						animal_id: 2,
						user_id: user.id,
					},
				})
				if (!exists) {
					errors.push(
						'The selected buffalos_daily_milk_data animal_number is invalid.',
					)
					continue
				}
				records.push({
					animal_id: buffalo.animal_id,
					animal_number: buffalo.animal_number,
					morning_milk_in_litres: buffalo.morning_milk_in_litres,
					evening_milk_in_litres: buffalo.evening_milk_in_litres,
				})
			}
		}

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
