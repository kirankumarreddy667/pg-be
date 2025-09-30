import Joi from 'joi'

export const formTypeSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
		'string.empty': 'The name field is required.',
	}),
	description: Joi.string().required().messages({
		'any.required': 'The description field is required.',
		'string.empty': 'The description field is required.',
	}),
}).unknown(false)
