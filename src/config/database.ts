import { Sequelize } from 'sequelize'
import { logger } from './logger'
import { initModels } from '@/models'
import { env } from './env'

// Create Sequelize instance
const sequelize = new Sequelize(
	env.DB_DATABASE,
	env.DB_USERNAME,
	env.DB_PASSWORD,
	{
		host: env.DB_HOST,
		dialect: 'mysql',
		logging: false,
	},
)

// Test database connection
export const testConnection = async (): Promise<void> => {
	try {
		await sequelize.authenticate()
		logger.info('✅ Database connection has been established successfully.')
	} catch (error) {
		logger.error(
			`❌ Unable to connect to the database: ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}

// Initialize models
const db = {
	Sequelize,
	sequelize,
	...initModels(sequelize),
}

export default db
