import Joi from 'joi'

export const summernoteSchema = Joi.object({
	summernoteInput: Joi.string().required().messages({
		'any.required': 'summernoteInput is required',
		'string.base': 'summernoteInput must be a string',
	}),
})
