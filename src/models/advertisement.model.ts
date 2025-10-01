import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AdvertisementAttributes {
	id?: number
	name: string
	description: string
	cost: number
	phone_number: string
	term_conditions: string
	website_link?: string | null
	status?: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Advertisement
	extends Model<
		AdvertisementAttributes,
		Optional<
			AdvertisementAttributes,
			| 'id'
			| 'website_link'
			| 'status'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
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
	public status!: number
	public readonly created_at!: Date | null
	public readonly updated_at!: Date | null
	public deleted_at!: Date | null
}

export default function AdvertisementModel(
	sequelize: Sequelize,
): typeof Advertisement {
	Advertisement.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(191),
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
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'advertisements',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Advertisement
}
