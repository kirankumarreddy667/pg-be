import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface TypeAttributes {
	id?: number
	type: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Type
	extends Model<
		TypeAttributes,
		Optional<TypeAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
	>
	implements TypeAttributes
{
	public id!: number
	public type!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof Type => {
	Type.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			type: {
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			tableName: 'types',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Type
}
