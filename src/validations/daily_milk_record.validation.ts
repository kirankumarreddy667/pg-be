import Joi from 'joi'

export const saveDailyMilkRecordSchema = Joi.object({
	record_date: Joi.date().required().messages({
		'any.required': 'The record date field is required.',
		'date.base': 'The record date field is invalid.',
	}),
	cows_daily_milk_data: Joi.array()
		.items(
			Joi.object({
				animal_id: Joi.number().integer().required().messages({
					'any.required': 'The animal id field is required.',
					'number.base': 'The animal id field is required.',
					'number.empty': 'The animal id field is required.',
				}),
				animal_number: Joi.string().required().messages({
					'any.required': 'The animal number field is required.',
					'string.empty': 'The animal number field is required.',
				}),
				morning_milk_in_litres: Joi.number().required().messages({
					'any.required': 'The morning milk in litres field is required.',
					'number.base': 'The morning milk in litres field is required.',
					'number.empty': 'The morning milk in litres field is required.',
				}),
				evening_milk_in_litres: Joi.number().required().messages({
					'any.required': 'The evening milk in litres field is required.',
					'number.base': 'The evening milk in litres field is required.',
					'number.empty': 'The evening milk in litres field is required.',
				}),
			}),
		)
		.optional(),
	buffalos_daily_milk_data: Joi.array()
		.items(
			Joi.object({
				animal_id: Joi.number().integer().required().messages({
					'any.required': 'The animal id field is required.',
					'number.base': 'The animal id field is required.',
					'number.empty': 'The animal id field is required.',
				}),
				animal_number: Joi.string().required().messages({
					'any.required': 'The animal number field is required.',
					'string.empty': 'The animal number field is required.',
				}),
				morning_milk_in_litres: Joi.number().required().messages({
					'any.required': 'The morning milk in litres field is required.',
					'number.base': 'The morning milk in litres field is required.',
					'number.empty': 'The morning milk in litres field is required.',
				}),
				evening_milk_in_litres: Joi.number().required().messages({
					'any.required': 'The evening milk in litres field is required.',
					'number.base': 'The evening milk in litres field is required.',
					'number.empty': 'The evening milk in litres field is required.',
				}),
			}),
		)
		.optional(),
})
