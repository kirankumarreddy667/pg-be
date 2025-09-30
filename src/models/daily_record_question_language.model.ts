import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyRecordQuestionLanguageAttributes {
	id?: number
	daily_record_question_id: number
	language_id: number
	question: string
	created_at?: Date | null
	updated_at?: Date | null
	form_type_value?: string | null
	hint?: string | null
	deleted_at?: Date | null
}

export class DailyRecordQuestionLanguage
	extends Model<
		DailyRecordQuestionLanguageAttributes,
		Optional<
			DailyRecordQuestionLanguageAttributes,
			| 'id'
			| 'created_at'
			| 'updated_at'
			| 'form_type_value'
			| 'hint'
			| 'deleted_at'
		>
	>
	implements DailyRecordQuestionLanguageAttributes
{
	public id!: number
	public daily_record_question_id!: number
	public language_id!: number
	public question!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public form_type_value!: string | null
	public hint!: string | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof DailyRecordQuestionLanguage => {
	DailyRecordQuestionLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			daily_record_question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			question: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			form_type_value: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			hint: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'daily_record_question_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			paranoid: true,
		},
	)
	return DailyRecordQuestionLanguage
}
