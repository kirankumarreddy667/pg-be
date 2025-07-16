import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface QuestionTagMappingAttributes {
	id?: number
	question_id: number
	question_tag_id: number
	created_at?: Date
	updated_at?: Date
}

export class QuestionTagMapping
	extends Model<
		QuestionTagMappingAttributes,
		Optional<QuestionTagMappingAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements QuestionTagMappingAttributes
{
	public id!: number
	public question_id!: number
	public question_tag_id!: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof QuestionTagMapping => {
	QuestionTagMapping.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
			tableName: 'question_tag_mapping',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)

	// Association for eager loading
	QuestionTagMapping.belongsTo(sequelize.models.QuestionTag, { foreignKey: 'question_tag_id', as: 'QuestionTag' });

	return QuestionTagMapping
}
