import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface AnimalImageAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	image: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class AnimalImage
	extends Model<
		AnimalImageAttributes,
		Optional<
			AnimalImageAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AnimalImageAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public image!: string
	public readonly created_at?: Date | null
	public readonly updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof AnimalImage => {
	AnimalImage.init(
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			animal_id: { type: DataTypes.INTEGER, allowNull: false },
			animal_number: { type: DataTypes.STRING(191), allowNull: false },
			image: { type: DataTypes.STRING(191), allowNull: false },
		},
		{
			sequelize,
			tableName: 'animal_image',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalImage
}
