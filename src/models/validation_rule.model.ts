import { Model, DataTypes, Sequelize } from 'sequelize'

export interface ValidationRuleAttributes {
	id?: number
	name: string
	description?: string | null
	constant_value: number
	created_at?: Date
	updated_at?: Date
}

export class ValidationRule
	extends Model<ValidationRuleAttributes>
	implements ValidationRuleAttributes
{
	public id!: number
	public name!: string
	public description!: string | null
	public constant_value!: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

const ValidationRuleModel = (sequelize: Sequelize): typeof ValidationRule => {
	ValidationRule.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			constant_value: {
				type: DataTypes.INTEGER,
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
			tableName: 'validation_rules',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return ValidationRule
}

export default ValidationRuleModel
