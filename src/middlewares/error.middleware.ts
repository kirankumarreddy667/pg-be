import { Request, Response, NextFunction } from 'express'
import { errorHandler as globalErrorHandler } from '@/utils/errors'
import RESPONSE from '@/utils/response'

// Error handler middleware
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	globalErrorHandler(err, req, res)
}

// Not found handler
export const notFoundHandler = (
	req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	if (req.originalUrl === '/favicon.ico') {
		RESPONSE.SuccessResponse(res, 204, { message: 'No content.', data: {} })
		return
	}

	RESPONSE.FailureResponse(res, 404, { message: 'Not found.' })
}
