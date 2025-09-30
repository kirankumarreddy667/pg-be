import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface UnitAttributes {
	id?: number
	name: string
	display_name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Unit
	extends Model<
		UnitAttributes,
		Optional<UnitAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
	>
	implements UnitAttributes
{
	public id!: number
	public name!: string
	public display_name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

const UnitModel = (sequelize: Sequelize): typeof Unit => {
	Unit.init(
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
			display_name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'units',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Unit
}

export default UnitModel
