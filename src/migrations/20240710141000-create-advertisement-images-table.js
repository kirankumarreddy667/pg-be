module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('advertisement_images', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			advertisement_id: {
				type: Sequelize.INTEGER,
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
	down: async (queryInterface) => {
		await queryInterface.dropTable('advertisement_images')
	},
}
