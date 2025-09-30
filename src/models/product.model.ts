import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ProductAttributes {
	id?: number
	product_category_id: number
	language: number
	product_title: string
	product_images: string
	product_amount?: number | null
	product_description?: string | null
	product_variants?: string | null
	product_delivery_to?: string | null
	product_specifications?: string | null
	thumbnail: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Product
	extends Model<
		ProductAttributes,
		Optional<
			ProductAttributes,
			| 'id'
			| 'product_amount'
			| 'product_description'
			| 'product_variants'
			| 'product_delivery_to'
			| 'product_specifications'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
		>
	>
	implements ProductAttributes
{
	public id!: number
	public product_category_id!: number
	public language!: number
	public product_title!: string
	public product_images!: string
	public product_amount?: number | null
	public product_description?: string | null
	public product_variants?: string | null
	public product_delivery_to?: string | null
	public product_specifications?: string | null
	public thumbnail!: string
	public created_at!: Date | null
	public updated_at!: Date | null
	public deleted_at!: Date | null
}

export default (sequelize: Sequelize): typeof Product => {
	Product.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			product_category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			product_title: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			product_images: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			product_amount: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			product_description: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			product_variants: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			product_delivery_to: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			product_specifications: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			thumbnail: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'products',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Product
}
