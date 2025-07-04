import Joi from 'joi'

export const createUnitSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Unit name is required',
    'string.empty': 'Unit name cannot be empty',
  }),
  display_name: Joi.string().required().messages({
    'any.required': 'Display name is required',
    'string.empty': 'Display name cannot be empty',
  }),
})

export const updateUnitSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Unit name cannot be empty',
  }),
  display_name: Joi.string().optional().messages({
    'string.empty': 'Display name cannot be empty',
  }),
})
