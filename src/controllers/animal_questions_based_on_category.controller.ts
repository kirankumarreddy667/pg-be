import { RequestHandler } from 'express'
import { AnimalQuestionsBasedOnCategoryService } from '@/services/animal_questions_based_on_category.service'
import RESPONSE from '@/utils/response'
import { AnimalService } from '@/services/animal.service'

export class AnimalQuestionsBasedOnCategoryController {
	public static readonly animalQuestionBasedOnBasicDetailsCategory: RequestHandler =
		async (req, res, next) => {
			try {
				const animal_id = Number(req.params.animal_id)
				const language_id = Number(req.params.language_id)
				const result =
					await AnimalQuestionsBasedOnCategoryService.animalQuestionBasedOnBasicDetailsCategory(
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

	public static readonly animalQuestionBasedOnBreedingDetailsCategory: RequestHandler =
		async (req, res, next) => {
			try {
				const animal_id = Number(req.params.animal_id)
				const language_id = Number(req.params.language_id)
				const result =
					await AnimalQuestionsBasedOnCategoryService.animalQuestionBasedOnBreedingDetailsCategory(
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

	public static readonly animalQuestionBasedOnMilkDetailsCategory: RequestHandler =
		async (req, res, next) => {
			try {
				const animal_id = Number(req.params.animal_id)
				const language_id = Number(req.params.language_id)
				const result =
					await AnimalQuestionsBasedOnCategoryService.animalQuestionBasedOnMilkDetailsCategory(
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

	public static readonly animalQuestionBasedOnBirthDetailsCategory: RequestHandler =
		async (req, res, next) => {
			try {
				const animal_id = Number(req.params.animal_id)
				const language_id = Number(req.params.language_id)
				const result =
					await AnimalQuestionsBasedOnCategoryService.animalQuestionBasedOnBirthDetailsCategory(
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

	public static readonly animalQuestionBasedOnHealthDetailsCategory: RequestHandler =
		async (req, res, next) => {
			try {
				const animal_id = Number(req.params.animal_id)
				const language_id = Number(req.params.language_id)
				const result =
					await AnimalQuestionsBasedOnCategoryService.animalQuestionBasedOnHealthDetailsCategory(
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

	public static readonly userAnimalDeleteQuestions: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const language_id = Number(req.params.language_id)
			const result =
				await AnimalQuestionsBasedOnCategoryService.userAnimalDeleteQuestions(
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

	public static readonly userAnimalDeleteQuestionsBasedOnOptions: RequestHandler =
		async (req, res, next) => {
			try {
				const language_id = Number(req.params.language_id)
				const option = req.params.option
				const result =
					await AnimalQuestionsBasedOnCategoryService.userAnimalDeleteQuestionsBasedOnOptions(
						language_id,
						option,
					)
				RESPONSE.SuccessResponse(res, 200, {
					message: result.message,
					data: result.data,
				})
			} catch (error) {
				next(error)
			}
		}

	public static readonly farmAnimalCount: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as { id: number } | undefined
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
}
