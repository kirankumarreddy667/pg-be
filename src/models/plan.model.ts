import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface PlanAttributes {
  id?: number
  name: string
  amount: string
  plan_type_id: number
  language_id: number
  created_at?: Date
  updated_at?: Date
}

export type PlanCreationAttributes = Optional<PlanAttributes, 'id' | 'created_at' | 'updated_at'>

export class Plan extends Model<PlanAttributes, PlanCreationAttributes> implements PlanAttributes {
  public id!: number
  public name!: string
  public amount!: string
  public plan_type_id!: number
  public language_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Plan => {
  Plan.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.STRING, allowNull: false },
      plan_type_id: { type: DataTypes.INTEGER, allowNull: false },
      language_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      tableName: 'plans',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return Plan
}
