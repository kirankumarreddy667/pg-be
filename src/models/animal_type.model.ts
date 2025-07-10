import { Model, Sequelize, DataTypes } from 'sequelize'

export class AnimalType extends Model {
	public id!: number
	public animal_id!: number
	public type_id!: number
}

export default (sequelize: Sequelize): typeof AnimalType => {
	AnimalType.init(
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
			type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'AnimalType',
			tableName: 'animal_type',
			timestamps: true,
		},
	)
	return AnimalType
}
