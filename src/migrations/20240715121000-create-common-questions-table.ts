import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('common_questions', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sub_category_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			question: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			validation_rule: {
				type: DataTypes.STRING,
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
			form_type_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			validation_rule_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			date: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			form_type_value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question_tag: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			question_unit: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			hint: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			sequence_number: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		})
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('common_questions')
	},
}
