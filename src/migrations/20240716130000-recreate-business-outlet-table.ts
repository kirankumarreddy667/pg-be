import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		// Drop the existing table
		await queryInterface.dropTable('business_outlet')

		// Create the new table with updated structure
		await queryInterface.createTable('business_outlet', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			business_name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			business_address: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			assign_to: {
				type: Sequelize.INTEGER,
				allowNull: true,
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
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		})
	},

	down: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		// Drop the new table
		await queryInterface.dropTable('business_outlet')

		// Recreate the old table structure
		await queryInterface.createTable('business_outlet', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			business_name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			business_address: {
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
}
