import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface UserOfferAttributes {
  id?: number;
  offer_id: number;
  plan_id?: number;
  product_id?: number;
  offer_type?: string;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type UserOfferCreationAttributes = Optional<
  UserOfferAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class UserOffer
  extends Model<UserOfferAttributes, UserOfferCreationAttributes>
  implements UserOfferAttributes {
  id?: number;
  offer_id!: number;
  plan_id?: number;
  product_id?: number;
  offer_type?: string;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

const UserOfferModel = (sequelize: Sequelize): typeof UserOffer => {
  UserOffer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        type: DataTypes.STRING,
        allowNull: false,
        field: 'offer_type', // ✅ explicit mapping
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'user_offers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return UserOffer;
};

export default UserOfferModel;
