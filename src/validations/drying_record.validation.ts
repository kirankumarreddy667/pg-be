import Joi from 'joi'

export const updateDryingRecordSchema = Joi.object({
	animal_id: Joi.number().required(),
	animal_number: Joi.string().required(),
	date: Joi.string().optional(),
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.string().required(),
			}),
		)
		.required(),
})
