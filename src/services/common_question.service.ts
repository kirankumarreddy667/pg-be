import db from '@/config/database'
import { Transaction } from 'sequelize'
import type { CommonQuestions } from '@/models/common_questions.model'
import type { Category } from '@/models/category.model'
import type { Subcategory } from '@/models/sub_category.model'
import type { ValidationRule } from '@/models/validation_rule.model'
import type { FormType } from '@/models/form_type.model'
import type { QuestionTag } from '@/models/question_tag.model'
import type { QuestionUnit } from '@/models/question_unit.model'

type GroupedQuestion = {
	validation_rule: string | null
	master_question: string
	language_question: string
	question_id: number
	form_type: string | null
	date: boolean
	form_type_value: string | null
	question_language_id: number
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number | null
	language_form_type_value: string | null
	language_hint: string | null
	master_hint: string | null
}

export class CommonQuestionService {
	static async create(data: {
		category_id: number
		sub_category_id?: number | null
		language_id: number
		questions: Array<{
			question: string
			form_type_id: number
			validation_rule_id: number
			date: boolean
			form_type_value?: string | null
			question_tag: number
			question_unit: number
			hint?: string | null
		}>
	}): Promise<{ message: string; data: [] }> {
		const t: Transaction = await db.sequelize.transaction()
		try {
			for (const value of data.questions) {
				const questionData = {
					category_id: data.category_id,
					sub_category_id: data.sub_category_id ?? null,
					question: value.question,
					form_type_id: value.form_type_id,
					validation_rule_id: value.validation_rule_id,
					date: value.date,
					form_type_value: value.form_type_value ?? null,
					question_tag: value.question_tag,
					question_unit: value.question_unit,
					hint: value.hint ?? null,
					sequence_number: 0,
				}
				const saveQuestion = await db.CommonQuestions.create(questionData, {
					transaction: t,
				})
				const languageQuestion = {
					question_id: saveQuestion.id,
					language_id: data.language_id,
					question: value.question,
					form_type_value: value.form_type_value ?? null,
					hint: value.hint ?? null,
				}
				await db.QuestionLanguage.create(languageQuestion, { transaction: t })
			}
			await t.commit()
			return { message: 'Questions added successfully', data: [] }
		} catch (error) {
			await t.rollback()
			throw error
		}
	}

	static async update(
		id: number,
		data: {
			category_id: number
			sub_category_id?: number | null
			question: string
			form_type_id: number
			validation_rule_id: number
			date: boolean
			form_type_value?: string | null
			question_tag: number
			question_unit: number
			hint?: string | null
		},
	): Promise<{ message: string; data: [] }> {
		const t: Transaction = await db.sequelize.transaction()
		try {
			const question = await db.CommonQuestions.findByPk(id, { transaction: t })
			if (!question) {
				await t.rollback()
				throw new Error('Question not found')
			}
			await question.update(
				{
					category_id: data.category_id,
					sub_category_id: data.sub_category_id ?? null,
					question: data.question,
					form_type_id: data.form_type_id,
					validation_rule_id: data.validation_rule_id,
					date: data.date,
					form_type_value: data.form_type_value ?? null,
					question_tag: data.question_tag,
					question_unit: data.question_unit,
					hint: data.hint ?? null,
				},
				{ transaction: t },
			)
			await t.commit()
			return { message: 'Updated successfully.', data: [] }
		} catch (error) {
			await t.rollback()
			throw error
		}
	}

	static async delete(
		id: number,
	): Promise<{ success: boolean; message: string; data?: []; errors?: [] }> {
		const t: Transaction = await db.sequelize.transaction()
		try {
			const deleted = await db.CommonQuestions.destroy({
				where: { id },
				transaction: t,
			})
			if (!deleted) {
				await t.rollback()
				return {
					success: false,
					message: 'Something went wrong. Please try again',
					errors: [],
				}
			}
			await t.commit()
			return { success: true, message: 'Success', data: [] }
		} catch (error) {
			await t.rollback()
			throw error
		}
	}

	static async findById(id: number): Promise<null | {
		category_name: string | null
		sub_category_name: string | null
		validation_rule: string | null
		question: string
		form_type: string | null
		question_id: number
		date: boolean
	}> {
		const result = (await db.CommonQuestions.findOne({
			where: { id },
			include: [
				{ model: db.Category, as: 'Category', attributes: ['name'] },
				{
					model: db.Subcategory,
					as: 'Subcategory',
					attributes: ['name'],
					required: false,
				},
				{
					model: db.ValidationRule,
					as: 'ValidationRule',
					attributes: ['name'],
				},
				{
					model: db.FormType,
					as: 'FormType',
					attributes: ['name'],
					required: false,
				},
			],
			attributes: ['id', 'question', 'date'],
		})) as
			| (CommonQuestions & {
					Category?: Category
					Subcategory?: Subcategory
					ValidationRule?: ValidationRule
					FormType?: FormType
			  })
			| null
		if (!result) return null
		return {
			category_name: result.Category?.name ?? null,
			sub_category_name: result.Subcategory?.name ?? null,
			validation_rule: result.ValidationRule?.name ?? null,
			question: result.question,
			form_type: result.FormType?.name ?? null,
			question_id: result.id,
			date: result.date,
		}
	}

