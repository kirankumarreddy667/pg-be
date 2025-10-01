import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface InvestmentTypesAttributes {
	id: number
	investment_type: string
	language_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class InvestmentTypes
	extends Model<
		InvestmentTypesAttributes,
		Optional<
			InvestmentTypesAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements InvestmentTypesAttributes
{
	public id!: number
	public investment_type!: string
	public language_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof InvestmentTypes => {
	InvestmentTypes.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			investment_type: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'investment_types',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return InvestmentTypes
}
