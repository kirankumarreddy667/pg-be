import Joi from 'joi'

export const questionTagSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'Question tag name is required',
		'string.empty': 'Question tag name cannot be empty',
	}),
	description: Joi.string().allow('').optional(),
}).unknown(false)
