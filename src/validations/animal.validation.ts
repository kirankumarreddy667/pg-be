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

export const deleteUserAnimalSchema = Joi.object({
	animal_id: Joi.number().integer().required(),
	animal_number: Joi.string().required(),
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().integer().required(),
				answer: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
			}),
		)
		.required(),
})

export const addAnimalQuestionSchema = Joi.object({
	animal_id: Joi.number().integer().required(),
	question_id: Joi.array().items(Joi.number().integer().required()).required(),
})

export const animalDetailsBasedOnAnimalTypeSchema = Joi.object({
	animal_id: Joi.number().integer().required(),
	type: Joi.string().trim().required(),
})

export const uploadAnimalImageSchema = Joi.object({
	animal_id: Joi.number().integer().required(),
	animal_number: Joi.string().required(),
	image: Joi.any()
		.meta({ swaggerType: 'file' })
		.required()
		.description('Animal profile image (max 3MB)'),
})
