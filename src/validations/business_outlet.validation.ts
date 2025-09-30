import Joi from 'joi'

export const businessOutletSchema = Joi.object({
	business_name: Joi.string().required().messages({
		'any.required': 'The business name field is required.',
		'string.empty': 'The business name field is required.',
	}),
	owner_name: Joi.string().required().messages({
		'any.required': 'The owner name field is required.',
		'string.empty': 'The owner name field is required.',
	}),
	email: Joi.string().email().required().messages({
		'any.required': 'The email field is required.',
		'string.empty': 'The email field is required.',
		'string.email': 'The email must be a valid email address.',
	}),
	mobile: Joi.string().pattern(/^\d+$/).required().messages({
		'any.required': 'The mobile field is required.',
		'string.pattern.base': 'Phone number must contain only digits',
	}),
	business_address: Joi.string().required().messages({
		'any.required': 'The business address field is required.',
		'string.empty': 'The business address field is required.',
	}),
}).unknown(false)

export const businessOutletUpdateSchema = Joi.object({
	business_name: Joi.string().optional(),
	owner_name: Joi.string().optional(),
	email: Joi.string().email().optional().messages({
		'string.email': 'The email must be a valid email address.',
	}),
	business_address: Joi.string().optional(),
}).unknown(false)

export const farmersListSchema = Joi.object({
	start_date: Joi.string()
		.optional()
		.pattern(/^\d{4}-\d{2}-\d{2}$/),
	end_date: Joi.string()
		.optional()
		.pattern(/^\d{4}-\d{2}-\d{2}$/),
	search: Joi.string().required().messages({
		'any.required': 'The search field is required.',
		'string.empty': 'The search field is required.',
	}),
})

export const businessOutletFarmerMappingSchema = Joi.object({
	user_id: Joi.array()
		.items(
			Joi.number().integer().positive().required().messages({
				'number.positive': 'The user id must be a positive number.',
			}),
		)
		.required()
		.messages({
			'any.required': 'The user id field is required.',
			'array.empty': 'The user id field is required.',
			'array.base': 'The user id must be an array.',
		}),
	business_outlet_id: Joi.number().integer().positive().required().messages({
		'any.required': 'The business outlet id field is required.',
		'any.empty': 'The business outlet id field is required.',
		'number.positive': 'The business outlet id must be a positive number.',
	}),
})

export const businessOutletFarmersAnimalSchema = Joi.object({
	start_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	end_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	search: Joi.string().required(),
	type: Joi.string().optional(),
})
