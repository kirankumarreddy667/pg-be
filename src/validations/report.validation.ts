import joi from 'joi'

export const reportSchema = joi.object({
	report_type: joi.string().required(),
	email: joi.string().email().required(),
	start_date: joi.date().when('report_type', {
		is: joi
			.string()
			.valid(
				'health_report',
				'manure_production',
				'milk_production_quality',
				'profit_loss_with_purchase_selling_price',
				'profit_loss',
				'income_expense',
				'milk_production_quantity',
				'milk_output_report',
			),
		then: joi.required(),
		otherwise: joi.optional(),
	}),
	end_date: joi.date().when('report_type', {
		is: joi
			.string()
			.valid(
				'health_report',
				'manure_production',
				'milk_production_quality',
				'profit_loss_with_purchase_selling_price',
				'profit_loss',
				'income_expense',
				'milk_production_quantity',
				'milk_output_report',
			),
		then: joi.required(),
		otherwise: joi.optional(),
	}),
	animal_id: joi.number().when('report_type', {
		is: joi
			.string()
			.valid('animal_profile_certificate', 'animal_breeding_history_report'),
		then: joi.required(),
		otherwise: joi.optional(),
	}),
	animal_number: joi.string().when('report_type', {
		is: joi
			.string()
			.valid(
				'animal_profile_certificate',
				'animal_breeding_history_report',
				'milk_output_report',
			),
		then: joi.required(),
		otherwise: joi.optional(),
	}),
})
