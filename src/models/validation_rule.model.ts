import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface ValidationRuleAttributes {
	id?: number
	name: string
	description?: string | null
	constant_value: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class ValidationRule
	extends Model<
		ValidationRuleAttributes,
		Optional<
			ValidationRuleAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements ValidationRuleAttributes
{
	public id!: number
	public name!: string
	public description?: string | null
	public constant_value!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

const ValidationRuleModel = (sequelize: Sequelize): typeof ValidationRule => {
	ValidationRule.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			constant_value: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'validation_rules',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return ValidationRule
}

export default ValidationRuleModel
