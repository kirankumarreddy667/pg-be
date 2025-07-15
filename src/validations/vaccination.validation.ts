import Joi from 'joi'

export const createVaccinationDetailSchema = Joi.object({
	vaccination_type_ids: Joi.array()
		.items(Joi.number().integer())
		.required()
		.messages({
			'any.required': 'Vaccination type IDs are required',
			'array.base': 'Vaccination type IDs must be an array',
		}),
	expense: Joi.number().required().messages({
		'any.required': 'Expense is required',
		'number.base': 'Expense must be a number',
	}),
	record_date: Joi.date().required().messages({
		'any.required': 'Record date is required',
		'date.base': 'Record date must be a valid date',
	}),
	animal_numbers: Joi.array().items(Joi.string()).required().messages({
		'any.required': 'Animal numbers are required',
		'array.base': 'Animal numbers must be an array',
	}),
})
