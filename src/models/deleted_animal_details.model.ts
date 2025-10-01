import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface DeletedAnimalDetailsAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	question_id: number
	answer: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class DeletedAnimalDetails
	extends Model<
		DeletedAnimalDetailsAttributes,
		Optional<
			DeletedAnimalDetailsAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements DeletedAnimalDetailsAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public question_id!: number
	public answer!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof DeletedAnimalDetails => {
	DeletedAnimalDetails.init(
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
				type: DataTypes.STRING(195),
				allowNull: false,
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			answer: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'deleted_animal_details',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
			paranoid: true,
		},
	)
	return DeletedAnimalDetails
}
