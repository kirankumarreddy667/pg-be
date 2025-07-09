import Joi from 'joi'

export const fixedInvestmentDetailsSchema = Joi.object({
	type_of_investment: Joi.number().integer().required(),
	amount_in_rs: Joi.number().integer().required(),
	date_of_installation_or_purchase: Joi.date().required(),
})
