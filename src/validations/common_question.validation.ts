import Joi from 'joi'

export const createCommonQuestionSchema = Joi.object({
	category_id: Joi.number().integer().required().messages({
		'any.required': 'The category id field is required.',
		'number.empty': 'The category id field is required.',
		'number.base': 'The selected category id is invalid.',
	}),
	sub_category_id: Joi.number().integer().optional().allow(null),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'The language id field is required.',
		'number.empty': 'The language id field is required.',
		'number.base': 'The selected language id is invalid.',
	}),
	questions: Joi.array()
		.items(
			Joi.object({
				question: Joi.string().required(),
				validation_rule_id: Joi.number().integer().required(),
				form_type_id: Joi.number().integer().required(),
				date: Joi.number().required().allow('0', '1'),
				question_tag: Joi.number().integer().required(),
				question_unit: Joi.number().integer().required(),
				form_type_value: Joi.string().optional().allow(null),
				hint: Joi.string().optional().allow(null),
			}),
		)
		.min(1)
		.required()
		.messages({
			'any.required': 'The questions field is required.',
			'array.min': 'At least one question is required.',
			'array.empty': 'The questions field is required.',
		}),
}).unknown(false)

export const updateCommonQuestionSchema = Joi.object({
	category_id: Joi.number().integer().required().messages({
		'any.required': 'The category id field is required.',
		'number.empty': 'The category id field is required.',
		'number.base': 'The selected category id is invalid.',
	}),
	sub_category_id: Joi.number().integer().optional().allow(null),
	question: Joi.string().required().messages({
		'any.required': 'The question field is required.',
		'string.empty': 'The question field is required.',
	}),
	validation_rule_id: Joi.number().integer().required().messages({
		'any.required': 'The validation rule id field is required.',
		'number.empty': 'The validation rule id field is required.',
		'number.base': 'The selected validation rule id is invalid.',
	}),
	form_type_id: Joi.number().integer().required().messages({
		'any.required': 'The form type id field is required.',
		'number.empty': 'The form type id field is required.',
		'number.base': 'The selected form type id is invalid.',
	}),
	date: Joi.number().required().messages({
		'any.required': 'The date field is required.',
		'boolean.empty': 'The date field is required.',
	}),
	form_type_value: Joi.string().optional().allow(null),
	question_tag_id: Joi.number().integer().required().messages({
		'any.required': 'The question tag id field is required.',
		'number.empty': 'The question tag id field is required.',
		'number.base': 'The selected question tag id is invalid.',
	}),
	question_unit_id: Joi.number().integer().required().messages({
		'any.required': 'The question unit id field is required.',
		'number.empty': 'The question unit id field is required.',
		'number.base': 'The selected question unit id is invalid.',
	}),
	hint: Joi.string().optional().allow(null),
}).unknown(false)

export const addQuestionInOtherLanguageSchema = Joi.object({
	question_id: Joi.number().integer().required().messages({
		'any.required': 'The question id field is required.',
		'number.empty': 'The question id field is required.',
		'number.base': 'The selected question id is invalid.',
	}),
	language_id: Joi.number().integer().required().messages({
		'any.required': 'The language id field is required.',
		'number.empty': 'The language id field is required.',
		'number.base': 'The selected language id is invalid.',
	}),
	question: Joi.string().required().messages({
		'any.required': 'The question field is required.',
		'string.empty': 'The question field is required.',
	}),
	form_type_value: Joi.string().optional().allow(null),
	hint: Joi.string().optional().allow(null),
}).unknown(false)
