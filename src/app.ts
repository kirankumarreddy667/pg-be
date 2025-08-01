import express, {
	Application,
	RequestHandler,
	ErrorRequestHandler,
	Request,
	Response,
} from 'express'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
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

// Validate environment variables before starting the app
try {
	validateEnv()
} catch (error) {
	if (error instanceof EnvironmentError) {
		logger.error('\n❌ Environment Validation Failed:')
		logger.error(String(error.message))
		logger.error('\nPlease check your environment variables and try again.')
		if (error instanceof Error && error.stack) {
			logger.error(error.stack)
		}
	} else {
		logger.error('\n❌ Unexpected error during environment validation:')
		logger.error(error instanceof Error ? error.message : 'Unknown error')
		if (error instanceof Error && error.stack) {
			logger.error(error.stack)
		}
	}
	process.exit(1)
}

process.on('uncaughtException', (err: Error): void => {
	if (err.stack) {
		logger.error(`Error: ${err.message}\n${err.stack}`)
	} else {
		logger.error(`Error: ${err.message}`)
	}
	logAuditEvent({ user: { id: 'system' } }, undefined, 'Un caught exception', {
		userId: 'system',
		action: 'uncaughtException',
		details: err.message,
	})
	logger.error(`Shutting down the server for handling uncaught exceptions`)
	process.exit(1)
})

class Server {
	private readonly app: Application
	private readonly port: number
	private server: ReturnType<Application['listen']> | undefined

	constructor() {
		this.app = express()
		this.port = parseInt(process.env.PORT as string, 10) || 3000
		this.config()
		this.routes()
	}

	private config(): void {
		this.app.disable('x-powered-by')
		this.app.use(helmet(helmetOptions))
		this.app.use(cors(options))
		this.app.use(
			createRateLimiter(15 * 60 * 1000, 100) as unknown as RequestHandler,
		)
		this.app.use(express.json({ limit: '20mb' }))
		this.app.use(express.urlencoded({ extended: true, limit: '20mb' }))
		this.app.use(session)
		this.app.use(express.static(path.join(process.cwd(), 'public')))
		this.app.set('view engine', 'ejs')
		this.app.set('views', path.join(__dirname, 'views'))
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

		// Add middleware to fix Swagger UI asset loading issues
		this.app.use('/api/v1/swagger', (req: Request, res: Response, next) => {
			// Force HTTP protocol for Swagger assets
			if (req.headers.referer && req.headers.referer.includes('https://')) {
				res.setHeader('Content-Security-Policy', `upgrade-insecure-requests`)
			}
			next()
		})

		this.app.use('/api/v1', v1Router)

		// Swagger setup
		const swags = swaggerjsdoc(swagOptions)

		// Serve Swagger JSON
		this.app.get('/api/v1/swagger.json', (_req: Request, res: Response) => {
			res.setHeader('Content-Type', 'application/json')
			res.send(swags)
		})

		// Serve Swagger UI with proper asset handling
		this.app.use(
			'/api/v1/swagger',
			swaggerui.serve,
			swaggerui.setup(swags, {
				swaggerOptions: {
					url: '/api/v1/swagger.json',
					dom_id: '#swagger-ui',
					layout: 'BaseLayout',
					deepLinking: true,
					persistAuthorization: true,
					// Force relative URLs
					urls: [
						{
							name: 'API Documentation',
							url: '/api/v1/swagger.json',
						},
					],
				},
				customCss: '.swagger-ui .topbar { display: none }',
				customSiteTitle: 'POWERGOTHA API Documentation',
				swaggerUrl: '/api/v1/swagger.json',
				explorer: true,
			}),
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
			if (error instanceof Error && error.stack) {
				logger.error(`Failed to start server: ${error.message}\n${error.stack}`)
			} else {
				logger.error(
					`Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
				)
			}
			process.exit(1)
		}
	}

	private handleUncaughtRejection(): void {
		process.on('unhandledRejection', (err: Error): void => {
			logAuditEvent(
				{ user: { id: 'system' } },
				undefined,
				'Un handled rejection',
				{
					userId: 'system',
					action: 'unhandledRejection',
					details: err.message,
				},
			)
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
