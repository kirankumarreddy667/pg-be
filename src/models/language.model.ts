import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface LanguageAttributes {
	id?: number
	name: string
	language_code: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Language
	extends Model<
		LanguageAttributes,
		Optional<
			LanguageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements LanguageAttributes
{
	public id!: number
	public name!: string
	public language_code!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof Language => {
	Language.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			language_code: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'languages',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Language
}
