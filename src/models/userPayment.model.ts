import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface UserPaymentAttributes {
	id?: number
	user_id: number
	plan_id: number
	amount: number
	num_of_valid_years: number
	plan_exp_date: Date
	payment_history_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class UserPayment
	extends Model<
		UserPaymentAttributes,
		Optional<
			UserPaymentAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements UserPaymentAttributes
{
	public id!: number
	public user_id!: number
	public plan_id!: number
	public amount!: number
	public num_of_valid_years!: number
	public plan_exp_date!: Date
	public payment_history_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof UserPayment => {
	UserPayment.init(
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
			num_of_valid_years: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			plan_exp_date: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			payment_history_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			tableName: 'user_payment',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return UserPayment
}
