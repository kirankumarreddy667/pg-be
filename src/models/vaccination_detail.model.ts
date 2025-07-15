import { DataTypes, Model, Sequelize } from 'sequelize'

export class VaccinationDetail extends Model {
	public id!: number
	public user_id!: number
	public expense!: number
	public date!: Date
	public created_at!: Date
	public updated_at!: Date
}

export default (sequelize: Sequelize): typeof VaccinationDetail => {
	VaccinationDetail.init(
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
			expense: {
				type: DataTypes.DOUBLE(10, 2),
				allowNull: false,
			},
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
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
			tableName: 'vaccination_details',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return VaccinationDetail
}
