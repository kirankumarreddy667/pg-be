module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('role_user', {
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			role_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'roles',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		})
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('role_user')
	},
}
