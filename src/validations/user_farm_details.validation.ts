import Joi from 'joi'

export const userFarmDetailsSchema = Joi.object({
	farm_name: Joi.string().required().messages({
		'any.required': 'The farm name field is required.',
		'string.empty': 'The farm name field is required.',
	}),
	farm_type: Joi.string().required().messages({
		'any.required': 'The farm type field is required.',
		'string.empty': 'The farm type field is required.',
	}),
	farm_type_id: Joi.number().integer().allow(null),
	loose_housing: Joi.string().allow(null),
	silage: Joi.string().allow(null),
	azzola: Joi.string().allow(null),
	hydroponics: Joi.string().allow(null),
})
