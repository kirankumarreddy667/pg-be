import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AnimalAttributes {
	id?: number
	name: string
	language_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Animal
	extends Model<
		AnimalAttributes,
		Optional<
			AnimalAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AnimalAttributes
{
	public id!: number
	public name!: string
	public language_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function AnimalModel(sequelize: Sequelize): typeof Animal {
	Animal.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'animals',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Animal
}
