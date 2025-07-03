import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface LanguageAttributes {
  id?: number;
  name: string;
  language_code: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Language extends Model<LanguageAttributes, Optional<LanguageAttributes, 'id' | 'created_at' | 'updated_at'>> implements LanguageAttributes {
  public id!: number;
  public name!: string;
  public language_code!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default (sequelize: Sequelize): typeof Language => {
  Language.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language_code: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: 'languages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Language;
}; 