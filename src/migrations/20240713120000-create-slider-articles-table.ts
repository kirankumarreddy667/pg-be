import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('slider_articles', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
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
			image: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			web_url: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			subtitle: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			thumbnail: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('slider_articles')
	},
}
