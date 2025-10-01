import Joi from 'joi'

export const reportSchema = Joi.object({
	report_type: Joi.string().required().messages({
		'any.required': 'The report type field is required.',
		'string.empty': 'The report type field is required.',
	}),
	email: Joi.string().required().messages({
		'any.required': 'The email field is required.',
		'string.empty': 'The email field is required.',
	}),
	start_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.when('report_type', {
			is: Joi.valid(
				'health_report',
				'manure_production',
				'milk_production_quality',
				'profit_loss_with_purchase_selling_price',
				'profit_loss',
				'income_expense',
				'milk_production_quantity',
				'milk_output_report',
			),
			then: Joi.required().messages({
				'any.required': 'The start_date field is required.',
				'string.empty': 'The start_date field is required.',
				'string.pattern.base':
					'The start date does not match the format Y-m-d.',
			}),
			otherwise: Joi.optional(),
		}),
	end_date: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.when('report_type', {
			is: Joi.valid(
				'health_report',
				'manure_production',
				'milk_production_quality',
				'profit_loss_with_purchase_selling_price',
				'profit_loss',
				'income_expense',
				'milk_production_quantity',
				'milk_output_report',
			),
			then: Joi.required().messages({
				'any.required': 'The end_date field is required.',
				'string.empty': 'The end_date field is required.',
				'string.pattern.base':
					'The start date does not match the format Y-m-d.',
			}),
			otherwise: Joi.optional(),
		}),
	animal_id: Joi.number().when('report_type', {
		is: Joi.valid(
			'animal_profile_certificate',
			'animal_breeding_history_report',
		),
		then: Joi.required().messages({
			'any.required': 'The animal id field is required.',
			'number.empty': 'The animal id field is required.',
			'number.base': 'The selected animal id is invalid.',
		}),
		otherwise: Joi.optional(),
	}),
	animal_number: Joi.string().when('report_type', {
		is: Joi.valid(
			'animal_profile_certificate',
			'animal_breeding_history_report',
		),
		then: Joi.required().messages({
			'any.required': 'The animal number field is required.',
			'string.empty': 'The animal number field is required.',
		}),
		otherwise: Joi.optional(),
	}),
})
