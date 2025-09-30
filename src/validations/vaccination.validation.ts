import Joi from 'joi'

export const createVaccinationDetailSchema = Joi.object({
	vaccination_type_ids: Joi.array()
		.items(Joi.number().integer())
		.required()
		.messages({
			'any.required': 'The vaccination type ids field is required.',
			'array.base': 'The vaccination type ids field is invalid.',
		}),
	expense: Joi.number().required().messages({
		'any.required': 'The expense field is required.',
		'number.base': 'The expense field is invalid.',
	}),
	record_date: Joi.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.required()
		.messages({
			'string.pattern.base': 'Record date must be in YYYY-MM-DD format',
			'any.required': 'The record date field is required.',
		}),

	animal_numbers: Joi.array().items(Joi.string()).required().messages({
		'any.required': 'The animal numbers field is required.',
		'array.base': 'The animal numbers field is invalid.',
	}),
})
