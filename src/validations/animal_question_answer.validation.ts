import Joi from 'joi'

export const createAnimalQuestionAnswerSchema = Joi.object({
	animal_id: Joi.number().required(),
	animal_number: Joi.string().required(),
	date: Joi.date().optional(),
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.required(),
			}),
		)
		.min(1)
		.required(),
})

export const updateAnimalBreedingMilkHealthQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.required(),
			}),
		)
		.min(1)
		.required(),
	animal_id: Joi.number().required(),
	date: Joi.date().required(),
})

export const updateAnimalBirthQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.required(),
			}),
		)
		.min(1)
		.required(),
	animal_id: Joi.number().required(),
})

export const updateAnimalQuestionAnswerSchema = createAnimalQuestionAnswerSchema

export const updateAnimalHeatEventQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.required(),
			}),
		)
		.min(1)
		.required(),
	animal_id: Joi.number().required(),
})

export const saveAnimalHeatEventQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.required(),
			}),
		)
		.min(1)
		.required(),
	animal_id: Joi.number().required(),
	animal_number: Joi.string().required(),
})
