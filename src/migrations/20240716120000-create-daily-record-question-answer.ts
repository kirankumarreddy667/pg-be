import { QueryInterface, DataTypes } from 'sequelize'

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('daily_record_question_answer', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			daily_record_question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			answer: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			answer_date: {
				type: DataTypes.DATE,
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
		await queryInterface.addIndex('daily_record_question_answer', ['user_id'])
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('daily_record_question_answer')
	},
}
