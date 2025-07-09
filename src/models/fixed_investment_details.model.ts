import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface FixedInvestmentDetailsAttributes {
	id: number
	type_of_investment: number
	amount_in_rs: number
	user_id: number
	date_of_installation_or_purchase: Date
	created_at?: Date
	updated_at?: Date
}

export class FixedInvestmentDetails
	extends Model<
		FixedInvestmentDetailsAttributes,
		Optional<
			FixedInvestmentDetailsAttributes,
			'id' | 'created_at' | 'updated_at'
		>
	>
	implements FixedInvestmentDetailsAttributes
{
	public id!: number
	public type_of_investment!: number
	public amount_in_rs!: number
	public user_id!: number
	public date_of_installation_or_purchase!: Date
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof FixedInvestmentDetails => {
	FixedInvestmentDetails.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			type_of_investment: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			amount_in_rs: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			date_of_installation_or_purchase: {
				type: DataTypes.DATE,
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
			modelName: 'FixedInvestmentDetails',
			tableName: 'fixed_investment_details',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return FixedInvestmentDetails
}
