import winston from 'winston'
import { env } from './env'

// Custom filter to exclude error logs from a transport
const ignoreErrors = winston.format((info) => {
	if (info.level === 'error') {
		return false
	}
	return info
})

// Minimal, human-readable format for all logs
const minimalFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.printf((info) => {
		const timestamp = String(info.timestamp)
		const level = String(info.level)
		const message = String(info.message)
		const environment = String(env.NODE_ENV)
		if (level === 'error') {
			let msg = `Environment: ${environment}\nLevel: ${level}\nMessage: ${message}`
			if (typeof info.stack === 'string') msg += `\nStack: ${info.stack}`
			return `${timestamp}\n${msg}`
		}
		return `${timestamp} ${level}: ${message}`
	}),
)

// Create the logger instance
export const logger = winston.createLogger({
	level: env.NODE_ENV === 'development' ? 'debug' : 'info',
	transports: [
		new winston.transports.Console({ format: minimalFormat }),
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
			format: minimalFormat,
		}),
		new winston.transports.File({
			filename: 'logs/all.log',
			format: winston.format.combine(ignoreErrors(), minimalFormat),
		}),
	],
	defaultMeta: {
		service: 'powergotha-service',
		environment: env.NODE_ENV,
	},
})

// Create a stream object for Morgan
export const stream = {
	write: (message: string): void => {
		logger.info(message.trim())
	},
}

// Audit logging
export const logAuditEvent = (
	req: { user?: { id?: string | number } },
	_res: unknown,
	action: string,
	details: Record<string, unknown>,
): void => {
	const auditLog = {
		userId: String(req.user?.id || 'anonymous'),
		action,
		details,
		timestamp: new Date().toISOString(),
	}
	logger.info(
		`Audit Log: userId=${auditLog.userId}, action=${auditLog.action}, details=${JSON.stringify(auditLog.details)}, timestamp=${auditLog.timestamp}`,
	)
}

interface SecurityDetails {
	type: 'security'
	event: string
	severity: 'low' | 'medium' | 'high'
	timestamp: string
	[key: string]: unknown
}

// Security logging
export const logSecurityEvent = (
	event: string,
	severity: 'low' | 'medium' | 'high',
	details: Record<string, unknown>,
): void => {
	const securityLog: SecurityDetails = {
		type: 'security',
		event,
		severity,
		timestamp: new Date().toISOString(),
		...details,
	}

	logger.warn('Security Event', securityLog)
}

// Data access logging
export const logDataAccess = (
	userId: string,
	dataType: string,
	operation: string,
	recordId: string,
	details: Record<string, unknown>,
): void => {
	const dataAccessLog = {
		type: 'data_access',
		userId,
		dataType,
		operation,
		recordId,
		timestamp: new Date().toISOString(),
		...details,
	}
	logger.info(`Data Access: ${JSON.stringify(dataAccessLog)}`)
}

// Error logging with stack trace
export const logError = (
	error: Error,
	context?: Record<string, unknown>,
): void => {
	logger.error('Error occurred', {
		type: 'error',
		message: error.message,
		stack: error.stack,
		...context,
	})
}

// Development logging (only in development environment)
if (env.NODE_ENV === 'development') {
	logger.debug('Logger initialized in development mode')
}
