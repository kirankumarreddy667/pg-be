import { Response, Request } from 'express'
import RESPONSE, { type FailureStatus } from './response'
import { logAuditEvent, logger } from '@/config/logger'

// Base error class for all application errors
export class AppError extends Error {
	public readonly statusCode: number
	public readonly isOperational: boolean
	public readonly errors: string[]

	constructor(
		message: string,
		statusCode: number,
		errors: string[] = [],
		isOperational: boolean = true,
	) {
		super(message)
		this.statusCode = statusCode
		this.isOperational = isOperational
		this.errors = errors.length > 0 ? errors : [message]
		Error.captureStackTrace(this, this.constructor)
	}

	// Method to send error response using RESPONSE utility
	public sendErrorResponse(req: Request, res: Response): void {
		// Send error response
		RESPONSE.FailureResponse(res, this.statusCode as FailureStatus, {
			message: this.message,
			data: [],
		})

		// 1. Log to error.log
		const errorMessage = `path=${req.path} method=${req.method} status=${this.statusCode} error=${this.message}`
		logger.error(errorMessage, { stack: this.stack })

		// 2. Log audit trail to all.log
		let userId = 'anonymous'
		const { user } = req as { user?: { id?: string | number } }
		userId = user?.id ? String(user.id) : userId
		logAuditEvent(
			{ user: { id: userId } },
			undefined,
			this.isOperational ? 'Operational Error' : 'Programming Error',
			{
				error: this.message,
				statusCode: this.statusCode,
				path: req.path,
				method: req.method,
			},
		)
	}
}

// Specific error classes for different scenarios
export class ValidationError extends AppError {
	constructor(message: string, errors: string[] = []) {
		super(message, 400, errors)
	}
}

export class AuthenticationError extends AppError {
	constructor(
		message: string = 'Authentication failed',
		errors: string[] = [],
	) {
		super(message, 401, errors)
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Not authorized', errors: string[] = []) {
		super(message, 403, errors)
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found', errors: string[] = []) {
		super(message, 404, errors)
	}
}

export class ConflictError extends AppError {
	constructor(
		message: string = 'Resource already exists',
		errors: string[] = [],
	) {
		super(message, 409, errors)
	}
}

export class RateLimitError extends AppError {
	constructor(message: string = 'Too many requests', errors: string[] = []) {
		super(message, 429, errors)
	}
}

export class DatabaseError extends AppError {
	constructor(
		message: string = 'Database operation failed',
		errors: string[] = [],
	) {
		super(message, 500, errors, false)
	}
}

export class ValidationRequestError extends Error {
	public status?: number
	public errors: Record<string, string[]>

	constructor(
		errors: Record<string, string[]>,
		message = 'The given data was invalid.',
	) {
		super(message)
		this.name = 'ValidationRequestError'
		this.errors = errors
	}
}

// Global error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response): void => {
	if (err instanceof ValidationRequestError) {
		res.status(422).json({
			message: err.message,
			errors: err.errors,
		})
		return
	}

	if (err instanceof AppError) {
		err.sendErrorResponse(req, res)
		return
	}

	// Handle unknown errors
	const message =
		process.env.NODE_ENV === 'production'
			? 'Internal server error'
			: err.message

	const unknownError = new AppError(message, 500, [], false)

	unknownError.sendErrorResponse(req, res)
}
