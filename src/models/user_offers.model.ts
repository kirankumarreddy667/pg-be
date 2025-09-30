import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface UserOffersAttributes {
	id?: number
	offer_id: number
	plan_id?: number | null
	product_id?: number | null
	offer_type: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class UserOffers extends Model<
	UserOffersAttributes,
	Optional<
		UserOffersAttributes,
		'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'plan_id' | 'product_id'
	>
> {
	public id?: number
	public offer_id!: number
	public plan_id?: number | null
	public product_id?: number | null
	public offer_type!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function UserOffersModel(
	sequelize: Sequelize,
): typeof UserOffers {
	UserOffers.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
			},
			offer_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			plan_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			offer_type: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'user_offers',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return UserOffers
}
