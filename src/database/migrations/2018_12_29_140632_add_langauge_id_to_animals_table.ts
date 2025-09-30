import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.addColumn('animals', 'language_id', {
			type: DataTypes.INTEGER,
			allowNull: false,
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.removeColumn('animals', 'language_id')
	},
}
