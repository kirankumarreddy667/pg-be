import { Model, DataTypes, Sequelize } from 'sequelize'

export interface UnitAttributes {
  id?: number
  name: string
  display_name: string
  created_at?: Date
  updated_at?: Date
}

export class Unit extends Model<UnitAttributes> implements UnitAttributes {
  public id!: number
  public name!: string
  public display_name!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

const UnitModel = (sequelize: Sequelize): typeof Unit => {
  Unit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'units',
      timestamps: true,
      underscored: true,
    },
  )
  return Unit
}

export default UnitModel