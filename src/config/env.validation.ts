import Joi from 'joi'

export interface EnvSchema {
	NODE_ENV: 'development' | 'production' | 'test'
	PORT: string
	DB_HOST: string
	DB_PORT: string
	DB_DATABASE: string
	DB_USERNAME: string
	DB_PASSWORD: string
	SESSION_SECRET: string
	CSRF_SECRET: string
	JWT_ACCESS_SECRET: string
	JWT_REFRESH_SECRET: string
	CORS_ORIGIN: string
	LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug'
	MSG91_AUTH_KEY: string
	MSG91_TEMPLATE_ID: string
	MSG91_SENDER_ID: string
	MSG91_ENDPOINT: string
	APP_URL: string
	SWAGGER_URL: string
}

// Define environment schema
const envSchema = Joi.object<EnvSchema>({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: Joi.string().default('3000'),

	// Database configuration
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.string().default('3306'),
	DB_DATABASE: Joi.string().required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),

	// Security
	SESSION_SECRET: Joi.string().min(32).required().messages({
		'string.min': 'SESSION_SECRET must be at least 32 characters',
		'any.required': 'SESSION_SECRET is required',
	}),
	CSRF_SECRET: Joi.string().min(32).required().messages({
		'string.min': 'CSRF_SECRET must be at least 32 characters',
		'any.required': 'CSRF_SECRET is required',
	}),
	JWT_ACCESS_SECRET: Joi.string().min(32).required().messages({
		'string.min': 'JWT_ACCESS_SECRET must be at least 32 characters',
		'any.required': 'JWT_ACCESS_SECRET is required',
	}),
	JWT_REFRESH_SECRET: Joi.string().min(32).required().messages({
		'string.min': 'JWT_REFRESH_SECRET must be at least 32 characters',
		'any.required': 'JWT_REFRESH_SECRET is required',
	}),

	// CORS
	CORS_ORIGIN: Joi.string().default('*'),

	// Logging
	LOG_LEVEL: Joi.string()
		.valid('error', 'warn', 'info', 'debug')
		.default('info'),

	// MSG91
	MSG91_AUTH_KEY: Joi.string().required(),
	MSG91_TEMPLATE_ID: Joi.string().required(),
	MSG91_SENDER_ID: Joi.string().required(),
	MSG91_ENDPOINT: Joi.string().required(),

	// App URL
	APP_URL: Joi.string().uri().required(),

	// Swagger URL
	SWAGGER_URL: Joi.string().uri().default('http://localhost:3000'),
})

// Custom error class for environment validation
export class EnvironmentError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'EnvironmentError'
	}
}

// Export validation function
export const validateEnv = (): EnvSchema => {
	const { error, value } = envSchema.validate(process.env, {
		abortEarly: false,
		stripUnknown: true,
	}) as { error: Joi.ValidationError | undefined; value: EnvSchema }

	if (error) {
		throw new EnvironmentError(
			`Environment validation failed:\n${error.details
				.map((err) => `- ${err.path.join('.')}: ${err.message}`)
				.join('\n')}`,
		)
	}

	// Additional validation for production environment
	if (value.NODE_ENV === 'production') {
		const requiredSecrets = [
			{ name: 'JWT_ACCESS_SECRET', value: value.JWT_ACCESS_SECRET },
			{ name: 'JWT_REFRESH_SECRET', value: value.JWT_REFRESH_SECRET },
			{ name: 'SESSION_SECRET', value: value.SESSION_SECRET },
			{ name: 'CSRF_SECRET', value: value.CSRF_SECRET },
		]

		const missingSecrets = requiredSecrets.filter(
			(secret) => !secret.value || secret.value === 'your_secure_secret_here',
		)

		if (missingSecrets.length > 0) {
			throw new EnvironmentError(
				`Missing or invalid secrets in production environment: ${missingSecrets
					.map((s) => s.name)
					.join(', ')}`,
			)
		}
	}

	return value
}
