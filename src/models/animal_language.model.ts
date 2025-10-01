import { Model, Sequelize, DataTypes, Optional } from 'sequelize'

export interface AnimalLanguageAttributes {
	id: number
	animal_id: number
	language_id: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class AnimalLanguage
	extends Model<
		AnimalLanguageAttributes,
		Optional<
			AnimalLanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AnimalLanguageAttributes
{
	public id!: number
	public animal_id!: number
	public language_id!: number
	public name!: string
	public readonly created_at?: Date | null
	public readonly updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof AnimalLanguage => {
	AnimalLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			animal_id: {
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
			modelName: 'AnimalLanguage',
			tableName: 'animal_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalLanguage
}
