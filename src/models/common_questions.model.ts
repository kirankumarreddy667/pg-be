import { Model, DataTypes, Sequelize } from 'sequelize'
import type { Category } from './category.model'
import type { Subcategory } from './sub_category.model'
import type { ValidationRule } from './validation_rule.model'
import type { FormType } from './form_type.model'
import type { QuestionTag } from './question_tag.model'
import type { QuestionUnit } from './question_unit.model'
import { CategoryLanguage } from './category_language.model'
import { SubCategoryLanguage } from './sub_category_language.model'

export interface CommonQuestionsAttributes {
	id?: number
	category_id: number
	sub_category_id?: number | null
	question: string
	validation_rule?: string | null
	created_at?: Date
	updated_at?: Date
	form_type_id?: number | null
	validation_rule_id?: number | null
	date?: boolean
	form_type_value?: string | null
	question_tag?: number | null
	question_unit?: number | null
	hint?: string | null
	sequence_number?: number | null
}

export class CommonQuestions
	extends Model<CommonQuestionsAttributes>
	implements CommonQuestionsAttributes
{
	public id!: number
	public category_id!: number
	public sub_category_id!: number | null
	public question!: string
	public validation_rule!: string | null
	public created_at!: Date
	public updated_at!: Date
	public form_type_id!: number | null
	public validation_rule_id!: number | null
	public date!: boolean
	public form_type_value!: string | null
	public question_tag!: number | null
	public question_unit!: number | null
	public hint!: string | null
	public sequence_number!: number | null
	public Category?: Category
	public Subcategory?: Subcategory
	public ValidationRule?: ValidationRule
	public FormType?: FormType
	public QuestionTag?: QuestionTag
	public QuestionUnit?: QuestionUnit
	public CategoryLanguage?: CategoryLanguage
	public SubCategoryLanguage?: SubCategoryLanguage
}

export default (sequelize: Sequelize): typeof CommonQuestions => {
	CommonQuestions.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sub_category_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			question: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			validation_rule: {
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
			form_type_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			validation_rule_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			date: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			form_type_value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question_tag: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			question_unit: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			hint: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			sequence_number: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'common_questions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return CommonQuestions
}
