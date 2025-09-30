import { Model, Sequelize, DataTypes, Optional } from 'sequelize'

export interface AnimalTypeAttributes {
	id?: number
	animal_id: number
	type_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class AnimalType extends Model<
	AnimalTypeAttributes,
	Optional<
		AnimalTypeAttributes,
		'id' | 'created_at' | 'updated_at' | 'deleted_at'
	>
> {
	public id!: number
	public animal_id!: number
	public type_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function AnimalTypeModel(
	sequelize: Sequelize,
): typeof AnimalType {
	AnimalType.init(
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
			type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'animal_type',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			indexes: [
				{
					fields: ['animal_id'],
				},
			],
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalType
}
