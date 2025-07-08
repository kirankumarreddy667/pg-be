import Joi from 'joi'

export const sliderArticleSchema = Joi.object({
	data: Joi.array()
		.items(
			Joi.object({
				language_id: Joi.number().integer().required(),
				name: Joi.string().required(),
				image: Joi.string().required(),
				web_url: Joi.string().uri().required(),
				subtitle: Joi.string().allow(null, ''),
				thumbnail: Joi.string().required(),
			}),
		)
		.required(),
})
