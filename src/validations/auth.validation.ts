import Joi from 'joi'

export const userRegistrationSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
	}),
	phone_number: Joi.string().pattern(/^\d+$/).required().messages({
		'any.required': 'The phone number field is required.',
		'string.pattern.base': 'Phone number must contain only digits',
	}),
	password: Joi.string().min(6).max(16).required().messages({
		'any.required': 'The password field is required.',
		'string.min': 'Password must be at least 6 characters long',
		'string.max': 'Password must not exceed 16 characters',
	}),
	email: Joi.string()
		.email()
		.messages({
			'string.email': 'Email must be a valid email address',
		})
		.optional(),
})

export const verifyOtpSchema = Joi.object({
	user_id: Joi.number().required().messages({
		'any.required': 'The user id field is required.',
	}),
	otp: Joi.string().length(6).required().messages({
		'string.length': 'OTP must be 6 characters long',
		'any.required': 'The otp field is required.',
	}),
})

export const resendOtpSchema = Joi.object({
	userId: Joi.number().required().messages({
		'any.required': 'User ID is required',
	}),
})

export const loginSchema = Joi.object({
	phone_number: Joi.string().pattern(/^\d+$/).required().messages({
		'any.required': 'The phone number field is required.',
		'string.pattern.base': 'Phone number must contain only digits',
	}),
	password: Joi.string().min(6).max(16).required().messages({
		'any.required': 'The password field is required.',
		'string.min': 'Password must be at least 6 characters long',
		'string.max': 'Password must not exceed 16 characters',
	}),
})

export const forgotPassword = Joi.object().keys({
	phone_number: Joi.string().pattern(/^\d+$/).required().messages({
		'any.required': 'The phone number field is required.',
		'string.pattern.base': 'Phone number must contain only digits',
	}),
	password: Joi.string().min(6).max(16).required().messages({
		'any.required': 'The password field is required.',
		'string.min': 'Password must be at least 6 characters long',
		'string.max': 'Password must not exceed 16 characters',
	}),
	otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
		'string.length': 'OTP must be 6 digits',
		'string.pattern.base': 'OTP must be numeric',
		'any.required': 'The otp field is required.',
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
	password: Joi.string().min(6).max(16).required().messages({
		'any.required': 'The password field is required.',
		'string.min': 'Password must be at least 6 characters long',
		'string.max': 'Password must not exceed 16 characters',
	}),
})

export const businessLoginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': 'Email is required',
		'string.email': 'Email must be a valid email address',
	}),
	password: Joi.string().min(6).max(16).required().messages({
		'any.required': 'The password field is required.',
		'string.min': 'Password must be at least 6 characters long',
		'string.max': 'Password must not exceed 16 characters',
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
	password: Joi.string().min(6).max(16).required().messages({
		'any.required': 'The password field is required.',
		'string.min': 'Password must be at least 6 characters long',
		'string.max': 'Password must not exceed 16 characters',
	}),
	confirm_password: Joi.string()
		.required()
		.valid(Joi.ref('password'))
		.messages({
			'any.required': 'Confirm password is required',
			'any.only': 'Confirm password must match new password',
		}),
})
