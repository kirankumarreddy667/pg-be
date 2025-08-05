import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('advertisement_images', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			advertisement_id: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'advertisements',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			image: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			created_at: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null,
			},
			updated_at: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null,
			},
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('advertisement_images')
	},
}
