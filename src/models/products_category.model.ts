import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ProductsCategoryAttributes {
	id?: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class ProductsCategory
	extends Model<
		ProductsCategoryAttributes,
		Optional<
			ProductsCategoryAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements ProductsCategoryAttributes
{
	public id!: number
	public name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof ProductsCategory => {
	ProductsCategory.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'products_category',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return ProductsCategory
}
