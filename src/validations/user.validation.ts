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
		'string.empty': 'The farm name field is required.',
	}),
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
		'string.empty': 'The name field is required.',
	}),
	email: Joi.string().email().optional().messages({
		'string.email': 'The email must be a valid email address.',
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
		'any.required': 'The user_id field is required.',
	}),
	payment_status: Joi.string().required().messages({
		'any.required': 'The payment_status field is required.',
	}),
	exp_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.required()
		.messages({
			'any.required': 'The exp_date field is required.',
			'string.pattern.base':
				'The exp_date must be a valid date in Y-m-d format.',
		}),
	amount: Joi.number().optional(),
})

export const saveUserDeviceSchema = Joi.object({
	firebase_token: Joi.string().required().messages({
		'any.required': 'The firebase_token field is required.',
		'string.empty': 'The firebase_token field is required.',
	}),
	device_id: Joi.string().required().messages({
		'any.required': 'The device_id field is required.',
		'string.empty': 'The device_id field is required.',
	}),
	deviceType: Joi.string().valid('android', 'ios', 'web').required().messages({
		'any.required': 'The deviceType field is required.',
		'string.empty': 'The deviceType field is required.',
		'any.only': 'The deviceType must be one of: android, ios, web.',
	}),
})

export const userAnswerCountSchema = Joi.object({
	type: Joi.string().valid('all_time').optional(),
	start_date: Joi.date().iso().when('type', {
		is: Joi.exist(),
		then: Joi.forbidden(),
		otherwise: Joi.required(),
	}),
	end_date: Joi.date().iso().when('type', {
		is: Joi.exist(),
		then: Joi.forbidden(),
		otherwise: Joi.required(),
	}),
})
	.or('type', 'start_date')
	.messages({
		'any.required': 'Either type or start_date/end_date is required',
	})
