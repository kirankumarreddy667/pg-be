import express, {
	Application,
	RequestHandler,
	ErrorRequestHandler,
	Request,
	Response,
	NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import swaggerjsdoc from 'swagger-jsdoc'
import swaggerui from 'swagger-ui-express'
import 'module-alias/register'
import { options } from '@/utils/cors'
import v1Router from './routes/index'
import swagOptions from './utils/swagger'
import RESPONSE from './utils/response'
import session from './utils/session'
import { logAuditEvent, logger } from './config/logger'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'
import { createRateLimiter } from './middlewares/rateLimit.middleware'
import { testConnection } from './config/database'
import { validateEnv, EnvironmentError } from './config/env.validation'
import { xssProtection } from './middlewares/auth.middleware'
import { helmetOptions } from './utils/helmet'
import csurf from 'csurf'
// import RedisConnectionManager from "./config/RedisConn"

// Validate environment variables before starting the app
try {
	validateEnv()
} catch (error) {
	if (error instanceof EnvironmentError) {
		logger.error('\n❌ Environment Validation Failed:')
		logger.error(error.message)
		logger.error('\nPlease check your environment variables and try again.')
	} else {
		logger.error('\n❌ Unexpected error during environment validation:')
		logger.error(error instanceof Error ? error.message : 'Unknown error')
	}
	process.exit(1)
}

process.on('uncaughtException', (err: Error): void => {
	logger.error(`Error: ${err.message}`)
	logAuditEvent({} as Request, {} as Response, 'Un caught exception', {
		userId: 'system',
		action: 'uncaughtException',
		details: err.message,
	})
	logger.error(`Shutting down the server for handling uncaught exceptions`)
	process.exit(1)
})

class Server {
	private app: Application
	private port: number
	private server: ReturnType<Application['listen']> | undefined

	constructor() {
		this.app = express()
		this.port = parseInt(process.env.PORT as string, 10) || 3000
		this.config()
		this.routes()
		// RedisConnectionManager.connect();
	}

	private config(): void {
		this.app.disable('x-powered-by')
		this.app.use(helmet(helmetOptions))
		this.app.use(cors(options))
		this.app.use(
			createRateLimiter(15 * 60 * 1000, 100) as unknown as RequestHandler,
		)
		this.app.use(express.json({ limit: '10kb' }))
		this.app.use(express.urlencoded({ extended: true, limit: '10kb' }))
		this.app.use(cookieParser())
		this.app.use(session)
		this.app.use(
			'/images',
			express.static(path.join(__dirname, '../src/public/images')),
		)
	}

	private routes(): void {
		// Handle root path
		this.app.get('/', (_req: Request, res: Response): void => {
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Server is healthy',
				data: {
					uptime: process.uptime(),
					timestamp: Date.now(),
				},
			})
		})

		// Apply security middleware only to API routes
		this.app.use('/api/v1', xssProtection as RequestHandler)

		// Use csurf middleware for CSRF protection on API routes
		this.app.use(
			'/api/v1',
			csurf({ cookie: true }) as unknown as RequestHandler,
		)

		// Provide CSRF token to clients (for SPAs, etc.)
		this.app.use(
			'/api/v1',
			(req: Request, res: Response, next: NextFunction) => {
				res.cookie('csrf-token', req.csrfToken())
				next()
			},
		)

		this.app.use('/api/v1', v1Router)

		// Swagger setup
		const swags = swaggerjsdoc(swagOptions)
		this.app.use(
			'/api/v1/docs',
			swaggerui.serve as unknown as RequestHandler,
			swaggerui.setup(swags) as unknown as RequestHandler,
		)

		// Add error handlers
		this.app.use(notFoundHandler as unknown as RequestHandler)
		this.app.use(errorHandler as unknown as ErrorRequestHandler)
	}

	public async start(): Promise<void> {
		try {
			// Test database connection before starting the server
			await testConnection()

			this.server = this.app.listen(this.port, () => {
				logger.info(`Server is running on port ${this.port}`)
			})

			this.handleUncaughtRejection()
			this.handleGracefulShutdown()
		} catch (error) {
			logger.error('Failed to start server:', error)
			process.exit(1)
		}
	}

	private handleUncaughtRejection(): void {
		process.on('unhandledRejection', (err: Error): void => {
			logAuditEvent({} as Request, {} as Response, 'Un handled rejection', {
				userId: 'system',
				action: 'unhandledRejection',
				details: err.message,
			})
			logger.error(`Shutting down the server for unhandled promise rejection`)
			this.server?.close(() => {
				process.exit(1)
			})
		})
	}

	private handleGracefulShutdown(): void {
		const signals = ['SIGINT', 'SIGTERM'] as const

		signals.forEach((signal) => {
			process.on(signal, (): void => {
				logger.info(`Received ${signal}. Shutting down gracefully.`)
				this.server?.close(() => {
					logger.info('Server closed')
					process.exit(0)
				})
			})
		})
	}
}

export default Server
