import { Model, DataTypes, Sequelize } from 'sequelize'

export interface RoleAttributes {
	id?: number
	name: string
	display_name?: string
	description?: string
	created_at?: Date
	updated_at?: Date
}

export class Role extends Model<RoleAttributes> implements RoleAttributes {
	public id!: number
	public name!: string
	public display_name?: string
	public description?: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

const RoleModel = (sequelize: Sequelize): typeof Role => {
	Role.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			display_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'roles',
			timestamps: true,
			underscored: true,
		},
	)
	return Role
}

export default RoleModel
