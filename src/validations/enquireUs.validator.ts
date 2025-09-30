import Joi from 'joi'

export const createEnquirySchema = Joi.object({
	first_name: Joi.string().trim().required().messages({
		'any.required': 'The first name field is required.',
		'string.empty': 'The first name field is required.',
	}),

	last_name: Joi.string().trim().optional(),

	email: Joi.string().email().required().messages({
		'any.required': 'The email field is required.',
		'string.empty': 'The email field is required.',
		'string.email': 'The email must be a valid email address.',
	}),

	phone: Joi.string().pattern(/^\d+$/).min(10).required().messages({
		'any.required': 'The phone field is required.',
		'string.pattern.base': 'Phone number must contain only digits',
		'string.min': '"The phone must be at least 10 characters.',
	}),

	query: Joi.string().trim().required().messages({
		'any.required': 'The query field is required.',
		'string.empty': 'The query field is required.',
	}),
})
