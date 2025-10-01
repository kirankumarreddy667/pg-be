import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface NotificationAttributes {
	id?: number
	user_id: number
	animal_id?: number
	animal_number?: string | null
	message: string
	send_notification_date: Date
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
	heading: string
	status?: boolean
	type: string
	doctor_num?: string | null
	doctor_message?: string | null
}

export class Notification
	extends Model<
		NotificationAttributes,
		Optional<
			NotificationAttributes,
			| 'id'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
			| 'doctor_num'
			| 'doctor_message'
			| 'animal_number'
			| 'animal_id'
			| 'status'
		>
	>
	implements NotificationAttributes
{
	public id!: number
	public user_id!: number
	public animal_id?: number
	public animal_number?: string | null
	public message!: string
	public send_notification_date!: Date
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
	public heading!: string
	public status?: boolean
	public type!: string
	public doctor_num?: string | null
	public doctor_message?: string | null
}

export default (sequelize: Sequelize): typeof Notification => {
	Notification.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			animal_number: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			message: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			send_notification_date: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			heading: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 0,
			},
			type: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			doctor_num: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			doctor_message: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'notification',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			paranoid: true,
		},
	)
	return Notification
}
