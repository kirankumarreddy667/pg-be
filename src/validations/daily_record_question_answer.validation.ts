import Joi from 'joi'

export const dailyRecordQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().integer().required().messages({
					'any.required': 'The question id field is required.',
					'number.base': 'The question id field is required.',
					'number.empty': 'The question id field is required.',
				}),
				answer: Joi.array()
					.items(
						Joi.object({
							name: Joi.string().trim().required().messages({
								'any.required': 'The name field is required.',
								'string.empty': 'The name field is required.',
							}),
						}).unknown(true),
					)
					.min(1)
					.required()
					.messages({
						'array.base': 'The answer field must be an array of objects.',
						'array.min': 'At least one answer object is required.',
					}),
			}),
		)
		.required()
		.messages({
			'any.required': 'The answers field is required.',
			'array.base': 'The answers field is invalid.',
			'any.empty': 'The answers field is required.',
		}),
	date: Joi.string()
		.required()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.messages({
			'string.pattern.base': 'The date does not match the format Y-m-d.',
			'any.required': 'The date field is required.',
			'string.empty': 'The date field is required.',
		}),
}).unknown(true)

export const updateDailyRecordQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				daily_record_answer_id: Joi.number().integer().required().messages({
					'any.required': 'The daily record answer id field is required.',
					'number.base': 'The daily record answer id field is required.',
					'number.empty': 'The daily record answer id field is required.',
				}),
				answer: Joi.string().required().messages({
					'any.required': 'The answer field is required.',
					'array.base': 'The answer field is invalid.',
					'any.empty': 'The answer field is required.',
				}),
			}),
		)
		.required(),
	date: Joi.string()
		.required()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.messages({
			'string.pattern.base': 'The date does not match the format Y-m-d.',
			'any.required': 'The date field is required.',
			'string.empty': 'The date field is required.',
		}),
})
