import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface VaccinationDetailAttributes {
	id?: number
	user_id: number
	expense: number
	date: Date
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}
export class VaccinationDetail
	extends Model<
		VaccinationDetailAttributes,
		Optional<
			VaccinationDetailAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements VaccinationDetailAttributes
{
	public id!: number
	public user_id!: number
	public expense!: number
	public date!: Date
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function VaccinationDetailModel(
	sequelize: Sequelize,
): typeof VaccinationDetail {
	VaccinationDetail.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
		},
		{
			sequelize,
			tableName: 'vaccination_details',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return VaccinationDetail
}
