import { Request, Response, NextFunction, RequestHandler } from 'express'
import { AuthenticatedRequest } from '../types'

type AsyncRequestHandler = (
	req: Request | AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => Promise<void> | void

/**
 * Wraps an async route handler to catch errors and pass them to Express's error handling middleware
 * @param fn The async route handler function
 * @returns A wrapped function that catches errors and passes them to next()
 */
export const wrapAsync = (fn: AsyncRequestHandler): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}
