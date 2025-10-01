import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface PlanAttributes {
	id?: number
	name: string
	amount: string
	plan_type_id: number
	language_id: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export type PlanCreationAttributes = Optional<
	PlanAttributes,
	'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

export class Plan
	extends Model<PlanAttributes, PlanCreationAttributes>
	implements PlanAttributes
{
	public id!: number
	public name!: string
	public amount!: string
	public plan_type_id!: number
	public language_id!: number
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function PlanModel(sequelize: Sequelize): typeof Plan {
	Plan.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: { type: DataTypes.STRING(191), allowNull: false },
			amount: { type: DataTypes.STRING(191), allowNull: false },
			plan_type_id: { type: DataTypes.INTEGER, allowNull: false },
			language_id: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			sequelize,
			tableName: 'plans',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return Plan
}
