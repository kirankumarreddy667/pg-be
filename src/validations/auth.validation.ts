import Joi from 'joi'

export const userRegistrationSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'Name is required',
	}),
	phone_number: Joi.string().required().messages({
		'any.required': 'Phone number is required',
	}),
	password: Joi.string()
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		)
		.required()
		.messages({
			'string.min': 'Password must be at least 8 characters long',
			'string.pattern.base':
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			'any.required': 'Password is required',
		}),
})

export const verifyOtpSchema = Joi.object({
	userId: Joi.number().required().messages({
		'any.required': 'User ID is required',
	}),
	otp: Joi.string().length(6).required().messages({
		'string.length': 'OTP must be 6 characters long',
		'any.required': 'OTP is required',
	}),
})

export const resendOtpSchema = Joi.object({
	userId: Joi.number().required().messages({
		'any.required': 'User ID is required',
	}),
})

export const loginSchema = Joi.object({
	phone_number: Joi.string().required().messages({
		'any.required': 'Phone number is required',
	}),
	password: Joi.string().required().messages({
		'any.required': 'Password is required',
	}),
})

export const forgotPassword = Joi.object().keys({
	phone_number: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'Phone number must be 10 digits',
		}),
})

export const resetPassword = Joi.object().keys({
	phone_number: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'Phone number must be 10 digits',
		}),
	otp: Joi.string()
		.length(6)
		.pattern(/^[0-9]+$/)
		.required()
		.messages({
			'string.length': 'OTP must be 6 digits',
			'string.pattern.base': 'OTP must be numeric',
		}),
	password: Joi.string().min(8).required(),
})
