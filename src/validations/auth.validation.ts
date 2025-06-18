import Joi from 'joi'
import { UserRole } from '../types'

export const registerSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.email': 'Please provide a valid email address',
		'any.required': 'Email is required',
	}),
	password: Joi.string()
		.min(8)
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
	firstName: Joi.string().required().messages({
		'any.required': 'First name is required',
	}),
	lastName: Joi.string().required().messages({
		'any.required': 'Last name is required',
	}),
	username: Joi.string().min(3).max(30).required().messages({
		'string.min': 'Username must be at least 3 characters long',
		'string.max': 'Username must not exceed 30 characters',
		'any.required': 'Username is required',
	}),
	role: Joi.string()
		.valid(...Object.values(UserRole))
		.default(UserRole.USER)
		.messages({
			'any.only': 'Invalid role specified',
		}),
})
