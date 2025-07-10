import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('summernotes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			article_category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			content: {
				type: Sequelize.TEXT('long'),
				allowNull: false,
			},
			article_thumb: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			article_header: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			article_summary: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			article_images: {
				type: Sequelize.TEXT,
				allowNull: false,
				comment: 'JSON string: [{"img":"filename.jpg","name":"desc"}]',
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
		await queryInterface.dropTable('summernotes')
	},
}
