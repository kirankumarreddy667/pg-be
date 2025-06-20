import { Request, Response, NextFunction } from 'express'
import { TokenService } from '@/services/token.service'
import { AuthenticatedRequest, User, UserRole } from '@/types/index'
import RESPONSE from '@/utils/response'
import { sanitize } from 'class-sanitizer'
import { plainToClass } from 'class-transformer'
import { verify } from 'jsonwebtoken'
import { env } from '@/config/env'

type ParamsDictionary = Record<string, string>

// CSRF Protection middleware
export const csrfProtection = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const csrfToken = req.headers['x-csrf-token']
	if (!csrfToken || csrfToken !== req.cookies['csrf-token']) {
		RESPONSE.FailureResponse(res, 403, { message: 'Invalid CSRF token' })
		return
	}
	next()
}

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

	if (req.query) {
		const sanitizedQuery = plainToClass(Object, req.query) as ParamsDictionary
		sanitize(sanitizedQuery)
		req.query = sanitizedQuery
	}

	next()
}

export const authenticate = (
	req: AuthenticatedRequest,
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
		const decoded = verify(token, env.JWT_ACCESS_SECRET) as {
			userId: number
			role: UserRole
			type: string
		}

		if (decoded.type !== 'access') {
			RESPONSE.FailureResponse(res, 401, { message: 'Invalid token type' })
			return
		}

		const isBlacklisted = TokenService.isTokenBlacklisted(token)
		if (isBlacklisted) {
			RESPONSE.FailureResponse(res, 401, { message: 'Token has been revoked' })
			return
		}

		// Create a minimal user object with required fields
		const user: User = {
			id: decoded.userId,
			email: '', // This will be populated by the database
			role: decoded.role,
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
	return (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	): void => {
		if (!req.user) {
			RESPONSE.FailureResponse(res, 401, { message: 'User not authenticated' })
			return
		}

		if (!roles.includes(req.user.role)) {
			RESPONSE.FailureResponse(res, 403, {
				message: 'Insufficient permissions',
			})
			return
		}

		next()
	}
}

export const refreshTokenMiddleware = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const refreshToken = req.cookies['refresh-token'] as string
		if (!refreshToken) {
			RESPONSE.FailureResponse(res, 401, {
				message: 'No refresh token provided',
			})
			return
		}

		const decoded = verify(refreshToken, env.JWT_REFRESH_SECRET) as {
			userId: number
			role: UserRole
			type: string
		}
		if (decoded.type !== 'refresh') {
			RESPONSE.FailureResponse(res, 401, { message: 'Invalid token type' })
			return
		}

		const isBlacklisted = TokenService.isTokenBlacklisted(refreshToken)
		if (isBlacklisted) {
			RESPONSE.FailureResponse(res, 401, { message: 'Token has been revoked' })
			return
		}

		// Create a minimal user object with required fields
		const user: User = {
			id: decoded.userId,
			email: '', // This will be populated by the database
			role: decoded.role,
		}

		req.user = user
		next()
	} catch (error) {
		if (error instanceof Error) {
			RESPONSE.FailureResponse(res, 401, { message: error.message })
		} else {
			RESPONSE.FailureResponse(res, 401, { message: 'Token refresh failed' })
		}
	}
}
