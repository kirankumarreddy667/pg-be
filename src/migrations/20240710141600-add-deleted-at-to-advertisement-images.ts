import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.addColumn('advertisement_images', 'deleted_at', {
			type: Sequelize.DATE,
			allowNull: true,
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn('advertisement_images', 'deleted_at')
	},
}
