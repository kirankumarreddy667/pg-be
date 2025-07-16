import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('daily_record_questions', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			sub_category_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			question: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			validation_rule_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			form_type_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			date: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			question_tag: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			question_unit: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			form_type_value: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			delete_status: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			sequence_number: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			hint: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('daily_record_questions')
	},
}
