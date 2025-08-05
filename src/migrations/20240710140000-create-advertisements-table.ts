import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('advertisements', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			name: {
				type: Sequelize.STRING(191),
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
				type: Sequelize.STRING(191),
				allowNull: true,
			},
			status: {
				type: Sequelize.TINYINT,
				allowNull: false,
				defaultValue: 1,
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
		await queryInterface.dropTable('advertisements')
	},
}
