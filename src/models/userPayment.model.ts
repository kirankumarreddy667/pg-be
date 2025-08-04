import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
} from 'sequelize';

export interface UserPaymentAttributes {
  id?: number;
  user_id: number;
  plan_id: number;
  coupon_id?: number | null;
  offer_id?: number | null;
  payment_id: string;
  amount: number;
  num_of_valid_years: number;
  plan_exp_date: Date;
  email?: string | null;
  billing_instrument: string;
  phone: string;
  payment_history_id?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export class UserPayment extends Model<
  UserPaymentAttributes,
  Optional<
    UserPaymentAttributes,
    | 'id'
    | 'coupon_id'
    | 'offer_id'
    | 'email'
    | 'payment_history_id'
    | 'created_at'
    | 'updated_at'
  >
> implements UserPaymentAttributes {
  declare id: number;
  declare user_id: number;
  declare plan_id: number;
  declare coupon_id: number | null;
  declare offer_id: number | null;
  declare payment_id: string;
  declare currency: string;
  declare amount: number;
  declare num_of_valid_years: number;
  declare plan_exp_date: Date;
  declare email: string | null;
  declare billing_instrument: string;
  declare phone: string;
  declare payment_history_id: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export default (sequelize: Sequelize): typeof UserPayment => {
  UserPayment.init(
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
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      offer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      num_of_valid_years: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plan_exp_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      billing_instrument: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_history_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'user_payment',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return UserPayment;
};
