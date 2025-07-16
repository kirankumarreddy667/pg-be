import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface NotificationLanguageAttributes {
	id?: number
	user_id: number
	language_id: number
	langauge_message: string
	heading: string
	animal_id: number
	animal_number: string
	send_notification_date?: Date | null
	status: number
	days_before: number
	created_at?: Date
	updated_at?: Date
}

export class NotificationLanguage
	extends Model<
		NotificationLanguageAttributes,
		Optional<
			NotificationLanguageAttributes,
			'id' | 'send_notification_date' | 'created_at' | 'updated_at'
		>
	>
	implements NotificationLanguageAttributes
{
	public id!: number
	public user_id!: number
	public language_id!: number
	public langauge_message!: string
	public heading!: string
	public animal_id!: number
	public animal_number!: string
	public send_notification_date!: Date | null
	public status!: number
	public days_before!: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof NotificationLanguage => {
	NotificationLanguage.init(
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
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			langauge_message: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			heading: {
				type: DataTypes.STRING,
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
			send_notification_date: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: DataTypes.NOW,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			days_before: {
				type: DataTypes.INTEGER,
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
			tableName: 'notification_language',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return NotificationLanguage
}
