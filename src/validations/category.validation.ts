import Joi from 'joi'

export const categorySchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'Category name is required',
		'string.empty': 'Category name cannot be empty',
	}),
}).unknown(false)
