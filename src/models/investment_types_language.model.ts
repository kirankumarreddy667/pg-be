import { DataTypes, Model, Sequelize } from 'sequelize'

export interface InvestmentTypesLanguageAttributes {
	id?: number
	investment_type_id: number
	language_id: number
	investment_type: string
	created_at?: Date
	updated_at?: Date
}

export class InvestmentTypesLanguage
	extends Model<InvestmentTypesLanguageAttributes>
	implements InvestmentTypesLanguageAttributes
{
	public id!: number
	public investment_type_id!: number
	public language_id!: number
	public investment_type!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof InvestmentTypesLanguage => {
	InvestmentTypesLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
			tableName: 'investment_types_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return InvestmentTypesLanguage
}
