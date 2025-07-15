import Joi from 'joi';

export const createCouponSchema = Joi.object({
    coupon_code: Joi.string().required(),
    discount_type: Joi.string().valid('percentage', 'amount').required(),
    discount_value: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    status: Joi.boolean().required(),
    created_by: Joi.number().optional(),
});
