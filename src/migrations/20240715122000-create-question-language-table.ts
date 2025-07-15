import { QueryInterface, DataTypes } from 'sequelize'

export = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable('question_language', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'common_questions', key: 'id' },
				onDelete: 'CASCADE',
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'languages', key: 'id' },
				onDelete: 'CASCADE',
			},
			question: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			form_type_value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			hint: {
				type: DataTypes.TEXT,
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
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('question_language')
	},
}
