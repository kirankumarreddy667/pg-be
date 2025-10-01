import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyRecordQuestionAttributes {
	id?: number
	category_id?: number | null
	sub_category_id?: number | null
	question: string
	validation_rule_id: number
	form_type_id: number
	date: boolean
	created_at?: Date | null
	updated_at?: Date | null
	question_tag: number
	question_unit: number
	form_type_value?: string | null
	delete_status: boolean
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
			| 'created_at'
			| 'updated_at'
			| 'form_type_value'
			| 'hint'
		>
	>
	implements DailyRecordQuestionAttributes
{
	public id!: number
	public category_id?: number | null
	public sub_category_id?: number | null
	public question!: string
	public validation_rule_id!: number
	public form_type_id!: number
	public date!: boolean
	public created_at?: Date | null
	public updated_at?: Date | null
	public question_tag!: number
	public question_unit!: number
	public form_type_value?: string | null
	public delete_status!: boolean
	public sequence_number!: number
	public hint?: string | null
}

export default function DailyRecordQuestionModel(
	sequelize: Sequelize,
): typeof DailyRecordQuestion {
	DailyRecordQuestion.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
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
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			delete_status: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
			sequence_number: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			hint: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'daily_record_questions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return DailyRecordQuestion
}
