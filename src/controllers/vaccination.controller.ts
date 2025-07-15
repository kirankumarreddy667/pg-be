import { RequestHandler } from 'express'
import VaccinationService from '../services/vaccination.service'
import RESPONSE from '@/utils/response'
import { User } from '@/models'
import db from '@/config/database'
import { Op } from 'sequelize'

export class VaccinationController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const userId = Number((req.user as User)?.id)
			const vaccination = req.body as {
				vaccination_type_ids: number[]
				animal_numbers: string[]
				vaccination_date: string
				expense: number
			}

			const foundTypes = await db.VaccinationType.findAll({
				where: { id: { [Op.in]: vaccination.vaccination_type_ids } },
			})
			const foundTypeIds = foundTypes.map((type) => type.get('id'))
			const missingTypeIds = vaccination.vaccination_type_ids.filter(
				(id: number) => !foundTypeIds.includes(id),
			)
			if (missingTypeIds.length > 0) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						vaccination_type_ids: [
							`Invalid vaccination_type_ids: ${missingTypeIds.join(', ')}`,
						],
					},
				})
			}

			// Existence check for animal_numbers
			const foundAnimals = await db.AnimalQuestionAnswer.findAll({
				where: { animal_number: { [Op.in]: vaccination.animal_numbers } },
				attributes: ['animal_number'],
			})
			const foundAnimalNumbers = foundAnimals.map((animal) =>
				animal.get('animal_number'),
			)
			const missingAnimalNumbers = vaccination.animal_numbers.filter(
				(num: string) => !foundAnimalNumbers.includes(num),
			)
			if (missingAnimalNumbers.length > 0) {
				return RESPONSE.FailureResponse(res, 422, {
					message: 'The given data was invalid.',
					errors: {
						animal_numbers: [
							`Invalid animal_numbers: ${missingAnimalNumbers.join(', ')}`,
						],
					},
				})
			}

			const data = req.body as {
				expense: number
				record_date: Date
				animal_numbers: string[]
				vaccination_type_ids: number[]
			}
			const result = await VaccinationService.create(userId, data)
			RESPONSE.SuccessResponse(res, 201, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly listAllType: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const result = await VaccinationService.listAllType()
			RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}
}
