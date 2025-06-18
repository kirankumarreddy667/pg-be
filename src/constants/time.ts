/**
 * Time constants in milliseconds
 * Used for various time-based operations in the application
 */
export const TIME = {
	SECOND: 1000,
	MINUTE: 60 * 1000,
	HOUR: 60 * (60 * 1000), // 60 minutes
	DAY: 24 * (60 * 60 * 1000), // 24 hours
	WEEK: 7 * (24 * 60 * 60 * 1000), // 7 days
	MONTH: 30 * (24 * 60 * 60 * 1000), // 30 days
	YEAR: 365 * (24 * 60 * 60 * 1000), // 365 days
} as const

/**
 * JWT token expiration times
 * Used for access and refresh tokens
 */
export const JWT_EXPIRATION = {
	ACCESS_TOKEN: '15m', // 15 minutes
	REFRESH_TOKEN: '7d', // 7 days
} as const

/**
 * Cookie expiration times
 * Used for various cookies in the application
 */
export const COOKIE_EXPIRATION = {
	REFRESH_TOKEN: TIME.WEEK, // 7 days
	SESSION: TIME.DAY, // 24 hours
} as const
