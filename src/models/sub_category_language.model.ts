import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface SubCategoryLanguageAttributes {
	id?: number
	sub_category_id: number
	language_id: number
	sub_category_language_name: string
	created_at?: Date
	updated_at?: Date
}

export class SubCategoryLanguage
	extends Model<
		SubCategoryLanguageAttributes,
		Optional<SubCategoryLanguageAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements SubCategoryLanguageAttributes
{
	public id!: number
	public sub_category_id!: number
	public language_id!: number
	public sub_category_language_name!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof SubCategoryLanguage => {
	SubCategoryLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			sub_category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sub_category_language_name: {
				type: DataTypes.TEXT,
				allowNull: false,
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
			tableName: 'sub_category_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			indexes: [
				{
					unique: true,
					fields: ['sub_category_id', 'language_id'],
				},
			],
		},
	)
	return SubCategoryLanguage
}
