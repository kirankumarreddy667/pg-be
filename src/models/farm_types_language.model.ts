import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface FarmTypesLanguageAttributes {
	id: number
	farm_type_id: number
	language_id: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class FarmTypesLanguage
	extends Model<
		FarmTypesLanguageAttributes,
		Optional<
			FarmTypesLanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements FarmTypesLanguageAttributes
{
	public id!: number
	public farm_type_id!: number
	public language_id!: number
	public name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function FarmTypesLanguageModel(
	sequelize: Sequelize,
): typeof FarmTypesLanguage {
	FarmTypesLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'farm_types_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return FarmTypesLanguage
}
