import { VaccinationDetail } from '../models/vaccination_detail.model'
import { AnimalVaccination } from '../models/animal_vaccination.model'
import { UserVaccinationType } from '../models/user_vaccination_type.model'
import { VaccinationType } from '../models/vaccination_type.model'

export default class VaccinationService {
	static async create(
		userId: number,
		data: {
			expense: number
			record_date: string
			animal_numbers: string[]
			vaccination_type_ids: number[]
		},
	): Promise<void> {
		const detail = await VaccinationDetail.create({
			user_id: userId,
			expense: data.expense,
			date: new Date(data.record_date),
		})

		if (Array.isArray(data.animal_numbers)) {
			for (const animalNumber of data.animal_numbers) {
				await AnimalVaccination.create({
					vaccination_id: detail.id,
					animal_number: animalNumber,
				})
			}
		}

		if (Array.isArray(data.vaccination_type_ids)) {
			for (const typeId of data.vaccination_type_ids) {
				await UserVaccinationType.create({
					vaccination_id: detail.id,
					type_id: typeId,
				})
			}
		}
	}

	static async listAllType(): Promise<{
		message: string
		data: { id: number; type: string }[]
	}> {
		const resData = await VaccinationType.findAll({
			where: { deleted_at: null },
			attributes: ['id', 'type'],
		})
		return {
			message: 'Success',
			data: resData.map((row) => row.toJSON()),
		}
	}
}
