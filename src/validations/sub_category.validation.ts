import Joi from 'joi';

export const subcategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Subcategory name is required',
    'string.empty': 'Subcategory name cannot be empty',
  }),
}).unknown(false);