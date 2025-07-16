import { Model, DataTypes, Sequelize } from 'sequelize'

export interface AnimalLactationYieldHistoryAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	date?: Date | null
	pregnancy_status?: string | null
	lactating_status?: string | null
	created_at?: Date
	updated_at?: Date
}

export class AnimalLactationYieldHistory
	extends Model<AnimalLactationYieldHistoryAttributes>
	implements AnimalLactationYieldHistoryAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public date!: Date | null
	public pregnancy_status!: string | null
	public lactating_status!: string | null
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof AnimalLactationYieldHistory => {
	AnimalLactationYieldHistory.init(
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
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			pregnancy_status: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			lactating_status: {
				type: DataTypes.STRING(50),
				allowNull: true,
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
			tableName: 'animal_lactation_yield_history',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			indexes: [{ fields: ['user_id'] }],
		},
	)
	return AnimalLactationYieldHistory
}
