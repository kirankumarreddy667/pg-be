import { RequestHandler } from 'express'
import VaccinationService from '../services/vaccination.service'
import RESPONSE from '@/utils/response'
import { User } from '@/models'
import db from '@/config/database'
import { Op } from 'sequelize'
import { ValidationRequestError } from '@/utils/errors'

export class VaccinationController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const userId = Number((req.user as User)?.id)

			const vaccination = req.body as {
				vaccination_type_ids: number[]
				animal_numbers: string[]
				record_date: string
				expense: number
			}

			// Validate vaccination_type_ids
			const foundTypes = await db.VaccinationType.findAll({
				where: {
					id: { [Op.in]: vaccination.vaccination_type_ids },
					deleted_at: null,
				},
			})
			const foundTypeIds = new Set(foundTypes.map((type) => type.get('id')))
			const missingTypeIds = vaccination.vaccination_type_ids.filter(
				(id: number) => !foundTypeIds.has(id),
			)
			if (missingTypeIds.length > 0) {
				throw new ValidationRequestError({
					vaccination_type_ids: [
						'The selected vaccination type ids is invalid.',
					],
				})
			}

			// Validate animal_numbers
			const foundAnimals = await db.AnimalQuestionAnswer.findAll({
				where: {
					animal_number: { [Op.in]: vaccination.animal_numbers },
					deleted_at: null,
				},
				attributes: ['animal_number'],
			})
			const foundAnimalNumbers = new Set(
				foundAnimals.map((animal) => animal.get('animal_number')),
			)
			const missingAnimalNumbers = vaccination.animal_numbers.filter(
				(num: string) => !foundAnimalNumbers.has(num),
			)
			if (missingAnimalNumbers.length > 0) {
				throw new ValidationRequestError({
					animal_numbers: ['The selected animal numbers is invalid.'],
				})
			}
			await VaccinationService.create(userId, vaccination)
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Vaccination detail added successfully',
			})
		} catch (error) {
			return next(error)
		}
	}

	public static readonly listAllType: RequestHandler = async (
		_req,
		res,
		next,
	) => {
		try {
			const result = await VaccinationService.listAllType()
			return RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			return next(error)
		}
	}
}
