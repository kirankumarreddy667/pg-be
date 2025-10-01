import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface EnquireUsAttributes {
	id?: number
	first_name: string
	last_name?: string | null
	email: string
	phone_number: string
	query: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export type EnquireUsCreationAttributes = Optional<
	EnquireUsAttributes,
	'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

export class EnquireUs
	extends Model<EnquireUsAttributes, EnquireUsCreationAttributes>
	implements EnquireUsAttributes
{
	public id!: number
	public first_name!: string
	public last_name?: string | null
	public email!: string
	public phone_number!: string
	public query!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof EnquireUs => {
	EnquireUs.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			first_name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			query: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'enquire_us',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			paranoid: true,
		},
	)

	return EnquireUs
}
