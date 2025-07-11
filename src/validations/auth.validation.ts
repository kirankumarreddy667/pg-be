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
		.pattern(/^\d{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'Phone number must be 10 digits',
		}),
})

export const resetPassword = Joi.object().keys({
	phone_number: Joi.string()
		.pattern(/^\d{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'Phone number must be 10 digits',
		}),
	otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
		'string.length': 'OTP must be 6 digits',
		'string.pattern.base': 'OTP must be numeric',
	}),
	password: Joi.string().min(8).required(),
})

export const businessLoginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': 'Email is required',
		'string.email': 'Email must be a valid email address',
	}),
	password: Joi.string().required().messages({
		'any.required': 'Password is required',
	}),
})

export const businessForgotPasswordSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': 'Email is required',
		'string.email': 'Email must be a valid email address',
	}),
})

export const changePasswordSchema = Joi.object({
	old_password: Joi.string().required().messages({
		'any.required': 'Old password is required',
	}),
	password: Joi.string().min(8).required().messages({
		'any.required': 'New password is required',
		'string.min': 'New password must be at least 8 characters',
	}),
	confirm_password: Joi.string()
		.required()
		.valid(Joi.ref('password'))
		.messages({
			'any.required': 'Confirm password is required',
			'any.only': 'Confirm password must match new password',
		}),
})
