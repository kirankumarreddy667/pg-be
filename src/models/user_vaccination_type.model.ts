import { DataTypes, Model, Sequelize } from 'sequelize'

export class UserVaccinationType extends Model {
	public vaccination_id!: number
	public type_id!: number
}

export default (sequelize: Sequelize): typeof UserVaccinationType => {
	UserVaccinationType.init(
		{
			vaccination_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			sequelize,
			tableName: 'user_vaccination_type',
			timestamps: false,
		},
	)
	return UserVaccinationType
}
