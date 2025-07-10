import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('user_offers', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			offer_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			plan_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			product_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			offer_type: {
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
		await queryInterface.dropTable('user_offers')
	},
}
