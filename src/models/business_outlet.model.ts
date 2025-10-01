import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface BusinessOutletAttributes {
	id?: number
	business_name: string
	business_address: string
	assign_to: number
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class BusinessOutlet
	extends Model<
		BusinessOutletAttributes,
		Optional<
			BusinessOutletAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements BusinessOutletAttributes
{
	public id!: number
	public business_name!: string
	public business_address!: string
	public assign_to!: number
	public readonly created_at!: Date | null
	public readonly updated_at!: Date | null
	public readonly deleted_at!: Date | null
}

export default function BusinessOutletModel(
	sequelize: Sequelize,
): typeof BusinessOutlet {
	BusinessOutlet.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			business_name: {
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true,
			},
			business_address: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			assign_to: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'business_outlet',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return BusinessOutlet
}
