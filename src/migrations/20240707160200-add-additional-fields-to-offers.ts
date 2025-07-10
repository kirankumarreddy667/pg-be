import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.addColumn('offers', 'additional_months', {
			type: Sequelize.INTEGER,
			allowNull: true,
		})

		await queryInterface.addColumn('offers', 'additional_years', {
			type: Sequelize.INTEGER,
			allowNull: true,
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn('offers', 'additional_months')
		await queryInterface.removeColumn('offers', 'additional_years')
	},
}
