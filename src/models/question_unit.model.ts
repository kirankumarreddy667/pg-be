import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface QuestionUnitAttributes {
	id?: number
	name: string
	description?: string | null
	created_at?: Date
	updated_at?: Date
}

export class QuestionUnit
	extends Model<
		QuestionUnitAttributes,
		Optional<QuestionUnitAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements QuestionUnitAttributes
{
	public id!: number
	public name!: string
	public description!: string | null
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof QuestionUnit => {
	QuestionUnit.init(
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
			tableName: 'question_units',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return QuestionUnit
}
