import { Model, DataTypes, Sequelize } from 'sequelize'

export interface DeletedAnimalDetailsAttributes {
	id?: number
	user_id: number
	animal_id: number
	animal_number: string
	question_id: number
	answer: string
	created_at?: Date
	updated_at?: Date
}

export class DeletedAnimalDetails
	extends Model<DeletedAnimalDetailsAttributes>
	implements DeletedAnimalDetailsAttributes
{
	public id!: number
	public user_id!: number
	public animal_id!: number
	public animal_number!: string
	public question_id!: number
	public answer!: string
	public created_at!: Date
	public updated_at!: Date
}

export default (sequelize: Sequelize): typeof DeletedAnimalDetails => {
	DeletedAnimalDetails.init(
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
			tableName: 'deleted_animal_details',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return DeletedAnimalDetails
}
