import { Model, DataTypes, Sequelize, Optional } from 'sequelize'
import type { CommonQuestions } from './common_questions.model'

export interface QuestionLanguageAttributes {
	id?: number
	question_id: number
	language_id: number
	question: string
	form_type_value?: string | null
	hint?: string | null
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class QuestionLanguage
	extends Model<
		QuestionLanguageAttributes,
		Optional<
			QuestionLanguageAttributes,
			| 'id'
			| 'form_type_value'
			| 'hint'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
		>
	>
	implements QuestionLanguageAttributes
{
	public id!: number
	public question_id!: number
	public language_id!: number
	public question!: string
	public form_type_value?: string | null
	public hint?: string | null
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
	public CommonQuestion?: CommonQuestions
}

export default function QuestionLanguageModel(
	sequelize: Sequelize,
): typeof QuestionLanguage {
	QuestionLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
			tableName: 'question_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return QuestionLanguage
}
