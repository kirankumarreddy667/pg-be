import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyRecordQuestionLanguageAttributes {
	id?: number
	daily_record_question_id: number
	language_id: number
	question: string
	created_at?: Date
	updated_at?: Date
	form_type_value?: string | null
	hint?: string | null
}

export class DailyRecordQuestionLanguage
	extends Model<
		DailyRecordQuestionLanguageAttributes,
		Optional<
			DailyRecordQuestionLanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'form_type_value' | 'hint'
		>
	>
	implements DailyRecordQuestionLanguageAttributes
{
	public id!: number
	public daily_record_question_id!: number
	public language_id!: number
	public question!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public form_type_value!: string | null
	public hint!: string | null
}

export default (sequelize: Sequelize): typeof DailyRecordQuestionLanguage => {
	DailyRecordQuestionLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
		},
		{
			sequelize,
			tableName: 'daily_record_question_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return DailyRecordQuestionLanguage
}
