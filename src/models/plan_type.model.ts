import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface PlanTypeAttributes {
	id?: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export type PlanTypeCreationAttributes = Optional<
	PlanTypeAttributes,
	'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

export class PlanType
	extends Model<PlanTypeAttributes, PlanTypeCreationAttributes>
	implements PlanTypeAttributes
{
	public id!: number
	public name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function PlanTypeModel(sequelize: Sequelize): typeof PlanType {
	PlanType.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: { type: DataTypes.STRING(191), allowNull: false },
		},
		{
			sequelize,
			tableName: 'plan_type',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return PlanType
}
