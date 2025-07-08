import Joi from 'joi'

export const businessOutletSchema = Joi.object({
	business_name: Joi.string().required(),
	owner_name: Joi.string().required(),
	email: Joi.string().email().required(),
	mobile: Joi.string().pattern(/^\d+$/).required(),
	business_address: Joi.string().required(),
})
