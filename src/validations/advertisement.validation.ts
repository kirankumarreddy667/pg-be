import Joi from 'joi'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024 // 3MB in bytes

export const advertisementSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  cost: Joi.number().required(),
  phone_number: Joi.string().max(11).required(),
  term_conditions: Joi.string().required(),
  status: Joi.number().optional(),
  photos: Joi.array().items(
    Joi.string()
      .pattern(/^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/)
      .custom((value: string, helpers) => {
        const base64Str = typeof value === 'string' ? value.split(',')[1] || '' : ''
        const sizeInBytes = Math.ceil((base64Str.length * 3) / 4)
        if (sizeInBytes > MAX_IMAGE_SIZE) {
          return helpers.error('any.invalid')
        }
        return value
      }, 'Base64 image size validation')
  ).max(5).optional(),
}) 