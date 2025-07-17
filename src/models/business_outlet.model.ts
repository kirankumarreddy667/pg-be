import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface BusinessOutletAttributes {
	id?: number
	business_name: string
	business_address: string
	assign_to?: number
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date | null
}

export class BusinessOutlet
	extends Model<
		BusinessOutletAttributes,
		Optional<
			BusinessOutletAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'assign_to'
		>
	>
	implements BusinessOutletAttributes
{
	public id!: number
	public business_name!: string
	public business_address!: string
	public assign_to?: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public readonly deleted_at!: Date | null
}

export default (sequelize: Sequelize): typeof BusinessOutlet => {
	BusinessOutlet.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			business_name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			business_address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			assign_to: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'business_outlet',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
		},
	)
	return BusinessOutlet
}
