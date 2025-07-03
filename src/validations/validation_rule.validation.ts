import Joi from 'joi'

export const validationRuleSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'The name field is required.'
  }),
  description: Joi.string().optional(),
  constant_value: Joi.number().required().messages({
    'any.required': 'The constant_value field is required.'
  })
}) 