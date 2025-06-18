import { Sequelize } from 'sequelize'
import { logger } from './logger'
import UserModel from '@/models/user.model'

// Create Sequelize instance
const sequelize = new Sequelize({
	dialect: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '3306'),
	database: process.env.DB_DATABASE || 'powergotha',
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD,
	logging: (msg) => logger.debug(msg),
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
})

// Test database connection
export const testConnection = async (): Promise<void> => {
	try {
		await sequelize.authenticate()
		logger.info('Database connection has been established successfully.')
	} catch (error) {
		logger.error('Unable to connect to the database:', error)
		throw error
	}
}

// Database object
const db = {
	Sequelize,
	sequelize,
	Users: UserModel(sequelize),
}

export default db
