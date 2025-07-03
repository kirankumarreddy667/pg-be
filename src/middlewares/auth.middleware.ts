import { Request, Response, NextFunction } from 'express'
import { User } from '@/types/index'
import RESPONSE from '@/utils/response'
import { sanitize } from 'class-sanitizer'
import { plainToClass } from 'class-transformer'
import { verify, JwtPayload } from 'jsonwebtoken'
import { env } from '@/config/env'

type ParamsDictionary = Record<string, string>

// XSS Protection middleware
export const xssProtection = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// Sanitize request body
	if (req.body) {
		const sanitizedBody = plainToClass(Object, req.body) as Record<
			string,
			unknown
		>
		sanitize(sanitizedBody)
		req.body = sanitizedBody
	}

	// Sanitize request params
	if (req.params) {
		const sanitizedParams = plainToClass(Object, req.params) as ParamsDictionary
		sanitize(sanitizedParams)
		req.params = sanitizedParams
	}

	next()
}

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader?.startsWith('Bearer ')) {
			RESPONSE.FailureResponse(res, 401, { message: 'No token provided' })
			return
		}

		const token = authHeader.split(' ')[1]
		const decoded = verify(token, env.JWT_ACCESS_SECRET) as JwtPayload

		if (decoded.type !== 'access') {
			RESPONSE.FailureResponse(res, 401, { message: 'Invalid token type' })
			return
		}

		// Create a minimal user object with required fields
		const user: User = {
			id: Number(decoded.sub),
		}

		req.user = user
		next()
	} catch (error) {
		if (error instanceof Error) {
			RESPONSE.FailureResponse(res, 401, { message: error.message })
		} else {
			RESPONSE.FailureResponse(res, 401, { message: 'Authentication failed' })
		}
	}
}

export const authorize = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			RESPONSE.FailureResponse(res, 401, { message: 'User not authenticated' })
			return
		}

		if (!((req.user as User).roles || []).some((r) => roles.includes(r))) {
			RESPONSE.FailureResponse(res, 403, {
				message: 'Insufficient permissions',
			})
			return
		}

		next()
	}
}
