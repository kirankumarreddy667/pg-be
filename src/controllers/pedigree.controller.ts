import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { PedigreeService } from '@/services/pedigree.service'
import type { User } from '@/types/index'

export class PedigreeController {
	public static readonly getAnimalPedigree: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const animal_id = Number(req.params.animal_id)
			const animal_number = req.params.animal_number
			const data = await PedigreeService.getPedigree(
				user,
				animal_id,
				animal_number,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAnimalFamilyRecord: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const animal_id = Number(req.params.animal_id)
			const animal_number = req.params.animal_number
			const data = await PedigreeService.getFamilyRecord(
				user,
				animal_id,
				animal_number,
			)
			return RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}
}
