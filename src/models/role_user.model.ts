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
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			role_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'roles',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		},
		{
			sequelize,
			tableName: 'role_user',
			timestamps: false,
			indexes: [
				{
					fields: ['role_id'],
				},
			],
		},
	)
	return RoleUser
}

export default RoleUserModel
