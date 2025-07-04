import Joi from 'joi'

export const categoryLanguageSchema = Joi.object({
	category_id: Joi.number().integer().required().messages({
		'any.required': 'Category ID is required',
		'number.base': 'Category ID must be a number',
	}),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'Language ID is required',
		'number.base': 'Language ID must be a number',
	}),
	category_language_name: Joi.string().required().messages({
		'any.required': 'Category language name is required',
		'string.empty': 'Category language name cannot be empty',
	}),
})

export const updateCategoryLanguageSchema = Joi.object({
	category_language_name: Joi.string().required().messages({
		'any.required': 'Category language name is required',
		'string.empty': 'Category language name cannot be empty',
	}),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'Language ID is required',
		'number.base': 'Language ID must be a number',
	}),
})
