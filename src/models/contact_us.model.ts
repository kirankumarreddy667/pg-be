import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ContactUsAttributes {
	id?: number
	phone_number: string
	contact_email: string
	whatsapp: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class ContactUs
	extends Model<
		ContactUsAttributes,
		Optional<
			ContactUsAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements ContactUsAttributes
{
	public id!: number
	public phone_number!: string
	public contact_email!: string
	public whatsapp!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function ContactUsModel(sequelize: Sequelize): typeof ContactUs {
	ContactUs.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			contact_email: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			whatsapp: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'contact_us',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return ContactUs
}
