import Joi from 'joi'

export const sortUsersSchema = Joi.object({
	payment_status: Joi.string().required(),
	sort_by: Joi.string().required(),
	start_date: Joi.date().iso().optional(),
	end_date: Joi.date().iso().optional(),
	type: Joi.string().optional(),
})
