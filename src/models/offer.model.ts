import { Model, DataTypes, Sequelize } from 'sequelize'

export interface OfferAttributes {
  id?: number
  image?: string
  additional_months?: number
  additional_years?: number
  language_id: number
  created_at?: Date
  updated_at?: Date
}

export class Offer extends Model<OfferAttributes> implements OfferAttributes {
  public id!: number
  public image?: string
  public additional_months?: number
  public additional_years?: number
  public language_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

const OfferModel = (sequelize: Sequelize): typeof Offer => {
  Offer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additional_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      additional_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      language_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'offers',
      timestamps: true,
      underscored: true,
    }
  )

  return Offer
}

export default OfferModel
