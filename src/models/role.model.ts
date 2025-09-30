import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface RoleAttributes {
	id?: number
	name: string
	display_name?: string | null
	description?: string | null
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Role
	extends Model<
		RoleAttributes,
		Optional<
			RoleAttributes,
			| 'id'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
			| 'display_name'
			| 'description'
		>
	>
	implements RoleAttributes
{
	public id!: number
	public name!: string
	public display_name?: string | null
	public description?: string | null
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

const RoleModel = (sequelize: Sequelize): typeof Role => {
	Role.init(
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
				allowNull: true,
			},
			description: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'roles',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Role
}

export default RoleModel
