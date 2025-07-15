import Joi from 'joi'

export const createPlanSchema = Joi.object({
	name: Joi.string().required().messages({
		'string.empty': 'Plan name is required',
	}),
	amount: Joi.string().required().messages({
		'string.empty': 'Plan amount is required',
	}),
	plan_type_id: Joi.number().integer().required().messages({
		'number.base': 'Plan type ID must be a number',
		'any.required': 'Plan type ID is required',
	}),
	language_id: Joi.number().integer().required().messages({
		'number.base': 'Language ID must be a number',
		'any.required': 'Language ID is required',
	}),
})
