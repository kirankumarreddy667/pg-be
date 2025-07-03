import Joi from 'joi'

export const sortUsersSchema = Joi.object({
	payment_status: Joi.string().required(),
	sort_by: Joi.string().required(),
	start_date: Joi.date().iso().optional(),
	end_date: Joi.date().iso().optional(),
	type: Joi.string().optional(),
})

export const updateProfileSchema = Joi.object({
	farm_name: Joi.string().required().messages({
		'any.required': 'The farm name field is required.',
		'string.empty': 'The farm name field is required.'
	}),
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
		'string.empty': 'The name field is required.'
	}),
	email: Joi.string().email().optional().messages({
		'string.email': 'The email must be a valid email address.'
	}),
	address: Joi.string().optional(),
	pincode: Joi.string().optional(),
	taluka: Joi.string().optional(),
	district: Joi.string().optional(),
	state: Joi.string().optional(),
	country: Joi.string().optional(),
	village: Joi.string().optional(),
})

export const updatePaymentStatusSchema = Joi.object({
	user_id: Joi.number().required().messages({
		'any.required': 'The user_id field is required.'
	}),
	payment_status: Joi.string().required().messages({
		'any.required': 'The payment_status field is required.'
	}),
	exp_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
		'any.required': 'The exp_date field is required.',
		'string.pattern.base': 'The exp_date must be a valid date in Y-m-d format.'
	}),
	amount: Joi.number().optional()
})
