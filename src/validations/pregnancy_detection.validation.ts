import Joi from 'joi'

export const updatePregnancyDetectionSchema = Joi.object({
	animal_id: Joi.number().required(),
	animal_number: Joi.string().optional(),
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
