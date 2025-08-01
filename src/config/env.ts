import { config } from 'dotenv'
import { validateEnv, EnvSchema } from './env.validation'

// Load environment variables from .env file
config()

// Export validated environment variables
export const env = validateEnv()

// Type for environment variables
export type Env = EnvSchema

export const getEnvVar = (key: string): string => {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Environment variable ${key} is not set`)
	}
	return value
}
