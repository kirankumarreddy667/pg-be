import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface AnimalVaccinationAttributes {
	vaccination_id: number
	animal_number: string
	deleted_at?: Date | null
}

export class AnimalVaccination extends Model<
	AnimalVaccinationAttributes,
	Optional<AnimalVaccinationAttributes, 'deleted_at'>
> {
	public vaccination_id!: number
	public animal_number!: string
	public deleted_at?: Date | null
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
				type: DataTypes.STRING(191),
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: 'animal_vaccinations',
			timestamps: false,
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalVaccination
}
