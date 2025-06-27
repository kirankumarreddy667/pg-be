import { Request, Response, NextFunction } from 'express'
import { Schema } from 'joi'
import RESPONSE from '@/utils/response'

export const validateRequest = (schema: Schema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body, {
			abortEarly: false,
			stripUnknown: true,
		})

		if (error) {
			const errors = error.details.reduce(
				(acc, el) => {
					if (el.path.length > 0) {
						acc[el.path[0]] = [...(acc[el.path[0]] || []), el.message]
					}
					return acc
				},
				{} as Record<string, string[]>,
			)

			return RESPONSE.FailureResponse(res, 422, {
				message: 'The given data was invalid.',
				errors: Object.values(errors).flat(),
			})
		}

		next()
	}
}
