import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AdvertisementImageAttributes {
	id?: number
	advertisement_id: number
	image: string
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date
}

export class AdvertisementImage
	extends Model<
		AdvertisementImageAttributes,
		Optional<
			AdvertisementImageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AdvertisementImageAttributes
{
	public id!: number
	public advertisement_id!: number
	public image!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public deleted_at!: Date
}

export default (sequelize: Sequelize): typeof AdvertisementImage => {
	AdvertisementImage.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			advertisement_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'advertisement_images',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
		},
	)
	return AdvertisementImage
}
