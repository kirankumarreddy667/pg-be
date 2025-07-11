import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.addColumn('offers', 'image', {
			type: Sequelize.STRING,
			allowNull: true,
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn('offers', 'image')
	},
}
