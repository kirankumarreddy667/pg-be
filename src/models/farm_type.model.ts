import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface FarmTypeAttributes {
	id: number
	name: string
	language_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class FarmType
	extends Model<
		FarmTypeAttributes,
		Optional<
			FarmTypeAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements FarmTypeAttributes
{
	public id!: number
	public name!: string
	public language_id!: number
	public createdAt?: Date | null
	public updatedAt?: Date | null
	public deleted_at?: Date | null
}

export default function FarmTypeModel(sequelize: Sequelize): typeof FarmType {
	FarmType.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'farm_type',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return FarmType
}
