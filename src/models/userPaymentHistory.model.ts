import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface UserPaymentHistoryAttributes {
	id?: number
	user_id: number
	plan_id: number
	amount: number
	payment_id: string
	num_of_valid_years: number
	plan_exp_date: Date
	email?: string | null
	billing_instrument: string
	phone: string
	status: string
	coupon_id?: number | null
	offer_id?: number | null
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}
export class UserPaymentHistory
	extends Model<
		UserPaymentHistoryAttributes,
		Optional<
			UserPaymentHistoryAttributes,
			| 'id'
			| 'email'
			| 'coupon_id'
			| 'offer_id'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
		>
	>
	implements UserPaymentHistoryAttributes
{
	public id!: number
	public user_id!: number
	public plan_id!: number
	public amount!: number
	public payment_id!: string
	public num_of_valid_years!: number
	public plan_exp_date!: Date
	public email?: string | null
	public billing_instrument!: string
	public phone!: string
	public status!: string
	public coupon_id?: number | null
	public offer_id?: number | null

	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof UserPaymentHistory => {
	UserPaymentHistory.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			plan_id: {
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
			num_of_valid_years: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			plan_exp_date: {
				type: DataTypes.DATE,
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
			status: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			coupon_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			offer_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'user_payment_history',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return UserPaymentHistory
}
