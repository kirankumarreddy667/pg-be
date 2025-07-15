import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AnimalQuestionsAttributes {
	id?: number
	animal_id: number
	question_id: number
	created_at?: Date
	updated_at?: Date
}

export class AnimalQuestions
	extends Model<
		AnimalQuestionsAttributes,
		Optional<AnimalQuestionsAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements AnimalQuestionsAttributes
{
	public id!: number
	public animal_id!: number
	public question_id!: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof AnimalQuestions => {
	AnimalQuestions.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
			tableName: 'animal_questions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return AnimalQuestions
}
