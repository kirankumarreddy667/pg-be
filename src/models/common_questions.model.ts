import { Model, DataTypes, Sequelize, Optional } from 'sequelize'
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
	created_at?: Date | null
	updated_at?: Date | null
	form_type_id?: number | null
	validation_rule_id: number
	date: boolean
	form_type_value?: string | null
	question_tag: number
	question_unit?: number | null
	hint?: string | null
	sequence_number: number
	deleted_at?: Date | null
}

export class CommonQuestions
	extends Model<
		CommonQuestionsAttributes,
		Optional<
			CommonQuestionsAttributes,
			| 'id'
			| 'question_unit'
			| 'form_type_id'
			| 'form_type_value'
			| 'hint'
			| 'created_at'
			| 'updated_at'
			| 'sub_category_id'
			| 'deleted_at'
		>
	>
	implements CommonQuestionsAttributes
{
	public id!: number
	public category_id!: number
	public sub_category_id?: number | null
	public question!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
	public form_type_id?: number | null
	public validation_rule_id!: number
	public date!: boolean
	public form_type_value?: string | null
	public question_tag!: number
	public question_unit?: number | null
	public hint?: string | null
	public sequence_number!: number
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
				type: DataTypes.INTEGER.UNSIGNED,
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
			validation_rule_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			date: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 0,
			},
			form_type_value: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			question_tag: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'common_questions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			paranoid: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return CommonQuestions
}
