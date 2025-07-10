import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('user_farm_details', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			farm_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			farm_type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			farm_type_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			loose_housing: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			silage: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			azzola: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			hydroponics: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('user_farm_details')
	},
}
