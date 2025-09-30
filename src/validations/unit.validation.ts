import Joi from 'joi'

export const createUnitSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
		'string.empty': 'The name field is required.',
	}),
	display_name: Joi.string().required().messages({
		'any.required': 'The display name field is required.',
		'string.empty': 'The display name field is required.',
	}),
})
