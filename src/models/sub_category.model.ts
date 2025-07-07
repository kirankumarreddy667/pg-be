import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface SubcategoryAttributes {
	id?: number
	name: string
	created_at?: Date
	updated_at?: Date
}

export class Subcategory
	extends Model<
		SubcategoryAttributes,
		Optional<SubcategoryAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements SubcategoryAttributes
{
	public id!: number
	public name!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Subcategory => {
	Subcategory.init(
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
			tableName: 'subcategories',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Subcategory
}
