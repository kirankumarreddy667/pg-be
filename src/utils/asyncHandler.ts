import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps an async route handler to catch errors and pass them to Express's error handling middleware
 * @param fn The async route handler function
 * @returns A wrapped function that catches errors and passes them to next()
 */
export const wrapAsync = (
	fn: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
): RequestHandler => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}
