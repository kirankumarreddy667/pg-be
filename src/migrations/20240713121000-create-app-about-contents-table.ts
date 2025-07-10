import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('app_about_contents', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			language_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			content: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable('app_about_contents')
	},
}
