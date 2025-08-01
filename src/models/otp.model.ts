import { Model, DataTypes, Sequelize } from 'sequelize'

export interface OtpAttributes {
	id?: number
	user_id: number
	otp: string
	created_at?: Date
	updated_at?: Date
}

export class Otp extends Model<OtpAttributes> implements OtpAttributes {
	public id!: number
	public user_id!: number
	public otp!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date

	public static isExpired(createdAt: Date, expireSeconds = 1800): boolean {
		const now = new Date()
		const diffSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000)
		return diffSeconds >= expireSeconds
	}
}

const OtpModel = (sequelize: Sequelize): typeof Otp => {
	Otp.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			otp: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'otp',
			timestamps: true,
			underscored: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Otp
}

export default OtpModel
