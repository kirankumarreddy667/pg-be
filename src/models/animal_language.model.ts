import { Model, Sequelize, DataTypes } from 'sequelize'

export class AnimalLanguage extends Model {
	public id!: number
	public animal_id!: number
	public language_id!: number
	public name!: string
}

export default (sequelize: Sequelize): typeof AnimalLanguage => {
	AnimalLanguage.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'AnimalLanguage',
			tableName: 'animal_language',
			timestamps: true,
		},
	)
	return AnimalLanguage
}
