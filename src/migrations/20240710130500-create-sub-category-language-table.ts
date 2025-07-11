import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('sub_category_language', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			sub_category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'subcategories', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			language_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'languages', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			sub_category_language_name: {
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
		await queryInterface.addConstraint('sub_category_language', {
			fields: ['sub_category_id', 'language_id'],
			type: 'unique',
			name: 'unique_sub_category_language_per_language',
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('sub_category_language')
	},
}
