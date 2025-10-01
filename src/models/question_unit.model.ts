import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface QuestionUnitAttributes {
	id?: number
	name: string
	description?: string | null
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class QuestionUnit
	extends Model<
		QuestionUnitAttributes,
		Optional<
			QuestionUnitAttributes,
			'id' | 'description' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements QuestionUnitAttributes
{
	public id!: number
	public name!: string
	public description?: string | null
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof QuestionUnit => {
	QuestionUnit.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'question_units',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return QuestionUnit
}
