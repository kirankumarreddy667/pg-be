import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ContactUsAttributes {
	id: number
	phone_number: string
	contact_email: string
	whatsapp: string
	created_at?: Date
	updated_at?: Date
}

export class ContactUs
	extends Model<
		ContactUsAttributes,
		Optional<ContactUsAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements ContactUsAttributes
{
	public id!: number
	public phone_number!: string
	public contact_email!: string
	public whatsapp!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof ContactUs => {
	ContactUs.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			contact_email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			whatsapp: {
				type: DataTypes.STRING,
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
			modelName: 'ContactUs',
			tableName: 'contact_us',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
    return ContactUs
}
