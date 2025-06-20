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
}

const RESPONSE = {
	SuccessResponse: <T>(
		res: Response,
		status: number,
		data: ResponseData<T>,
	): void => {
		const response: SuccessResponse<T> = {
			success: true,
			message: data.message,
			data: data.data,
		}
		res.status(status).json(response)
	},

	FailureResponse: (
		res: Response,
		status: FailureStatus,
		data: {
			message: string
			data?: null
			errors?: string[]
			stack?: string
		},
	): void => {
		const response: ErrorResponse = {
			success: false,
			message: data.message,
			...(data.errors && { errors: data.errors }),
			...(data.stack && { stack: data.stack }),
		}
		res.status(status).json(response)
	},
}

export default RESPONSE

// if (skip >= countDocuments) {
//     return RESPONSE.SuccessResponse(res, { message: "This page does not exist" , data:[]});
//   }
