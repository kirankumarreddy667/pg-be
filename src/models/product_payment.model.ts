import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ProductPaymentAttributes {
	id?: number
	user_id: number
	product_id: number
	amount: number
	payment_id: string
	email?: string | null
	billing_instrument: string
	phone: string
	created_at?: Date | null
	updated_at?: Date | null
	coupon_id?: number | null
	status: string
	offer_id?: number | null
	address: string
	deleted_at?: Date | null
}

export class ProductPayment
	extends Model<
		ProductPaymentAttributes,
		Optional<
			ProductPaymentAttributes,
			| 'id'
			| 'email'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
			| 'coupon_id'
			| 'offer_id'
		>
	>
	implements ProductPaymentAttributes
{
	public id!: number
	public user_id!: number
	public product_id!: number
	public amount!: number
	public payment_id!: string
	public email?: string | null
	public billing_instrument!: string
	public phone!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
	public coupon_id?: number | null
	public status!: string
	public offer_id?: number | null
	public address!: string
}

export default function ProductPaymentModel(
	sequelize: Sequelize,
): typeof ProductPayment {
	ProductPayment.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			payment_id: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			billing_instrument: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			coupon_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			status: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			offer_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			address: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'product_payment',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return ProductPayment
}
