import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface InvestmentTypesLanguageAttributes {
	id?: number
	investment_type_id: number
	language_id: number
	investment_type: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class InvestmentTypesLanguage
	extends Model<
		InvestmentTypesLanguageAttributes,
		Optional<
			InvestmentTypesLanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements InvestmentTypesLanguageAttributes
{
	public id!: number
	public investment_type_id!: number
	public language_id!: number
	public investment_type!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function InvestmentTypesLanguageModel(
	sequelize: Sequelize,
): typeof InvestmentTypesLanguage {
	InvestmentTypesLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			investment_type_id: {
				type: DataTypes.INTEGER,
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
			tableName: 'investment_types_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return InvestmentTypesLanguage
}
