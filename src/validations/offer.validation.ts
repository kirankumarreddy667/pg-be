import Joi from 'joi'

export const createOfferSchema = Joi.object({
	data: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required().messages({
					'any.required': 'The name field is required.',
					'string.empty': 'The name field is required.',
				}),
				amount: Joi.number().required().messages({
					'any.required': 'The amount field is required.',
					'number.base': 'The amount must be a number.',
					'number.empty': 'The amount field is required.',
				}),
				plan_id: Joi.number().optional(),
				product_id: Joi.number().optional(),
				title: Joi.string().required().messages({
					'any.required': 'The title field is required.',
					'string.empty': 'The title field is required.',
				}),
				description: Joi.string().required().messages({
					'any.required': 'The description field is required.',
					'string.empty': 'The description field is required.',
				}),
				offer_type: Joi.string().required().messages({
					'any.required': 'The offer_type field is required.',
					'string.empty': 'The offer_type field is required.',
				}),
			}),
		)
		.required()
		.messages({
			'any.required': 'The data field is required.',
			'array.empty': 'The data field is required.',
		}),
	language_id: Joi.number().required().messages({
		'any.required': 'The language id field is required.',
		'number.base': 'The language id must be a number.',
		'number.empty': 'The language id field is required.',
	}),
}).unknown(false)
