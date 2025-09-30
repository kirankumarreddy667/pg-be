import Joi from 'joi'

// Type validation schema
export const createTypeSchema = Joi.object({
	type: Joi.string().trim().min(1).required().messages({
		'any.required': 'The type field is required.',
		'string.empty': 'The type field is required.',
	}),
}).unknown(false)

// Animal validation schema
export const createAnimalSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'The name field is required.',
		'string.empty': 'The name field is required.',
	}),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'The language_id field is required.',
		'number.base': 'The language_id field is required.',
	}),
}).unknown(false)

export const addTypeOfAnAnimalSchema = Joi.object({
	animal_id: Joi.number().integer().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	type_id: Joi.number().integer().required().messages({
		'any.required': 'The type id field is required.',
		'number.base': 'The type id field is required.',
		'number.empty': 'The type id field is required.',
	}),
}).unknown(false)

export const deleteUserAnimalSchema = Joi.object({
	animal_id: Joi.number().integer().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	animal_number: Joi.string().required().messages({
		'any.required': 'The animal number field is required.',
		'string.empty': 'The animal number field is required.',
	}),
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().integer().required().messages({
					'any.required': 'The question id field is required.',
					'number.base': 'The question id field is required.',
					'number.empty': 'The question id field is required.',
				}),
				answer: Joi.alternatives()
					.try(Joi.string(), Joi.number())
					.required()
					.messages({
						'any.required': 'The answer field is required.',
						'string.empty': 'The answer field is required.',
						'number.empty': 'The answer field is required.',
					}),
			}),
		)
		.required()
		.messages({
			'any.required': 'The answers field is required.',
			'array.empty': 'The answers field is required.',
		}),
}).unknown(false)

export const addAnimalQuestionSchema = Joi.object({
	animal_id: Joi.number().integer().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	question_id: Joi.array()
		.items(
			Joi.number().integer().required().messages({
				'any.required': 'The question id field is required.',
				'number.base': 'The question id field is required.',
				'number.empty': 'The question id field is required.',
			}),
		)
		.required()
		.messages({
			'any.required': 'The question id field is required.',
			'number.base': 'The question id field is required.',
			'number.empty': 'The question id field is required.',
		}),
})

export const animalDetailsBasedOnAnimalTypeSchema = Joi.object({
	animal_id: Joi.number().integer().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	type: Joi.string().trim().required().messages({
		'any.required': 'The type field is required.',
		'string.empty': 'The type field is required.',
	}),
}).unknown(false)

export const uploadAnimalImageSchema = Joi.object({
	animal_id: Joi.number().integer().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	animal_number: Joi.string().required().messages({
		'any.required': 'The animal number field is required.',
		'string.empty': 'The animal number field is required.',
	}),
})
