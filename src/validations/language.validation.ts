import Joi from 'joi';

export const createLanguageSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Language name is required',
    'string.empty': 'Language name cannot be empty',
  }),
  language_code: Joi.string().min(2).max(10).required().messages({
    'any.required': 'Language code is required',
    'string.empty': 'Language code cannot be empty',
    'string.min': 'Language code must be at least 2 characters',
    'string.max': 'Language code must be at most 10 characters',
  }),
});

export const updateLanguageSchema = Joi.object({
  name: Joi.string().messages({
    'string.empty': 'Language name cannot be empty',
  }),
  language_code: Joi.string().min(2).max(10).messages({
    'string.empty': 'Language code cannot be empty',
    'string.min': 'Language code must be at least 2 characters',
    'string.max': 'Language code must be at most 10 characters',
  }),
});

export const updateUserLanguageSchema = Joi.object({
  language_id: Joi.number().required().messages({
    'any.required': 'Language ID is required',
    'number.base': 'Language ID must be a number',
  }),
}); 