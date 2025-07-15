import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface CouponAttributes {
  id?: number
  coupon_code: string
  amount: number
  type: string
  status?: boolean
  exp_date?: Date | null
  created_at?: Date
  updated_at?: Date
}

export class Coupon
  extends Model<CouponAttributes, Optional<CouponAttributes, 'id' | 'created_at' | 'updated_at'>>
  implements CouponAttributes {
  public id!: number
  public coupon_code!: string
  public amount!: number
  public type!: string
  public status!: boolean
  public exp_date!: Date | null
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Coupon => {
  Coupon.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      coupon_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      exp_date: {
        type: DataTypes.DATE,
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
    },
    {
      sequelize,
      tableName: 'coupon',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return Coupon
}
