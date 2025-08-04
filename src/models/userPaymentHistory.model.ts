import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
} from 'sequelize';

export interface UserPaymentHistoryAttributes {
  id?: number;
  user_id: number;
  plan_id: number;
  amount: number;
  payment_id: string;
  num_of_valid_years: number;
  plan_exp_date: Date;
  email?: string;
  billing_instrument: string;
  phone: string;
  status: string;
  coupon_id?: number | null;
  offer_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export class UserPaymentHistory extends Model<
  UserPaymentHistoryAttributes,
  Optional<
    UserPaymentHistoryAttributes,
    | 'id'
    | 'email'
    | 'coupon_id'
    | 'offer_id'
    | 'createdAt'
    | 'updatedAt'
  >
> implements UserPaymentHistoryAttributes {
  public id!: number;
  public user_id!: number;
  public plan_id!: number;
  public amount!: number;
  public payment_id!: string;
  public num_of_valid_years!: number;
  public plan_exp_date!: Date;
  public email?: string;
  public billing_instrument!: string;
  public phone!: string;
  public status!: string;
  public coupon_id?: number | null;
  public offer_id?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof UserPaymentHistory => {
  UserPaymentHistory.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.STRING,
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
      status: {
        type: DataTypes.STRING,
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'user_payment_history',
      timestamps: true,
    }

  );

  return UserPaymentHistory;
};
