import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import RESPONSE from '@/utils/response'

export const createRateLimiter = (
	windowMs: number,
	max: number,
): RequestHandler => {
	return rateLimit({
		windowMs,
		max,
		message: 'Too many requests from this IP, please try again later.',
		handler: (req: Request, res: Response, _next: NextFunction): void => {
			RESPONSE.FailureResponse(res, 429, { message: 'Too many requests' })
		},
		standardHeaders: true,
		legacyHeaders: false,
		keyGenerator: (req) => {
			// Get real IP from X-Forwarded-For header or connection
			const forwarded = req.headers['x-forwarded-for'] as string
			const ip = forwarded
				? forwarded.split(',')[0].trim()
				: req.connection.remoteAddress
			return ip || 'unknown'
		},
	})
}
