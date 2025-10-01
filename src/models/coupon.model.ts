import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface CouponAttributes {
	id?: number
	coupon_code: string
	amount: number
	type: string
	exp_date?: Date | null
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Coupon
	extends Model<
		CouponAttributes,
		Optional<
			CouponAttributes,
			'id' | 'created_at' | 'updated_at' | 'exp_date' | 'deleted_at'
		>
	>
	implements CouponAttributes
{
	public id!: number
	public coupon_code!: string
	public amount!: number
	public type!: string
	public exp_date?: Date | null
	public created_at?: Date | null
	public updated_at?: Date | null
}

export default function CouponModel(sequelize: Sequelize): typeof Coupon {
	Coupon.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			coupon_code: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			exp_date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'coupon',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Coupon
}
