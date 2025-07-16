import Joi from 'joi'

export const createDailyRecordQuestionsSchema = Joi.object({
	category_id: Joi.number().integer().required(),
	sub_category_id: Joi.number().integer().optional().allow(null),
	language_id: Joi.number().integer().required(),
	questions: Joi.array()
		.items(
			Joi.object({
				question: Joi.string().required(),
				validation_rule_id: Joi.number().integer().required(),
				form_type_id: Joi.number().integer().required(),
				form_type_value: Joi.string().optional().allow(null, ''),
				date: Joi.boolean().optional(),
				question_tag: Joi.array().items(Joi.number().integer()).required(),
				question_unit: Joi.number().integer().required(),
				hint: Joi.string().optional().allow(null, ''),
				sequence_number: Joi.number().integer().optional(),
			}),
		)
		.required(),
})

export const updateDailyRecordQuestionSchema = Joi.object({
	category_id: Joi.number().integer().required(),
	sub_category_id: Joi.number().integer().optional().allow(null),
	question: Joi.string().required(), // Unique check should be handled in service/controller
	validation_rule_id: Joi.number().integer().required(),
	form_type_id: Joi.number().integer().required(),
	date: Joi.boolean().required(),
	form_type_value: Joi.string().optional().allow(null, ''),
	question_tag_id: Joi.array().items(Joi.number().integer()).required(),
	question_unit_id: Joi.number().integer().required(),
	hint: Joi.string().optional().allow(null, ''),
})

export const addDailyQuestionInOtherLanguageSchema = Joi.object({
	daily_record_question_id: Joi.number().integer().required(),
	language_id: Joi.number().integer().required(),
	question: Joi.string().required(),
	form_type_value: Joi.string().optional().allow(null, ''),
	hint: Joi.string().optional().allow(null, ''),
})
