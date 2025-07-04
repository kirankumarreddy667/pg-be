import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface CategoryLanguageAttributes {
	id?: number
	category_id: number
	language_id: number
	category_language_name: string
	created_at?: Date
	updated_at?: Date
}

export class CategoryLanguage
	extends Model<
		CategoryLanguageAttributes,
		Optional<CategoryLanguageAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements CategoryLanguageAttributes
{
	public id!: number
	public category_id!: number
	public language_id!: number
	public category_language_name!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof CategoryLanguage => {
	CategoryLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			category_language_name: {
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
			tableName: 'category_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			indexes: [
				{
					unique: true,
					fields: ['category_id', 'language_id'],
				},
			],
		},
	)
	return CategoryLanguage
}
