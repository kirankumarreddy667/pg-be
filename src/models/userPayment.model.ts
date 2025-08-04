import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface UserPaymentAttributes {
	id?: number
	user_id: number
	plan_id: number
	amount: number
	num_of_valid_years: number
	plan_exp_date: Date
	payment_history_id?: number | null
	created_at?: Date
	updated_at?: Date
}

export class UserPayment
	extends Model<
		UserPaymentAttributes,
		Optional<
			UserPaymentAttributes,
			'id' | 'payment_history_id' | 'created_at' | 'updated_at'
		>
	>
	implements UserPaymentAttributes
{
	declare id: number
	declare user_id: number
	declare plan_id: number
	declare amount: number
	declare num_of_valid_years: number
	declare plan_exp_date: Date
	declare payment_history_id: number | null
	declare readonly created_at: Date
	declare readonly updated_at: Date
}

export default (sequelize: Sequelize): typeof UserPayment => {
	UserPayment.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
				type: DataTypes.FLOAT,
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
			payment_history_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		},
		{
			sequelize,
			tableName: 'user_payment',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)

	return UserPayment
}
