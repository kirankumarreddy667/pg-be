import Joi from 'joi'

export const createLanguageSchema = Joi.object({
	language: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required().messages({
					'any.required': 'Language name is required',
					'string.empty': 'Language name cannot be empty',
				}),
				language_code: Joi.string().required().messages({
					'any.required': 'Language code is required',
					'string.empty': 'Language code cannot be empty',
				}),
			}),
		)
		.min(1)
		.required()
		.messages({
			'any.required': 'The language field is required.',
			'array.min': 'At least one language is required',
		}),
})

export const updateLanguageSchema = Joi.object({
	name: Joi.string().required().messages({
		'string.empty': 'The name field is required.',
		'any.required': 'The name field is required.',
	}),
	language_code: Joi.string().required().messages({
		'string.empty': 'The language code field is required.',
		'any.required': 'The language code field is required.',
	}),
})

export const updateUserLanguageSchema = Joi.object({
	language_id: Joi.number().required().messages({
		'any.required': 'Language ID is required',
		'number.base': 'Language ID must be a number',
	}),
})
