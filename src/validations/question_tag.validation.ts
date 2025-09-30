import Joi from 'joi'

export const questionTagSchema = Joi.object({
	tags: Joi.array().items(Joi.string().optional()).required().messages({
		'any.required': 'The tags field is required',
		'array.base': 'Tag field must be an array',
	}),
}).unknown(false)
