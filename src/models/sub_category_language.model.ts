import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface SubCategoryLanguageAttributes {
	id?: number
	sub_category_id: number
	language_id: number
	sub_category_language_name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class SubCategoryLanguage
	extends Model<
		SubCategoryLanguageAttributes,
		Optional<
			SubCategoryLanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements SubCategoryLanguageAttributes
{
	public id!: number
	public sub_category_id!: number
	public language_id!: number
	public sub_category_language_name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function SubCategoryLanguageModel(
	sequelize: Sequelize,
): typeof SubCategoryLanguage {
	SubCategoryLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
		},
		{
			sequelize,
			tableName: 'sub_category_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return SubCategoryLanguage
}
