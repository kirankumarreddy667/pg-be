import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface UserFarmDetailsAttributes {
	id: number
	user_id: number
	farm_name: string
	farm_type: string
	farm_type_id?: number | null
	loose_housing?: string | null
	silage?: string | null
	azzola?: string | null
	hydroponics?: string | null
	created_at?: Date
	updated_at?: Date
}

export class UserFarmDetails
	extends Model<
		UserFarmDetailsAttributes,
		Optional<
			UserFarmDetailsAttributes,
			| 'id'
			| 'farm_type_id'
			| 'loose_housing'
			| 'silage'
			| 'azzola'
			| 'hydroponics'
			| 'created_at'
			| 'updated_at'
		>
	>
	implements UserFarmDetailsAttributes
{
	public id!: number
	public user_id!: number
	public farm_name!: string
	public farm_type!: string
	public farm_type_id?: number | null
	public loose_housing?: string | null
	public silage?: string | null
	public azzola?: string | null
	public hydroponics?: string | null
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof UserFarmDetails => {
	UserFarmDetails.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			farm_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			farm_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			farm_type_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			loose_housing: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			silage: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			azzola: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			hydroponics: {
				type: DataTypes.STRING,
				allowNull: true,
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
			modelName: 'UserFarmDetails',
			tableName: 'user_farm_details',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return UserFarmDetails
}
