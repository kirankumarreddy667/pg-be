import { DataTypes, Model, Sequelize } from 'sequelize'

export class VaccinationType extends Model {
	public id!: number
	public type!: string
	public created_at!: Date
	public updated_at!: Date
}

export default (sequelize: Sequelize): typeof VaccinationType => {
	VaccinationType.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			tableName: 'vaccination_types',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return VaccinationType
}
