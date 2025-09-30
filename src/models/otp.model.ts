import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface OtpAttributes {
	id?: number
	user_id: number
	otp: string
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date
}

export class Otp
	extends Model<
		OtpAttributes,
		Optional<OtpAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
	>
	implements OtpAttributes
{
	public id!: number
	public user_id!: number
	public otp!: string
	public created_at?: Date
	public updated_at?: Date
	public deleted_at?: Date

	public static isExpired(
		createdAt: Date | string,
		expireSeconds: number,
	): boolean {
		const createdDate =
			createdAt instanceof Date
				? createdAt
				: new Date(`${createdAt.toString().replace(' ', 'T')}Z`)

		const now = new Date()
		const diffSeconds = Math.floor(
			(now.getTime() - createdDate.getTime()) / 1000,
		)
		return diffSeconds >= expireSeconds
	}
}

const OtpModel = (sequelize: Sequelize): typeof Otp => {
	Otp.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			otp: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'otp',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			indexes: [
				{
					fields: ['user_id'],
				},
			],
		},
	)

	return Otp
}

export default OtpModel
