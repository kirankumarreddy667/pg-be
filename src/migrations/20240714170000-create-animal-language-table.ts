import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('animal_language', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			animal_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_language')
	},
}
