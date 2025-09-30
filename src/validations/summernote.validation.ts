import Joi from 'joi'

export const summernoteSchema = Joi.object({
	summernoteInput: Joi.string().required().messages({
		'any.required': 'The field summernoteInput is required',
		'string.empty': 'The field summernoteInput cannot be empty',
		'string.base': 'The field summernoteInput must be a string',
	}),
})
