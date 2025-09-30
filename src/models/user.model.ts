import { Model, DataTypes, Sequelize } from 'sequelize'
import bcrypt from 'bcryptjs'
import { Role } from './role.model'

export interface UserAttributes {
	id?: number
	name: string
	email?: string | null
	password?: string | null
	phone_number: string
	farm_name?: string | null
	address?: string | null
	pincode?: string | null
	taluka?: string | null
	district?: string | null
	state?: string | null
	country?: string | null
	payment_status?: 'free' | 'premium'
	remember_token?: string | null
	village?: string | null
	otp_status: boolean
	firebase_token?: string | null
	device_id?: string | null
	device_type?: string | null
	language_id?: number | null
	record_milk_refresh?: string | null
	deleted_at?: Date | null
	created_at?: Date | null
	updated_at?: Date | null
	google_id?: string | null
	facebook_id?: string | null
	provider?: string[] | null
	avatar?: string | null
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number
	public name!: string
	public email?: string | null
	public password?: string | null
	public phone_number!: string
	public farm_name?: string | null
	public address?: string | null
	public pincode?: string | null
	public taluka?: string | null
	public district?: string | null
	public state?: string | null
	public country?: string | null
	public payment_status!: 'free' | 'premium'
	public remember_token?: string | null
	public village?: string | null
	public otp_status!: boolean
	public firebase_token?: string | null
	public device_id?: string | null
	public device_type?: string | null
	public language_id?: number | null
	public record_milk_refresh?: string | null
	public deleted_at?: Date | null
	public created_at?: Date | null
	public updated_at?: Date | null
	public google_id?: string | null
	public facebook_id?: string | null
	public provider?: string[] | null
	public avatar?: string | null

	public getRoles!: () => Promise<Role[]>
}

const UserModel = (sequelize: Sequelize): typeof User => {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(191),
				allowNull: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			phone_number: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			farm_name: {
				type: DataTypes.STRING(191),
				allowNull: true,
				unique: true,
			},
			address: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			pincode: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			taluka: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			district: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			state: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			country: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			payment_status: {
				type: DataTypes.STRING(191),
				defaultValue: 'free',
			},
			remember_token: {
				type: DataTypes.STRING(511),
				allowNull: true,
			},
			village: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			otp_status: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
			firebase_token: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			device_id: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			device_type: {
				type: DataTypes.STRING(191),
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
			google_id: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			facebook_id: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			provider: {
				type: DataTypes.JSON,
				allowNull: true,
			},
			avatar: {
				type: DataTypes.STRING(191),
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
			charset: 'utf8',
			collate: 'utf8_unicode_ci',
		},
	)
	return User
}

export default UserModel
