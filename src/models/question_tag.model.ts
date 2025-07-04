import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface QuestionTagAttributes {
	id?: number
	name: string
	description?: string | null
	created_at?: Date
	updated_at?: Date
}

export class QuestionTag
	extends Model<
		QuestionTagAttributes,
		Optional<
			QuestionTagAttributes,
			'id' | 'description' | 'created_at' | 'updated_at'
		>
	>
	implements QuestionTagAttributes
{
	public id!: number
	public name!: string
	public description!: string | null
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof QuestionTag => {
	QuestionTag.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'question_tags',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return QuestionTag
}
