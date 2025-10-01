import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyRecordQuestionAnswerAttributes {
	id?: number
	daily_record_question_id: number
	user_id: number
	answer: string
	answer_date: Date
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class DailyRecordQuestionAnswer
	extends Model<
		DailyRecordQuestionAnswerAttributes,
		Optional<
			DailyRecordQuestionAnswerAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements DailyRecordQuestionAnswerAttributes
{
	public id!: number
	public daily_record_question_id!: number
	public user_id!: number
	public answer!: string
	public answer_date!: Date
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function DailyRecordQuestionAnswerModel(
	sequelize: Sequelize,
): typeof DailyRecordQuestionAnswer {
	DailyRecordQuestionAnswer.init(
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
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			tableName: 'daily_record_question_answer',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			paranoid: true,
			indexes: [
				{
					fields: ['user_id'],
				},
			],
		},
	)
	return DailyRecordQuestionAnswer
}
