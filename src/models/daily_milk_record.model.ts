import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DailyMilkRecordAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	record_date: Date
	morning_milk_in_litres: number
	evening_milk_in_litres: number
	created_at?: Date
	updated_at?: Date
}

export class DailyMilkRecord
	extends Model<
		DailyMilkRecordAttributes,
		Optional<DailyMilkRecordAttributes, 'id' | 'created_at' | 'updated_at'>
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
	public readonly created_at!: Date
	public readonly updated_at!: Date

	// static associate(models: any) {
	//   DailyMilkRecord.belongsTo(models.User, { foreignKey: 'user_id' })
	//   DailyMilkRecord.belongsTo(models.Animal, { foreignKey: 'animal_id' })
	// }
}

export default (sequelize: Sequelize): typeof DailyMilkRecord => {
	DailyMilkRecord.init(
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
			record_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			morning_milk_in_litres: {
				type: DataTypes.DECIMAL(8, 2),
				allowNull: false,
			},
			evening_milk_in_litres: {
				type: DataTypes.DECIMAL(8, 2),
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
			tableName: 'daily_milk_records',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			indexes: [{ fields: ['animal_id', 'record_date'] }],
		},
	)
	return DailyMilkRecord
}
