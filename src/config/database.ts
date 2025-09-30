import { Sequelize } from 'sequelize'
import { logger } from './logger'
import { initModels } from '@/models'
import { env } from './env'

// Narrow type for mysql2 typeCast field
type MySQLTypeCastField = {
	type: string
	string: () => string | null
}

// Create Sequelize instance
const sequelize = new Sequelize(
	env.DB_DATABASE,
	env.DB_USERNAME,
	env.DB_PASSWORD,
	{
		host: env.DB_HOST,
		dialect: 'mysql',
		logging: false,
		dialectOptions: {
			charset: 'utf8mb4',
			dateStrings: true,
			typeCast: (field: unknown, next: () => unknown): unknown => {
				const f = field as Partial<MySQLTypeCastField>
				if (
					typeof f.type === 'string' &&
					(f.type === 'DATETIME' || f.type === 'TIMESTAMP') &&
					typeof f.string === 'function'
				) {
					return f.string()
				}
				return next()
			},
		},
		define: {
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
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
