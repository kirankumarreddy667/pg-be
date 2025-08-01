import { Request } from 'express'
import { env } from '@/config/env'

/**
 * Get the base URL for the application
 * @param req Express request object (optional)
 * @returns The base URL
 */
export function getBaseUrl(req?: Request): string {
	// If request object is provided, use it to determine the base URL
	if (req) {
		const protocol = req.headers['x-forwarded-proto'] || req.protocol
		const host = req.headers['x-forwarded-host'] || req.headers.host

		// Ensure protocol and host are strings
		const protocolStr = Array.isArray(protocol) ? protocol[0] : protocol
		const hostStr = Array.isArray(host) ? host[0] : host

		if (!protocolStr || !hostStr) {
			return env.APP_URL
		}

		return `${protocolStr}://${hostStr}`
	}

	// Fallback to environment variable
	return env.APP_URL
}

/**
 * Get the API base URL
 * @param req Express request object (optional)
 * @returns The API base URL
 */
export function getApiBaseUrl(req?: Request): string {
	const baseUrl = getBaseUrl(req)
	return `${baseUrl}/api/v1`
}
