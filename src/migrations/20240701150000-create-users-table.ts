import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			phone_number: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			farm_name: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
			},
			address: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			pincode: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			taluka: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			district: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			state: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			country: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			payment_status: {
				type: Sequelize.STRING,
				defaultValue: 'free',
			},
			remember_token: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			village: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			otp_status: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			firebase_token: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			device_id: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			device_type: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			language_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			record_milk_refresh: {
				type: Sequelize.STRING(20),
				allowNull: true,
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			googleId: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
			},
			facebookId: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
			},
			provider: {
				type: Sequelize.JSON,
				allowNull: false,
				defaultValue: [],
			},
			avatar: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			emailVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('users')
	},
}
