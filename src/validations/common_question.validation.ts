import Joi from 'joi'

export const createCommonQuestionSchema = Joi.object({
	category_id: Joi.number().integer().required(),
	sub_category_id: Joi.number().integer().optional().allow(null),
	language_id: Joi.number().integer().required(),
	questions: Joi.array()
		.items(
			Joi.object({
				question: Joi.string().required(),
				validation_rule_id: Joi.number().integer().required(),
				form_type_id: Joi.number().integer().required(),
				date: Joi.boolean().required(),
				question_tag: Joi.number().integer().required(),
				question_unit: Joi.number().integer().required(),
				form_type_value: Joi.string().optional().allow(null),
				hint: Joi.string().optional().allow(null),
			}),
		)
		.min(1)
		.required(),
})

export const updateCommonQuestionSchema = Joi.object({
	category_id: Joi.number().integer().required(),
	sub_category_id: Joi.number().integer().optional().allow(null),
	question: Joi.string().required(),
	validation_rule_id: Joi.number().integer().required(),
	form_type_id: Joi.number().integer().required(),
	date: Joi.boolean().required(),
	form_type_value: Joi.string().optional().allow(null),
	question_tag: Joi.number().integer().required(),
	question_unit: Joi.number().integer().required(),
	hint: Joi.string().optional().allow(null),
})

export const addQuestionInOtherLanguageSchema = Joi.object({
	question_id: Joi.number().integer().required(),
	language_id: Joi.number().integer().required(),
	question: Joi.string().required(),
	form_type_value: Joi.string().optional().allow(null),
	hint: Joi.string().optional().allow(null),
})

export const updateQuestionInOtherLanguageSchema = Joi.object({
	question_id: Joi.number().integer().required(),
	language_id: Joi.number().integer().required(),
	question: Joi.string().required(),
	form_type_value: Joi.string().optional().allow(null),
	hint: Joi.string().optional().allow(null),
})
