import Joi from 'joi'

export const userFarmDetailsSchema = Joi.object({
	farm_name: Joi.string().required(),
	farm_type: Joi.string().required(),
	farm_type_id: Joi.number().integer().allow(null),
	loose_housing: Joi.string().allow(null, ''),
	silage: Joi.string().allow(null, ''),
	azzola: Joi.string().allow(null, ''),
	hydroponics: Joi.string().allow(null, ''),
})
