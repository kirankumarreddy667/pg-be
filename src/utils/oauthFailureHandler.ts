import { Request, Response, NextFunction } from 'express'
import RESPONSE from './response'

export function oauthFailureHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	console.error('OAuth Failure:', err)
	RESPONSE.FailureResponse(res, 401, {
		message: 'Social authentication failed',
	})
}
