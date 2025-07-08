import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ProductsCategoryAttributes {
	id: number
	name: string
	created_at?: Date
	updated_at?: Date
}

export class ProductsCategory
	extends Model<
		ProductsCategoryAttributes,
		Optional<ProductsCategoryAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements ProductsCategoryAttributes
{
	public id!: number
	public name!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof ProductsCategory => {
	ProductsCategory.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
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
			modelName: 'ProductsCategory',
			tableName: 'products_category',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return ProductsCategory
}
