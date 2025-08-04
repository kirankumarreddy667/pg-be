import { Model, DataTypes, Sequelize, Optional } from 'sequelize'


export interface EnquireUsAttributes {
	id?: number
	first_name: string
	last_name?: string
	email: string
	phone_number?: string
	query: string
	created_at?: Date
	updated_at?: Date
}


export type EnquireUsCreationAttributes = Optional<
	EnquireUsAttributes,
	'id' | 'created_at' | 'updated_at'
>


export class EnquireUs extends Model<EnquireUsAttributes, EnquireUsCreationAttributes> { }

export default (sequelize: Sequelize): typeof EnquireUs => {
	EnquireUs.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			query: {
				type: DataTypes.TEXT,
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
			tableName: 'enquire_us',
			timestamps: true,
			underscored: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	)

	return EnquireUs
}
