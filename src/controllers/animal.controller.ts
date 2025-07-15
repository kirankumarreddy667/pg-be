import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { AnimalService } from '@/services/animal.service'
import type { User } from '@/types/index'

export class AnimalController {
	public static readonly addAnimal: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
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

	public static readonly updateAnimalDetails: RequestHandler = async (
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

	public static readonly deleteAnimal: RequestHandler = async (
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

	public static readonly getAnimalById: RequestHandler = async (
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

	public static readonly addTypeOfAnAnimal: RequestHandler = async (
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

	public static readonly getTypesOfAnAnimal: RequestHandler = async (
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

	public static readonly getAllAnimalsWithTheirTypes: RequestHandler = async (
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

	public static readonly deleteAnimalType: RequestHandler = async (
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

	public static readonly getAllAnimals: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const language_id = Number(req.params.language_id)
			const result = await AnimalService.getAllAnimals(language_id)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAnimalNumberByAnimalId: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const animal_id = Number(req.params.animal_id)
			const result = await AnimalService.getAnimalNumberByAnimalId(
				animal_id,
				user.id,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly deleteUserAnimal: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const { animal_id, animal_number, answers } = req.body as {
				animal_id: number
				animal_number: string
				answers: { question_id: number; answer: string }[]
			}
			await AnimalService.deleteUserAnimal(
				user?.id,
				animal_id,
				animal_number,
				answers,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly farmAnimalCount: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const result = await AnimalService.farmAnimalCount(user.id)
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: result,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly animalInfo: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const animal_id = Number(req.params.animal_id)
			const result = await AnimalService.animalInfo(user.id, animal_id)
			RESPONSE.SuccessResponse(res, 200, result)
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateAnimalNumberAnswer: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			await AnimalService.updateAnimalNumberAnswer(user.id)
			RESPONSE.SuccessResponse(res, 200, { message: 'success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly addAnimalQuestion: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const result = await AnimalService.addAnimalQuestion(
				req.body as {
					animal_id: number
					question_id: number[]
				},
			)
			RESPONSE.SuccessResponse(res, 201, { message: result.message, data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly deleteAnimalQuestion: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const id = Number(req.params.id)
			const result = await AnimalService.deleteAnimalQuestion(id)
			RESPONSE.SuccessResponse(res, 200, { message: result.message, data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAnimalQuestionById: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const animal_id = Number(req.params.id)
			const language_id = req.params.language_id
				? Number(req.params.language_id)
				: undefined
			const result = await AnimalService.getQuestionsBasedOnAnimalId(
				animal_id,
				language_id,
			)
			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}
}
