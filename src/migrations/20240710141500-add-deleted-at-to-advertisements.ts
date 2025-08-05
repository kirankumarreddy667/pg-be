import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.addColumn('advertisements', 'deleted_at', {
			type: Sequelize.DATE,
			allowNull: true,
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn('advertisements', 'deleted_at')
	},
}
