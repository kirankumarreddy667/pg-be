import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AnimalQuestionAnswerAttributes {
	id: number
	question_id: number
	user_id: number
	answer: string
	created_at?: Date | null
	updated_at?: Date | null
	animal_id: number
	animal_number: string
	status: boolean
	logic_value?: string | null
	deleted_at?: Date | null
}

export class AnimalQuestionAnswer
	extends Model<
		AnimalQuestionAnswerAttributes,
		Optional<
			AnimalQuestionAnswerAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AnimalQuestionAnswerAttributes
{
	public id!: number
	public question_id!: number
	public user_id!: number
	public answer!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public animal_id!: number
	public animal_number!: string
	public status!: boolean
	public logic_value?: string | null
	public deleted_at?: Date | null
}

export default function AnimalQuestionAnswerModel(
	sequelize: Sequelize,
): typeof AnimalQuestionAnswer {
	AnimalQuestionAnswer.init(
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
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			answer: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_number: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
			logic_value: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'animal_question_answers',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			indexes: [
				{
					fields: ['user_id'],
				},
			],
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalQuestionAnswer
}
