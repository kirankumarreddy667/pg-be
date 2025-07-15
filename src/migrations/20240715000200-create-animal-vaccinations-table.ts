import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('animal_vaccinations', {
			vaccination_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			animal_number: {
				type: Sequelize.STRING,
				allowNull: false,
				primaryKey: true,
			},
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_vaccinations')
	},
}
