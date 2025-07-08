module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('advertisements', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			cost: {
				type: Sequelize.DOUBLE(10, 2),
				allowNull: false,
			},
			phone_number: {
				type: Sequelize.STRING(11),
				allowNull: false,
			},
			term_conditions: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			website_link: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			status: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
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
		await queryInterface.dropTable('advertisements')
	},
}
