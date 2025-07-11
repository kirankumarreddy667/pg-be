import { Model, DataTypes, Sequelize } from 'sequelize'

export interface AnimalQuestionAnswerAttributes {
	id?: number
	question_id: number
	user_id: number
	answer: string
	created_at?: Date
	updated_at?: Date
	animal_id: number
	animal_number: string
	status?: boolean
	logic_value?: string | null
}

export class AnimalQuestionAnswer
	extends Model<AnimalQuestionAnswerAttributes>
	implements AnimalQuestionAnswerAttributes
{
	public id!: number
	public question_id!: number
	public user_id!: number
	public answer!: string
	public created_at!: Date
	public updated_at!: Date
	public animal_id!: number
	public animal_number!: string
	public status!: boolean
	public logic_value!: string | null
}

export default (sequelize: Sequelize): typeof AnimalQuestionAnswer => {
	AnimalQuestionAnswer.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			answer: {
				type: DataTypes.STRING,
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
			animal_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			animal_number: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			logic_value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'animal_question_answers',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return AnimalQuestionAnswer
}
