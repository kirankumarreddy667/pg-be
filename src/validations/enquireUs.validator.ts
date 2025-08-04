import Joi from 'joi'

export const createEnquirySchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(100).required().messages({
    'any.required': 'The first_name field is required.',
    'string.empty': 'The first_name field is required.',
    'string.min': 'The first_name must be at least 2 characters long.',
    'string.max': 'The first_name must be less than 100 characters.',
  }),

  last_name: Joi.string().trim().max(100).optional(),

  email: Joi.string().email().required().messages({
    'any.required': 'The email field is required.',
    'string.empty': 'The email field is required.',
    'string.email': 'The email must be a valid email address.',
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'any.required': 'The phone field is required.',
      'string.empty': 'The phone field is required.',
      'string.pattern.base': 'The phone must be a valid 10-digit Indian mobile number.',
    }),

  query: Joi.string().trim().min(5).required().messages({
    'any.required': 'The query field is required.',
    'string.empty': 'The query field is required.',
    'string.min': 'The query must be at least 5 characters long.',
  }),
})
