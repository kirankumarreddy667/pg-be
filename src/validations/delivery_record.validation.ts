import Joi from 'joi'

export const addAnimalRecordDeliveryQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required(),
				answer: Joi.any().required(),
			}),
		)
		.required(),
	animal_id: Joi.number().required(),
	animal_number: Joi.string().required(),
	date: Joi.date().optional(),
})
