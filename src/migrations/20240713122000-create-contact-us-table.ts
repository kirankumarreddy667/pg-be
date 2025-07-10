import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('contact_us', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			phone_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			contact_email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			whatsapp: {
				type: Sequelize.STRING,
				allowNull: false,
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
		await queryInterface.dropTable('contact_us')
	},
}
