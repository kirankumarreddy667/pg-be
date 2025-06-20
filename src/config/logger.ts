import winston from 'winston'
import { Request, Response } from 'express'
import { env } from './env'
import { AuditLog, User } from '@/types/index'

// Extend Express Request interface to include 'user'
declare module 'express' {
	interface Request {
		user?: User
	}
}

// Log levels
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
}

// Log colors
const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
}

winston.addColors(colors)

// Log format
const format = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.colorize({ all: true }),
	winston.format.printf((info) => {
		// Ensure all values are strings
		const timestamp = String(info.timestamp)
		const level = String(info.level)
		const message = String(info.message)
		return `${timestamp} ${level}: ${message}`
	}),
)

// Transports
const transports = [
	// Console transport for all environments
	new winston.transports.Console(),
	// File transport for errors
	new winston.transports.File({
		filename: 'logs/error.log',
		level: 'error',
	}),
	// File transport for all logs
	new winston.transports.File({ filename: 'logs/all.log' }),
]

// Create the logger instance
export const logger = winston.createLogger({
	level: env.NODE_ENV === 'development' ? 'debug' : 'info',
	levels,
	format,
	transports,
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
	req: Request,
	res: Response,
	action: string,
	details: Record<string, unknown>,
): void => {
	const auditLog: AuditLog = {
		userId: String(req.user?.id || 'anonymous'),
		action,
		details,
		timestamp: new Date(),
		ipAddress: req.ip,
		userAgent: req.get('user-agent') || undefined,
	}

	logger.info('Audit Log:', auditLog)
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

interface DataAccessDetails {
	type: 'data_access'
	userId: string
	dataType: string
	operation: string
	recordId: string
	timestamp: string
	[key: string]: unknown
}

// Data access logging
export const logDataAccess = (
	userId: string,
	dataType: string,
	operation: string,
	recordId: string,
	details: Record<string, unknown>,
): void => {
	const dataAccessLog: DataAccessDetails = {
		type: 'data_access',
		userId,
		dataType,
		operation,
		recordId,
		timestamp: new Date().toISOString(),
		...details,
	}

	logger.info('Data Access', dataAccessLog)
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
