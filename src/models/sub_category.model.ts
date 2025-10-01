import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface SubcategoryAttributes {
	id?: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Subcategory
	extends Model<
		SubcategoryAttributes,
		Optional<
			SubcategoryAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements SubcategoryAttributes
{
	public id!: number
	public name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at!: Date | null
}

export default function SubCategoryModel(
	sequelize: Sequelize,
): typeof Subcategory {
	Subcategory.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			tableName: 'subcategories',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Subcategory
}
