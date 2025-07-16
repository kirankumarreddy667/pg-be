import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyRecordQuestionAttributes {
	id?: number
	category_id?: number | null
	sub_category_id?: number | null
	question: string
	validation_rule_id: number
	form_type_id: number
	date?: boolean
	created_at?: Date
	updated_at?: Date
	question_tag: number
	question_unit: number
	form_type_value?: string | null
	delete_status?: boolean
	sequence_number: number
	hint?: string | null
}

export class DailyRecordQuestion
	extends Model<
		DailyRecordQuestionAttributes,
		Optional<
			DailyRecordQuestionAttributes,
			| 'id'
			| 'category_id'
			| 'sub_category_id'
			| 'date'
			| 'created_at'
			| 'updated_at'
			| 'form_type_value'
			| 'delete_status'
			| 'hint'
		>
	>
	implements DailyRecordQuestionAttributes
{
	public id!: number
	public category_id!: number | null
	public sub_category_id!: number | null
	public question!: string
	public validation_rule_id!: number
	public form_type_id!: number
	public date!: boolean
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public question_tag!: number
	public question_unit!: number
	public form_type_value!: string | null
	public delete_status!: boolean
	public sequence_number!: number
	public hint!: string | null
}

export default (sequelize: Sequelize): typeof DailyRecordQuestion => {
	DailyRecordQuestion.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			sub_category_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			question: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			validation_rule_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			form_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			date: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			question_tag: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			question_unit: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			form_type_value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			delete_status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			sequence_number: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
		},
		{
			sequelize,
			tableName: 'daily_record_questions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)

	// Associations
	DailyRecordQuestion.belongsTo(sequelize.models.Category, {
		foreignKey: 'category_id',
		as: 'Category',
	})
	DailyRecordQuestion.belongsTo(sequelize.models.Subcategory, {
		foreignKey: 'sub_category_id',
		as: 'Subcategory',
	})
	DailyRecordQuestion.belongsTo(sequelize.models.ValidationRule, {
		foreignKey: 'validation_rule_id',
		as: 'ValidationRule',
	})
	DailyRecordQuestion.belongsTo(sequelize.models.FormType, {
		foreignKey: 'form_type_id',
		as: 'FormType',
	})
	DailyRecordQuestion.belongsTo(sequelize.models.QuestionUnit, {
		foreignKey: 'question_unit',
		as: 'QuestionUnit',
	})
	DailyRecordQuestion.belongsTo(sequelize.models.QuestionTag, {
		foreignKey: 'question_tag',
		as: 'QuestionTag',
	})

	return DailyRecordQuestion
}
