'use strict'

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('animal_type', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			animal_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				index: true,
			},
			type_id: {
				type: Sequelize.INTEGER,
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
		await queryInterface.addIndex('animal_type', ['animal_id'])
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('animal_type')
	},
}
