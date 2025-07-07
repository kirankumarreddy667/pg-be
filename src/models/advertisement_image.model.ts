import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AdvertisementImageAttributes {
	id?: number
	advertisement_id: number
	image: string
	created_at?: Date
	updated_at?: Date
}

export class AdvertisementImage
	extends Model<
		AdvertisementImageAttributes,
		Optional<AdvertisementImageAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements AdvertisementImageAttributes
{
	public id!: number
	public advertisement_id!: number
	public image!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof AdvertisementImage => {
	AdvertisementImage.init(
		{
			id: {
				type: DataTypes.INTEGER,
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
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'advertisement_images',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return AdvertisementImage
}
