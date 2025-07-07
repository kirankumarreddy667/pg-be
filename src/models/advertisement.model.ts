import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AdvertisementAttributes {
	id?: number
	name: string
	description: string
	cost: number
	phone_number: string
	term_conditions: string
	website_link?: string | null
	status?: boolean
	created_at?: Date
	updated_at?: Date
}

export class Advertisement
	extends Model<
		AdvertisementAttributes,
		Optional<
			AdvertisementAttributes,
			'id' | 'website_link' | 'status' | 'created_at' | 'updated_at'
		>
	>
	implements AdvertisementAttributes
{
	public id!: number
	public name!: string
	public description!: string
	public cost!: number
	public phone_number!: string
	public term_conditions!: string
	public website_link!: string | null
	public status!: boolean
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Advertisement => {
	Advertisement.init(
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
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			cost: {
				type: DataTypes.DOUBLE(10, 2),
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING(11),
				allowNull: false,
			},
			term_conditions: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			website_link: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'advertisements',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Advertisement
}
