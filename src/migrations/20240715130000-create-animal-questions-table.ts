import { QueryInterface, DataTypes } from 'sequelize'

export = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('animal_questions', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			question_id: {
				type: DataTypes.INTEGER,
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
		await queryInterface.addIndex('animal_questions', ['animal_id'])
		await queryInterface.addIndex('animal_questions', ['question_id'])
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_questions')
	},
}
