import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface TypeAttributes {
	id?: number
	type: string
	created_at?: Date
	updated_at?: Date
}

export class Type
	extends Model<
		TypeAttributes,
		Optional<TypeAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements TypeAttributes
{
	public id!: number
	public type!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Type => {
	Type.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
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
			tableName: 'types',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Type
}
