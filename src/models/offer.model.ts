import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface OfferAttributes {
	id?: number
	name: string
	title: string
	description: string
	amount: number
	image?: string | null
	additional_months?: number | null
	additional_years?: number | null
	language_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Offer
	extends Model<
		OfferAttributes,
		Optional<
			OfferAttributes,
			| 'id'
			| 'created_at'
			| 'updated_at'
			| 'deleted_at'
			| 'image'
			| 'additional_months'
			| 'additional_years'
		>
	>
	implements OfferAttributes
{
	public id!: number
	public name!: string
	public title!: string
	public description!: string
	public amount!: number
	public image?: string | null
	public additional_months?: number | null
	public additional_years?: number | null
	public language_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

const OfferModel = (sequelize: Sequelize): typeof Offer => {
	Offer.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			additional_months: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			additional_years: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'offers',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return Offer
}

export default OfferModel
