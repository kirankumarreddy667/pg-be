import Joi from 'joi'

export const sliderArticleSchema = Joi.object({
	data: Joi.array()
		.items(
			Joi.object({
				language_id: Joi.number().integer().required().messages({
					'any.required': 'The language_id field is required.',
					'number.base': 'The language_id field is required.',
				}),
				name: Joi.string().required().messages({
					'any.required': 'The name field is required.',
					'string.empty': 'The name field is required.',
				}),
				image: Joi.string().required().messages({
					'any.required': 'The image field is required.',
					'string.empty': 'The image field is required.',
				}),
				web_url: Joi.string().uri().required().messages({
					'any.required': 'The web_url field is required.',
					'string.empty': 'The web_url field is required.',
				}),
				subtitle: Joi.string().allow(null),
				thumbnail: Joi.string().required().messages({
					'any.required': 'The thumbnail field is required.',
					'string.empty': 'The thumbnail field is required.',
				}),
			}),
		)
		.required(),
})