	static async listAll(): Promise<{
		message: string
		data: Array<{
			category_id: number
			category_name: string | null
			sub_category_id: number | null
			sub_category_name: string | null
			question: string
			form_type: string | null
			validation_rule: string | null
			qiestion_id: number
			validation_rule_id: number | null
			form_type_id: number | null
			date: boolean
			form_type_value: string | null
			constant_value: string | number | null
			question_tag: string | null
			question_unit: string | null
			question_tag_id: number | null
			question_unit_id: number | null
			hint: string | null
		}>
	}> {
		const questions = (await db.CommonQuestions.findAll({
			include: [
				{ model: db.Category, as: 'Category', attributes: ['id', 'name'] },
				{
					model: db.Subcategory,
					as: 'Subcategory',
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.FormType,
					as: 'FormType',
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.ValidationRule,
					as: 'ValidationRule',
					attributes: ['id', 'name', 'constant_value'],
				},
				{
					model: db.QuestionTag,
					as: 'QuestionTag',
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.QuestionUnit,
					as: 'QuestionUnit',
					attributes: ['id', 'name'],
					required: false,
				},
			],
			attributes: [
				'id',
				'category_id',
				'sub_category_id',
				'question',
				'form_type_id',
				'validation_rule_id',
				'date',
				'form_type_value',
				'question_tag',
				'question_unit',
				'hint',
			],
			order: [[{ model: db.Category, as: 'Category' }, 'name', 'ASC']],
		})) as Array<
			CommonQuestions & {
				Category?: Category
				Subcategory?: Subcategory
				ValidationRule?: ValidationRule
				FormType?: FormType
				QuestionTag?: QuestionTag
				QuestionUnit?: QuestionUnit
			}
		>
		const data = questions.map((question) => ({
			category_id: question.category_id,
			category_name: question.Category?.name ?? null,
			sub_category_id: question.sub_category_id,
			sub_category_name: question.Subcategory?.name ?? null,
			question: question.question,
			form_type: question.FormType?.name ?? null,
			validation_rule: question.ValidationRule?.name ?? null,
			qiestion_id: question.id,
			validation_rule_id: question.validation_rule_id,
			form_type_id: question.form_type_id,
			date: question.date,
			form_type_value: question.form_type_value,
			constant_value: question.ValidationRule?.constant_value ?? null,
			question_tag: question.QuestionTag?.name ?? null,
			question_unit: question.QuestionUnit?.name ?? null,
			question_tag_id: question.question_tag,
			question_unit_id: question.question_unit,
			hint: question.hint ?? null,
		}))
		return { message: 'Success', data }
	}

	static async addQuestionsInOtherLanguage(data: {
		question_id: number
		language_id: number
		question: string
		form_type_value?: string | null
		hint?: string | null
	}): Promise<{ success: boolean; message: string; data?: []; errors?: [] }> {
		const exists = await db.QuestionLanguage.findOne({
			where: { question_id: data.question_id, language_id: data.language_id },
		})
		if (exists) {
			return {
				success: false,
				message: 'This question is already added in this language',
				errors: [],
			}
		}
		await db.QuestionLanguage.create({
			question_id: data.question_id,
			language_id: data.language_id,
			question: data.question,
			form_type_value: data.form_type_value ?? null,
			hint: data.hint ?? null,
		})
		return { success: true, message: 'Success', data: [] }
	}

	static async updateOtherLanguageQuestion(
		id: number,
		data: {
			question_id: number
			language_id: number
			question: string
			form_type_value?: string | null
			hint?: string | null
		},
	): Promise<{ message: string; data: [] }> {
		const record = await db.QuestionLanguage.findByPk(id)
		if (!record) throw new Error('Question language record not found')
		await record.update({
			question_id: data.question_id,
			language_id: data.language_id,
			question: data.question,
			form_type_value: data.form_type_value ?? null,
			hint: data.hint ?? null,
		})
		return { message: 'Updated successfully.', data: [] }
	}

	static async getAllQuestionsInDifferentLanguages(
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, GroupedQuestion[]>>
	}> {
		// Get all questions with their language translation and related info for the given language_id
		const questions = await db.QuestionLanguage.findAll({
			where: { language_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					include: [
						{ model: db.FormType, as: 'FormType', attributes: ['id', 'name'] },
						{
							model: db.ValidationRule,
							as: 'ValidationRule',
							attributes: ['id', 'name'],
						},
						{
							model: db.CategoryLanguage,
							as: 'CategoryLanguage',
							where: { language_id },
							required: false,
							attributes: ['category_language_name'],
						},
						{
							model: db.SubCategoryLanguage,
							as: 'SubCategoryLanguage',
							where: { language_id },
							required: false,
							attributes: ['sub_category_language_name'],
						},
					],
				},
			],
		})

		// Group by category_language_name and sub_category_language_name
		const resData: Record<string, Record<string, GroupedQuestion[]>> = {}
		for (const ql of questions) {
			const cq = ql.CommonQuestion
			if (!cq) continue
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			const subCategoryName =
				cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []
			resData[categoryName][subCategoryName].push({
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql.question,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				form_type_value: cq.form_type_value,
				question_language_id: ql.id,
				category_id: cq.category_id,
				sub_category_id: cq.sub_category_id,
				validation_rule_id: cq.validation_rule_id,
				language_form_type_value: ql.form_type_value,
				language_hint: ql.hint,
				master_hint: cq.hint,
			})
		}
		return { message: 'success', data: resData }
	}
}
