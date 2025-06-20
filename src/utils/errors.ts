import { Response } from 'express'
import RESPONSE, { type FailureStatus } from './response'
import { logAuditEvent } from '@/config/logger'

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
	public sendErrorResponse(res: Response): void {
		// Log the error for monitoring
		logAuditEvent(
			res.req,
			res,
			this.isOperational ? 'Operational Error' : 'Programming Error',
			{
				error: this.message,
				statusCode: this.statusCode,
				path: res.req.path,
				method: res.req.method,
				...(process.env.NODE_ENV !== 'production' && { stack: this.stack }),
			},
		)

		// Send error response using RESPONSE utility with exact format
		RESPONSE.FailureResponse(res, this.statusCode as FailureStatus, {
			message: this.message,
			data: null,
			errors: this.errors,
			...(process.env.NODE_ENV !== 'production' && { stack: this.stack }),
		})
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

// Global error handler middleware
export const errorHandler = (err: Error, res: Response): void => {
	if (err instanceof AppError) {
		err.sendErrorResponse(res)
		return
	}

	// Handle unknown errors
	const unknownError = new AppError(
		'Internal server error',
		500,
		['An unexpected error occurred'],
		false,
	)
	unknownError.sendErrorResponse(res)
}
