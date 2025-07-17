import Joi from 'joi'

export const businessOutletSchema = Joi.object({
	business_name: Joi.string().required(),
	owner_name: Joi.string().required(),
	email: Joi.string().email().required(),
	mobile: Joi.string().pattern(/^\d+$/).required(),
	business_address: Joi.string().required(),
})

export const farmersListSchema = Joi.object({
	start_date: Joi.string()
		.optional()
		.pattern(/^\d{4}-\d{2}-\d{2}$/),
	end_date: Joi.string()
		.optional()
		.pattern(/^\d{4}-\d{2}-\d{2}$/),
	search: Joi.string().required(),
})

export const businessOutletFarmerMappingSchema = Joi.object({
	user_id: Joi.number().integer().positive().required(),
	business_outlet_id: Joi.number().integer().positive().required(),
})

export const businessOutletFarmersAnimalSchema = Joi.object({
	start_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	end_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	search: Joi.string().required(),
	type: Joi.string().optional(),
})
