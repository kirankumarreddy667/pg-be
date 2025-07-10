import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface AnimalAttributes {
	id?: number
	name: string
	language_id?: number | null // made optional and nullable
	created_at?: Date
	updated_at?: Date
}

export class Animal
	extends Model<
		AnimalAttributes,
		Optional<AnimalAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements AnimalAttributes
{
	public id!: number
	public name!: string
	public language_id!: number | null
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Animal => {
	Animal.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: true, // allow null
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
			tableName: 'animals',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Animal
}
