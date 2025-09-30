import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface VaccinationTypeAttributes {
	id?: number
	type: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class VaccinationType extends Model<
	VaccinationTypeAttributes,
	Optional<
		VaccinationTypeAttributes,
		'id' | 'created_at' | 'updated_at' | 'deleted_at'
	>
> {
	public id!: number
	public type!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function VaccinationTypeModel(
	sequelize: Sequelize,
): typeof VaccinationType {
	VaccinationType.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			type: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'vaccination_types',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return VaccinationType
}
