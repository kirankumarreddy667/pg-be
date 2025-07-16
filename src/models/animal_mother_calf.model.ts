import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface AnimalMotherCalfAttributes {
	id: number
	user_id: number
	animal_id: number
	delivery_date: Date
	mother_animal_number: string
	calf_animal_number: string
	created_at?: Date
	updated_at?: Date
}

export class AnimalMotherCalf
	extends Model<
		AnimalMotherCalfAttributes,
		Optional<AnimalMotherCalfAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements AnimalMotherCalfAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public delivery_date!: Date
	public mother_animal_number!: string
	public calf_animal_number!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof AnimalMotherCalf => {
	AnimalMotherCalf.init(
		{
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false },
			animal_id: { type: DataTypes.INTEGER, allowNull: false },
			delivery_date: { type: DataTypes.DATEONLY, allowNull: false },
			mother_animal_number: { type: DataTypes.STRING, allowNull: false },
			calf_animal_number: { type: DataTypes.STRING, allowNull: false },
			created_at: { type: DataTypes.DATE, allowNull: false },
			updated_at: { type: DataTypes.DATE, allowNull: false },
		},
		{
			sequelize,
			tableName: 'animal_mother_calfs',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return AnimalMotherCalf
}
