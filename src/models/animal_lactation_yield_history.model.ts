import { Model, DataTypes, Optional, Sequelize } from 'sequelize'

export interface AnimalLactationYieldHistoryAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	date?: Date | null
	pregnancy_status?: string | null
	lactating_status?: string | null
	deleted_at?: Date | null
	created_at?: Date | null
	updated_at?: Date | null
}

export class AnimalLactationYieldHistory
	extends Model<
		AnimalLactationYieldHistoryAttributes,
		Optional<
			AnimalLactationYieldHistoryAttributes,
			| 'id'
			| 'pregnancy_status'
			| 'lactating_status'
			| 'deleted_at'
			| 'created_at'
			| 'updated_at'
		>
	>
	implements AnimalLactationYieldHistoryAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public date!: Date | null
	public pregnancy_status?: string | null
	public lactating_status?: string | null
	public deleted_at?: Date | null
	public readonly created_at?: Date | null
	public readonly updated_at?: Date | null
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
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			date: {
				type: DataTypes.DATEONLY,
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
		},
		{
			sequelize,
			tableName: 'animal_lactation_yield_history',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			indexes: [{ fields: ['user_id'] }],
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AnimalLactationYieldHistory
}
