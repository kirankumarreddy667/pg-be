import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface QuestionTagMappingAttributes {
	id?: number
	question_id: number
	question_tag_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class QuestionTagMapping
	extends Model<
		QuestionTagMappingAttributes,
		Optional<
			QuestionTagMappingAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements QuestionTagMappingAttributes
{
	public id!: number
	public question_id!: number
	public question_tag_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function QuestionTagMappingModel(
	sequelize: Sequelize,
): typeof QuestionTagMapping {
	QuestionTagMapping.init(
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
			question_tag_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'question_tag_mapping',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return QuestionTagMapping
}
