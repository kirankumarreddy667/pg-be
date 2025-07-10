import Joi from 'joi'

// Type validation schema
export const createTypeSchema = Joi.object({
	type: Joi.string().trim().min(1).required(),
})

// Animal validation schema
export const createAnimalSchema = Joi.object({
	name: Joi.string().required(),
	language_id: Joi.number().integer().optional().allow(null),
})

export const addTypeOfAnAnimalSchema = Joi.object({
	animal_id: Joi.number().integer().required(),
	type_id: Joi.number().integer().required(),
})
