import { Model, DataTypes, Sequelize } from 'sequelize'
import bcrypt from 'bcryptjs'
import { Role } from './role.model'

export interface UserAttributes {
	id?: number
	name: string
	email?: string
	password?: string
	phone_number: string
	farm_name?: string
	address?: string
	pincode?: string
	taluka?: string
	district?: string
	state?: string
	country?: string
	payment_status?: 'free' | 'premium'
	remember_token?: string
	village?: string
	otp_status?: boolean
	firebase_token?: string
	device_id?: string
	device_type?: string
	language_id?: number
	record_milk_refresh?: string
	deleted_at?: Date
	created_at?: Date
	updated_at?: Date
	googleId?: string
	facebookId?: string
	provider?: string[]
	avatar?: string
	emailVerified?: boolean
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number
	public name!: string
	public email?: string
	public password?: string
	public phone_number!: string
	public farm_name?: string
	public address?: string
	public pincode?: string
	public taluka?: string
	public district?: string
	public state?: string
	public country?: string
	public payment_status!: 'free' | 'premium'
	public remember_token?: string
	public village?: string
	public otp_status!: boolean
	public firebase_token?: string
	public device_id?: string
	public device_type?: string
	public language_id?: number
	public record_milk_refresh?: string
	public deleted_at?: Date
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public googleId?: string
	public facebookId?: string
	public provider?: string[]
	public avatar?: string
	public emailVerified?: boolean

	public getRoles!: () => Promise<Role[]>
}

const UserModel = (sequelize: Sequelize): typeof User => {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			farm_name: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			pincode: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			taluka: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			district: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			state: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			country: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			payment_status: {
				type: DataTypes.ENUM('free', 'premium'),
				defaultValue: 'free',
			},
			remember_token: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			village: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			otp_status: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			firebase_token: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			device_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			device_type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			record_milk_refresh: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			googleId: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			facebookId: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			provider: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: [],
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			emailVerified: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'users',
			timestamps: true,
			paranoid: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			hooks: {
				beforeCreate: async (user: User) => {
					const plainPassword = user.get('password')
					if (plainPassword) {
						const salt = await bcrypt.genSalt(10)
						const hashed = await bcrypt.hash(plainPassword, salt)
						user.set('password', hashed)
					}
				},
				beforeUpdate: async (user: User) => {
					if (user.changed('password')) {
						const plainPassword = user.get('password')
						if (plainPassword) {
							const salt = await bcrypt.genSalt(10)
							const hashed = await bcrypt.hash(plainPassword, salt)
							user.set('password', hashed)
						}
					}
				},
			},
		},
	)
	return User
}

export default UserModel
