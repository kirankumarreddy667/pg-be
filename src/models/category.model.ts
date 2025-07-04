import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface CategoryAttributes {
	id?: number
	name: string
	created_at?: Date
	updated_at?: Date
}

export class Category
	extends Model<
		CategoryAttributes,
		Optional<CategoryAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements CategoryAttributes
{
	public id!: number
	public name!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Category => {
	Category.init(
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
			tableName: 'categories',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Category
}
