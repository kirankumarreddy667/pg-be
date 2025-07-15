import { DataTypes, Model, Sequelize } from 'sequelize'

export class AnimalVaccination extends Model {
	public vaccination_id!: number
	public animal_number!: string
}

export default (sequelize: Sequelize): typeof AnimalVaccination => {
	AnimalVaccination.init(
		{
			vaccination_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			animal_number: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: 'animal_vaccinations',
			timestamps: false,
		},
	)
	return AnimalVaccination
}
