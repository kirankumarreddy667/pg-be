import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import RESPONSE from '@/utils/response'

export const createRateLimiter = (
	windowMs: number = 15 * 60 * 1000,
	max: number = 100,
): RequestHandler => {
	return rateLimit({
		windowMs,
		max,
		message: 'Too many requests from this IP, please try again later.',
		handler: (req: Request, res: Response, _next: NextFunction): void => {
			RESPONSE.FailureResponse(res, 429, { message: 'Too many requests' })
		},
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
}
