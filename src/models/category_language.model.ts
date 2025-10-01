import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface CategoryLanguageAttributes {
	id?: number
	category_id: number
	language_id: number
	category_language_name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class CategoryLanguage
	extends Model<
		CategoryLanguageAttributes,
		Optional<
			CategoryLanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements CategoryLanguageAttributes
{
	public id!: number
	public category_id!: number
	public language_id!: number
	public category_language_name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof CategoryLanguage => {
	CategoryLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
		},
		{
			sequelize,
			tableName: 'category_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return CategoryLanguage
}
