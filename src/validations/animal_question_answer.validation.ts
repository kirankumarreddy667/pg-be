import Joi from 'joi'

export const createAnimalQuestionAnswerSchema = Joi.object({
	animal_id: Joi.number().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	animal_number: Joi.string().required().messages({
		'any.required': 'The animal number field is required.',
		'string.empty': 'The animal number field is required.',
	}),
	date: Joi.date().optional(),
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required().messages({
					'any.required': 'The question id field is required.',
					'number.base': 'The question id field is required.',
					'number.empty': 'The question id field is required.',
				}),
				answer: Joi.required().messages({
					'any.required': 'The answer field is required.',
				}),
			}),
		)
		.min(1)
		.required()
		.messages({
			'array.min': 'The answers field is required.',
			'any.required': 'The answers field is required.',
		}),
})

export const updateAnimalBreedingMilkHealthQuestionAnswerSchema = Joi.object({
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required().messages({
					'any.required': 'The question id field is required.',
					'number.base': 'The question id field is required.',
					'number.empty': 'The question id field is required.',
				}),
				answer: Joi.required().messages({
					'any.required': 'The answer field is required.',
				}),
			}),
		)
		.min(1)
		.required()
		.messages({
			'array.min': 'The answers field is required.',
			'any.required': 'The answers field is required.',
		}),
	animal_id: Joi.number().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	date: Joi.date().required().messages({
		'any.required': 'The date field is required.',
		'date.empty': 'The date field is required.',
	}),
})

export const updateAnimalQuestionAnswerSchema = Joi.object({
	animal_id: Joi.number().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	answers: Joi.array()
		.items(
			Joi.object({
				question_id: Joi.number().required().messages({
					'any.required': 'The question id field is required.',
					'number.base': 'The question id field is required.',
					'number.empty': 'The question id field is required.',
				}),
				answer: Joi.required().messages({
					'any.required': 'The answer field is required.',
				}),
			}),
		)
		.min(1)
		.required()
		.messages({
			'array.min': 'The answers field is required.',
			'any.required': 'The answers field is required.',
		}),
})

export const mapAnimalMotherToCalfSchema = Joi.object({
	animal_id: Joi.number().required().messages({
		'any.required': 'The animal id field is required.',
		'number.base': 'The animal id field is required.',
		'number.empty': 'The animal id field is required.',
	}),
	delivery_date: Joi.string().required().messages({
		'any.required': 'The delivery date field is required.',
		'string.empty': 'The delivery date field is required.',
	}),
	mother_animal_number: Joi.string().required().messages({
		'any.required': 'The mother animal number field is required.',
		'string.empty': 'The mother animal number field is required.',
	}),
	calf_animal_number: Joi.string().required().messages({
		'any.required': 'The calf animal number field is required.',
		'string.empty': 'The calf animal number field is required.',
	}),
})
