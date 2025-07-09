import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface InvestmentTypesAttributes {
	id: number
	investment_type: string
	created_at?: Date
	updated_at?: Date
}

export class InvestmentTypes
	extends Model<
		InvestmentTypesAttributes,
		Optional<InvestmentTypesAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements InvestmentTypesAttributes
{
	public id!: number
	public investment_type!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof InvestmentTypes => {
	InvestmentTypes.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			investment_type: {
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
			modelName: 'InvestmentTypes',
			tableName: 'investment_types',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return InvestmentTypes
}
