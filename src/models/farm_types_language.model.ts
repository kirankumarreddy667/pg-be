import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface FarmTypesLanguageAttributes {
	id: number
	farm_type_id: number
	language_id: number
	name: string
	created_at?: Date
	updated_at?: Date
}

export class FarmTypesLanguage
	extends Model<
		FarmTypesLanguageAttributes,
		Optional<FarmTypesLanguageAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements FarmTypesLanguageAttributes
{
	public id!: number
	public farm_type_id!: number
	public language_id!: number
	public name!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof FarmTypesLanguage => {
	FarmTypesLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			farm_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
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
			modelName: 'FarmTypesLanguage',
			tableName: 'farm_types_language',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return FarmTypesLanguage
}
