import Joi from 'joi'

export const createUserPaymentSchema = Joi.object({
	plan_id: Joi.number().required().messages({
		'any.required': 'The plan id field is required.',
		'number.base': 'The plan id field is required.',
		'number.empty': 'The plan id field is required.',
	}),
	quantity: Joi.number().optional().positive().messages({
		'number.positive': 'The quantity must be a positive number.',
	}),
	offer_id: Joi.number().optional().positive().messages({
		'number.positive': 'The offer id must be a positive number.',
	}),
	coupon_id: Joi.number().optional().positive().messages({
		'number.positive': 'The coupon id must be a positive number.',
	}),
})

export const verifyAndProcessPayment = Joi.object({
	razorpay_order_id: Joi.string().required().messages({
		'any.required': 'The razorpay order id field is required.',
		'string.empty': 'The razorpay order id field is required.',
	}),
	razorpay_payment_id: Joi.string().required().messages({
		'any.required': 'The razorpay payment id field is required.',
		'string.empty': 'The razorpay payment id field is required.',
	}),
	razorpay_signature: Joi.string().required().messages({
		'any.required': 'The razorpay signature field is required.',
		'string.empty': 'The razorpay signature field is required.',
	}),
})
