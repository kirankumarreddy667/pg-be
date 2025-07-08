import Joi from 'joi'

export const productSchema = Joi.object({
	data: Joi.array()
		.items(
			Joi.object({
				product_category_id: Joi.number().integer().required(),
				language: Joi.number().integer().required(),
				product_title: Joi.string().required(),
				product_images: Joi.string().required(),
				product_amount: Joi.number().integer().allow(null),
				product_description: Joi.string().allow(null, ''),
				product_variants: Joi.string().allow(null, ''),
				product_delivery_to: Joi.string().allow(null, ''),
				product_specifications: Joi.string().allow(null, ''),
				thumbnail: Joi.string().required(),
			}),
		)
		.min(1)
		.required(),
})
