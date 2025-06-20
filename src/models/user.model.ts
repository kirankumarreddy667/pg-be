import { Model, DataTypes, Sequelize } from 'sequelize'
import bcrypt from 'bcrypt'
import { UserRole } from '@/types/index'

export interface UserAttributes {
	id?: number
	email: string
	password: string
	firstName: string
	lastName: string
	username: string
	role: UserRole
	isActive?: boolean
	lastLogin?: Date
	createdAt?: Date
	updatedAt?: Date
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number
	public email!: string
	public password!: string
	public firstName!: string
	public lastName!: string
	public username!: string
	public role!: UserRole
	public isActive!: boolean
	public lastLogin!: Date
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public async comparePassword(candidatePassword: string): Promise<boolean> {
		return bcrypt.compare(candidatePassword, this.password)
	}
}

const UserModel = (sequelize: Sequelize): typeof User => {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			role: {
				type: DataTypes.ENUM(...Object.values(UserRole)),
				defaultValue: UserRole.USER,
				allowNull: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			lastLogin: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'users',
			hooks: {
				beforeCreate: async (user: User) => {
					if (user.password) {
						const salt = await bcrypt.genSalt(10)
						user.password = await bcrypt.hash(user.password, salt)
					}
				},
				beforeUpdate: async (user: User) => {
					if (user.changed('password')) {
						const salt = await bcrypt.genSalt(10)
						user.password = await bcrypt.hash(user.password, salt)
					}
				},
			},
		},
	)
	return User
}

export default UserModel
