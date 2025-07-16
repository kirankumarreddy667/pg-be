import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface NotificationAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	message: string
	send_notification_date: Date
	created_at?: Date
	updated_at?: Date
}

export class Notification
	extends Model<
		NotificationAttributes,
		Optional<NotificationAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements NotificationAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public message!: string
	public send_notification_date!: Date
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Notification => {
	Notification.init(
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
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			message: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			send_notification_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			tableName: 'notification',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Notification
}
