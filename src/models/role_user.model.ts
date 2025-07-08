import { Model, DataTypes, Sequelize } from 'sequelize'

export interface RoleUserAttributes {
	user_id: number
	role_id: number
}

export class RoleUser
	extends Model<RoleUserAttributes>
	implements RoleUserAttributes
{
	public user_id!: number
	public role_id!: number
}

const RoleUserModel = (sequelize: Sequelize): typeof RoleUser => {
	RoleUser.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: 'role_user',
			timestamps: false,
		},
	)
	return RoleUser
}

export default RoleUserModel
