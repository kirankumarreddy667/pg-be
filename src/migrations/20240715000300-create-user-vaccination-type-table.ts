import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('user_vaccination_type', {
			vaccination_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			type_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('user_vaccination_type')
	},
}
