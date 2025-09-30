import Joi from 'joi'

export const validationRuleSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
		'string.empty': 'The name field is required.',
	}),
	description: Joi.string().required().messages({
		'any.required': 'The description field is required.',
		'string.empty': 'The description field is required.',
	}),
	constant_value: Joi.number().required().messages({
		'any.required': 'The constant_value field is required.',
		'number.base': 'The constant_value must be a number.',
		'number.empty': 'The constant_value field is required.',
	}),
}).unknown(false)
