import Joi from 'joi'

export const saveDailyMilkRecordSchema = Joi.object({
	record_date: Joi.date().required(),
	cows_daily_milk_data: Joi.array()
		.items(
			Joi.object({
				animal_id: Joi.number().integer().required(),
				animal_number: Joi.string().required(),
				morning_milk_in_litres: Joi.number().required(),
				evening_milk_in_litres: Joi.number().required(),
			}),
		)
		.optional(),
	buffalos_daily_milk_data: Joi.array()
		.items(
			Joi.object({
				animal_id: Joi.number().integer().required(),
				animal_number: Joi.string().required(),
				morning_milk_in_litres: Joi.number().required(),
				evening_milk_in_litres: Joi.number().required(),
			}),
		)
		.optional(),
})
