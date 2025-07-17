import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyRecordQuestionAnswerAttributes {
	id?: number
	daily_record_question_id: number
	user_id: number
	answer: string
	answer_date: Date
	created_at?: Date
	updated_at?: Date
}

export class DailyRecordQuestionAnswer
	extends Model<
		DailyRecordQuestionAnswerAttributes,
		Optional<
			DailyRecordQuestionAnswerAttributes,
			'id' | 'created_at' | 'updated_at'
		>
	>
	implements DailyRecordQuestionAnswerAttributes
{
	public id!: number
	public daily_record_question_id!: number
	public user_id!: number
	public answer!: string
	public answer_date!: Date
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof DailyRecordQuestionAnswer => {
	DailyRecordQuestionAnswer.init(
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
			tableName: 'daily_record_question_answer',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return DailyRecordQuestionAnswer
}
