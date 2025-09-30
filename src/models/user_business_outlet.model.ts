import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface UserBusinessOutletAttributes {
	id?: number
	user_id: number
	business_outlet_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class UserBusinessOutlet
	extends Model<
		UserBusinessOutletAttributes,
		Optional<
			UserBusinessOutletAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements UserBusinessOutletAttributes
{
	public id!: number
	public user_id!: number
	public business_outlet_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function UserBusinessOutletModel(
	sequelize: Sequelize,
): typeof UserBusinessOutlet {
	UserBusinessOutlet.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
		},
		{
			sequelize,
			tableName: 'user_business_outlet',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return UserBusinessOutlet
}
