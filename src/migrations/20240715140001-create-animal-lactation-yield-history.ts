import { QueryInterface, DataTypes } from 'sequelize'

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('animal_lactation_yield_history', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			pregnancy_status: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			lactating_status: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		})
		await queryInterface.addIndex('animal_lactation_yield_history', ['user_id'])
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_lactation_yield_history')
	},
}
