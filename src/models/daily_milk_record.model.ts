import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyMilkRecordAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	record_date: Date
	morning_milk_in_litres: number
	evening_milk_in_litres: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class DailyMilkRecord
	extends Model<
		DailyMilkRecordAttributes,
		Optional<
			DailyMilkRecordAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements DailyMilkRecordAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public record_date!: Date
	public morning_milk_in_litres!: number
	public evening_milk_in_litres!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof DailyMilkRecord => {
	DailyMilkRecord.init(
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
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_number: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			record_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			morning_milk_in_litres: {
				type: DataTypes.DOUBLE(10, 2),
				allowNull: false,
			},
			evening_milk_in_litres: {
				type: DataTypes.DOUBLE(10, 2),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'daily_milk_records',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return DailyMilkRecord
}
