import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface AnimalMotherCalfAttributes {
	id: number
	user_id: number
	animal_id: number
	delivery_date: Date
	mother_animal_number: string
	calf_animal_number: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class AnimalMotherCalf
	extends Model<
		AnimalMotherCalfAttributes,
		Optional<
			AnimalMotherCalfAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AnimalMotherCalfAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public delivery_date!: Date
	public mother_animal_number!: string
	public calf_animal_number!: string
	public readonly created_at?: Date | null
	public readonly updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function AnimalMotherCalfModel(
	sequelize: Sequelize,
): typeof AnimalMotherCalf {
	AnimalMotherCalf.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			animal_id: { type: DataTypes.INTEGER, allowNull: false },
			delivery_date: { type: DataTypes.DATEONLY, allowNull: false },
			mother_animal_number: { type: DataTypes.STRING(191), allowNull: false },
			calf_animal_number: { type: DataTypes.STRING(191), allowNull: false },
		},
		{
			sequelize,
			tableName: 'animal_mother_calfs',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalMotherCalf
}
