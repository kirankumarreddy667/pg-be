import Joi from 'joi';

export const formTypeSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Form type name is required',
    'string.empty': 'Form type name cannot be empty',
  }),
  description: Joi.string().allow(null, '').optional(),
});
