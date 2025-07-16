import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface AnimalImageAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	image: string
	created_at?: Date
	updated_at?: Date
}

export class AnimalImage
	extends Model<
		AnimalImageAttributes,
		Optional<AnimalImageAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements AnimalImageAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public image!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof AnimalImage => {
	AnimalImage.init(
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			animal_id: { type: DataTypes.INTEGER, allowNull: false },
			animal_number: { type: DataTypes.STRING, allowNull: false },
			image: { type: DataTypes.STRING, allowNull: false },
			created_at: { type: DataTypes.DATE, allowNull: false },
			updated_at: { type: DataTypes.DATE, allowNull: false },
		},
		{
			sequelize,
			tableName: 'animal_image',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return AnimalImage
}
