import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface BusinessOutletAttributes {
	id?: number
	user_id: number
	business_name: string
	business_address: string
	created_at?: Date
	updated_at?: Date
}

export class BusinessOutlet
	extends Model<
		BusinessOutletAttributes,
		Optional<BusinessOutletAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements BusinessOutletAttributes
{
	public id!: number
	public user_id!: number
	public business_name!: string
	public business_address!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof BusinessOutlet => {
	BusinessOutlet.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
			tableName: 'business_outlet',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return BusinessOutlet
}
