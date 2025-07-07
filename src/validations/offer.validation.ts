import Joi from 'joi'

export const createOfferSchema = Joi.object({
  image: Joi.string().uri().optional().messages({
    'string.uri': 'Image must be a valid URL',
  }),

  additional_months: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Additional months must be a number',
    'number.min': 'Additional months cannot be negative',
  }),

  additional_years: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Additional years must be a number',
    'number.min': 'Additional years cannot be negative',
  }),

  language_id: Joi.number().integer().required().messages({
    'any.required': 'Language ID is required',
    'number.base': 'Language ID must be a number',
  }),
})
