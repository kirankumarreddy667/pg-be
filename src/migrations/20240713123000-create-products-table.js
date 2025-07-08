'use strict'

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('products', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			product_category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			language: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			product_title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			product_images: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			product_amount: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			product_description: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			product_variants: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			product_delivery_to: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			product_specifications: {
				type: Sequelize.TEXT,
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

	down: async (queryInterface) => {
		await queryInterface.dropTable('products')
	},
}
