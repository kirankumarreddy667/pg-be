import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ProductPaymentAttributes {
	id: number
	user_id: number
	product_id: number
	amount: number
	payment_id: string
	email?: string | null
	billing_instrument: string
	phone: string
	created_at?: Date
	updated_at?: Date
}

export class ProductPayment
	extends Model<
		ProductPaymentAttributes,
		Optional<
			ProductPaymentAttributes,
			'id' | 'email' | 'created_at' | 'updated_at'
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
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof ProductPayment => {
	ProductPayment.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			billing_instrument: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
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
			modelName: 'ProductPayment',
			tableName: 'product_payment',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return ProductPayment
}
