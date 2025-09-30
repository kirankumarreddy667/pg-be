import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface FcmNotificationsAttributes {
	id?: number
	title: string
	message: string
	user_id: number
	device_type: string
	is_read: boolean
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class FcmNotifications
	extends Model<
		FcmNotificationsAttributes,
		Optional<
			FcmNotificationsAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements FcmNotificationsAttributes
{
	public id!: number
	public title!: string
	public message!: string
	public user_id!: number
	public device_type!: string
	public is_read!: boolean
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function FcmNotificationsModel(
	sequelize: Sequelize,
): typeof FcmNotifications {
	FcmNotifications.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			message: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			device_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			is_read: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			tableName: 'fcm_notifications',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return FcmNotifications
}
