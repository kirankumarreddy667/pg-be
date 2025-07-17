import Joi from 'joi'

export const dailyRecordQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().integer().required(),
				answer: Joi.required(),
			}),
		)
		.required(),
	date: Joi.string()
		.required()
		.regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const updateDailyRecordQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				daily_record_answer_id: Joi.number().integer().required(),
				answer: Joi.required(),
			}),
		)
		.required(),
	date: Joi.string()
		.required()
		.regex(/^\d{4}-\d{2}-\d{2}$/),
})
