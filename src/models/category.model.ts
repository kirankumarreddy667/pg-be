import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface CategoryAttributes {
	id?: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	sequence_number: number
	deleted_at?: Date | null
}

export class Category
	extends Model<
		CategoryAttributes,
		Optional<
			CategoryAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements CategoryAttributes
{
	public id!: number
	public name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public sequence_number!: number
	public deleted_at!: Date | null
}

export default (sequelize: Sequelize): typeof Category => {
	Category.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true,
			},
			sequence_number: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'categories',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Category
}
