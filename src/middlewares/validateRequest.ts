import { Request, Response, NextFunction } from 'express'
import { Schema } from 'joi'

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

			return res.status(422).json({
				message: 'The given data was invalid.',
				errors,
			})
		}

		next()
	}
}
