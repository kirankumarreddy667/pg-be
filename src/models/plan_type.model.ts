import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface PlanTypeAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

export type PlanTypeCreationAttributes = Optional<PlanTypeAttributes, 'id' | 'created_at' | 'updated_at'>

export class PlanType extends Model<PlanTypeAttributes, PlanTypeCreationAttributes> implements PlanTypeAttributes {
  public id!: number
  public name!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof PlanType => {
  PlanType.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      tableName: 'plan_type',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return PlanType
}
