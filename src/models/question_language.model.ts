import { Model, DataTypes, Sequelize, Optional } from 'sequelize'
import type { CommonQuestions } from './common_questions.model'

export interface QuestionLanguageAttributes {
	id?: number
	question_id: number
	language_id: number
	question: string
	form_type_value?: string | null
	hint?: string | null
	created_at?: Date
	updated_at?: Date
}

export class QuestionLanguage
	extends Model<
		QuestionLanguageAttributes,
		Optional<
			QuestionLanguageAttributes,
			'id' | 'form_type_value' | 'hint' | 'created_at' | 'updated_at'
		>
	>
	implements QuestionLanguageAttributes
{
	public id!: number
	public question_id!: number
	public language_id!: number
	public question!: string
	public form_type_value!: string | null
	public hint!: string | null
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public CommonQuestion?: CommonQuestions
}

export default (sequelize: Sequelize): typeof QuestionLanguage => {
	QuestionLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			question_id: {
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
			tableName: 'question_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return QuestionLanguage
}
