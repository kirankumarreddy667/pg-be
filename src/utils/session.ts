import session from 'express-session'
import { RequestHandler } from 'express'
import { env } from '@/config/env'
import { logger } from '@/config/logger'

// Session store configuration (you can add Redis or other stores here)
const sessionConfig = {
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: 'strict' as const,
	},
	name: 'sessionId', // Change default connect.sid to something less obvious
}

// Create session middleware
const sessionMiddleware = session(sessionConfig) as unknown as RequestHandler

// Handle session errors
process.on('unhandledRejection', (error: Error) => {
	logger.error(
		`Session error: ${error instanceof Error ? error.message : String(error)}`,
	)
	if (error instanceof Error && error.stack) {
		logger.error(error.stack)
	}
})

export default sessionMiddleware
