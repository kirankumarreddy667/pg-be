import Joi from 'joi';

export const createUserPaymentSchema = Joi.object({
  plan_id: Joi.number().required().messages({
    'any.required': 'Plan ID is required',
    'number.base': 'Plan ID must be a number',
  }),
  payment_gateway: Joi.string().valid('razorpay').required().messages({
    'any.required': 'Payment gateway is required',
    'string.empty': 'Payment gateway cannot be empty',
    'any.only': 'Only Razorpay gateway is supported for now',
  }),
  currency: Joi.string().required().messages({
    'any.required': 'Currency is required',
    'string.empty': 'Currency cannot be empty',
  }),
  coupon_code: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Coupon code must be a string',
  }),
  offer_code: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Offer code must be a string',
  }),
});

export const getUserPaymentSchema = Joi.object({
  plan_id: Joi.number().required().messages({
    'any.required': 'Plan ID is required',
    'number.base': 'Plan ID must be a number',
  }),
});