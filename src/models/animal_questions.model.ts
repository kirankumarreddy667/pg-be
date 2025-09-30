import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AnimalQuestionsAttributes {
	id?: number
	animal_id: number
	question_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class AnimalQuestions
	extends Model<
		AnimalQuestionsAttributes,
		Optional<
			AnimalQuestionsAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AnimalQuestionsAttributes
{
	public id!: number
	public animal_id!: number
	public question_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof AnimalQuestions => {
	AnimalQuestions.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'animal_questions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			indexes: [
				{
					fields: ['animal_id', 'question_id'],
				},
			],
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalQuestions
}
