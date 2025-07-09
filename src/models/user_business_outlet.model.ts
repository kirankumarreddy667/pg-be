import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface UserBusinessOutletAttributes {
	id?: number
	user_id: number
	business_outlet_id: number
	created_at?: Date
	updated_at?: Date
}

export class UserBusinessOutlet
	extends Model<
		UserBusinessOutletAttributes,
		Optional<UserBusinessOutletAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements UserBusinessOutletAttributes
{
	public id!: number
	public user_id!: number
	public business_outlet_id!: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof UserBusinessOutlet => {
	UserBusinessOutlet.init(
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
			business_outlet_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
			tableName: 'user_business_outlet',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return UserBusinessOutlet
}
