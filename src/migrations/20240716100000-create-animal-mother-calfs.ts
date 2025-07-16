import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('animal_mother_calfs', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			delivery_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			mother_animal_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			calf_animal_number: {
				type: DataTypes.STRING,
				allowNull: false,
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
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_mother_calfs')
	},
}
