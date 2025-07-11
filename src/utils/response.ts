import { Response } from 'express'
import { ErrorResponse, SuccessResponse } from '@/types/index'

export type FailureStatus =
	| 400
	| 401
	| 403
	| 404
	| 413
	| 422
	| 429
	| 409
	| 500
	| 503

interface ResponseData<T = unknown> {
	message: string
	data?: T
	status?: number
}

const RESPONSE = {
	SuccessResponse: <T>(
		res: Response,
		status: number,
		data: ResponseData<T>,
	): void => {
		const response: SuccessResponse<T> & { status: number } = {
			message: data.message,
			data: data.data,
			status,
		}
		res.status(status).json(response)
	},

	FailureResponse: (
		res: Response,
		status: FailureStatus,
		data: {
			message: string
			data?: []
			errors?: string[] | Record<string, string[]>
			stack?: string
			status?: number
		},
	): void => {
		const response: ErrorResponse & { status: number } = {
			message: data.message,
			status,
			data: [],
			...(data.errors && { errors: data.errors }),
			...(data.stack && { stack: data.stack }),
		}
		res.status(status).json(response)
	},
}

export default RESPONSE
