import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { AnimalService } from '@/services/animal.service'

export class AnimalController {
	static addAnimal: RequestHandler = async (req, res, next): Promise<void> => {
		try {
			await AnimalService.create(
				req.body as {
					name: string
					language_id: number
				},
			)
			RESPONSE.SuccessResponse(res, 201, {
				message: 'Animal added successfully',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static updateAnimalDetails: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id = Number(req.params.id)
			await AnimalService.update(
				id,
				req.body as {
					name: string
					language_id: number
				},
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Animal details updated successfully',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	static deleteAnimal: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id = Number(req.params.id)
			const deleted = await AnimalService.delete(id)
			if (deleted) {
				RESPONSE.SuccessResponse(res, 200, {
					message: 'Animal deleted successfully',
					data: [],
				})
			} else {
				RESPONSE.FailureResponse(res, 400, {
					message: 'Something went wrong. Please try again',
					data: [],
				})
			}
		} catch (error) {
			next(error)
		}
	}

	static getAnimalById: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id = Number(req.params.id)
			const animal = await AnimalService.findById(id)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: animal,
			})
		} catch (error) {
			next(error)
		}
	}

	static addTypeOfAnAnimal: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const result = await AnimalService.addTypeOfAnAnimal(
				req.body as { animal_id: number; type_id: number },
			)
			RESPONSE.SuccessResponse(res, 201, { message: result.message, data: [] })
		} catch (error) {
			next(error)
		}
	}

	static getTypesOfAnAnimal: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id = Number(req.params.id)
			const result = await AnimalService.getTypesOfAnAnimal(id)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	static getAllAnimalsWithTheirTypes: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const result = await AnimalService.getAllAnimalsWithTheirTypes()
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	static deleteAnimalType: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const id = Number(req.params.animal_type_id)
			const animalType = await AnimalService.findAnimalTypeById(id)
			if (!animalType)
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Animal type not found',
					data: [],
				})
			const result = await AnimalService.deleteAnimalType(id)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}
}
