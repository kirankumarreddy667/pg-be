import Joi from 'joi'

export const subCategoryLanguageSchema = Joi.object({
	sub_category_id: Joi.number().integer().required().messages({
		'any.required': 'Subcategory ID is required',
		'number.base': 'Subcategory ID must be a number',
	}),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'Language ID is required',
		'number.base': 'Language ID must be a number',
	}),
	sub_category_language_name: Joi.string().required().messages({
		'any.required': 'Subcategory language name is required',
		'string.empty': 'Subcategory language name cannot be empty',
	}),
})

export const updateSubCategoryLanguageSchema = Joi.object({
	sub_category_language_name: Joi.string().required().messages({
		'any.required': 'Subcategory language name is required',
		'string.empty': 'Subcategory language name cannot be empty',
	}),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'Language ID is required',
		'number.base': 'Language ID must be a number',
	}),
})
