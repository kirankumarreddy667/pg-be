import db from '@/config/database'
import { QueryTypes, type Model } from 'sequelize'
import type { DailyRecordQuestionAttributes } from '@/models/daily_record_questions.model'
import {
	NotFoundError,
	ValidationError,
	ValidationRequestError,
} from '@/utils/errors'

type QuestionInput = {
	question: string
	form_type_id: number
	validation_rule_id: number
	date?: boolean
	form_type_value?: string
	question_tag: number[]
	question_unit: number
	hint?: string
	sequence_number?: number
	delete_status?: number
}

type CreateDailyRecordQuestionsInput = {
	category_id: number
	sub_category_id?: number
	language_id: number
	questions: QuestionInput[]
}

interface DailyQuestionInLanguage {
	daily_record_question_id: number
	master_question: string
	question_in_other_language: string
	validation_rule: string
	form_type: string | null
	date: string
	form_type_value: string | null
	language_form_type_value: string | null
	question_tag: string | null
	question_unit: string | null
	constant_value: string | null
	daily_record_questions_language_id: number
	delete_status: number
	language_hint: string | null
	master_hint: string | null
	created_at: string
}
interface DailyQuestionRawResult {
	daily_record_question_id: number
	question: string
	category_name: string
	sub_category_name: string | null
	validation_rule: string | undefined
	form_type: string | undefined
	date: boolean
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number
	form_type_id: number
	form_type_value: string | null
	question_unit_name: string
	question_tag_name: string
	delete_status: boolean
	constant_value: number
	question_unit: number
	question_tag: number
	hint?: string
}

interface QuestionTag {
	question_tag_id: number
	question_tag_name: string
}
interface GroupedQuestionWithTags {
	question: string
	form_type: string | undefined
	validation_rule: string | undefined
	daily_record_question_id: number
	date: boolean
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number | null
	form_type_id: number | null
	form_type_value: string | null
	question_unit: string | null
	constant_value: string | number | null
	question_unit_id: number | null
	delete_status: boolean
	question_tags: QuestionTag[]
	hint?: string | null
}

export interface UpdateDailyRecordQuestionInput {
	category_id: number
	sub_category_id?: number | null
	question: string
	validation_rule_id: number
	form_type_id: number
	date: boolean
	form_type_value?: string | null
	question_tag_id: number[]
	question_unit_id: number
	hint?: string | null
}

interface GroupedQuestion {
	question: string
	form_type: string | undefined
	validation_rule: string | undefined
	daily_record_question_id: number
	date: boolean
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number
	form_type_id: number
	form_type_value: string | null
	question_tag: string | null
	question_unit: string | null
	constant_value: number | undefined
	question_tag_id: number
	question_unit_id: number
	delete_status: boolean
	hint?: string | null
	question_tags?: { id: number; name: string }[]
}

export class DailyRecordQuestionService {
	static async create(
		data: CreateDailyRecordQuestionsInput,
	): Promise<Model<DailyRecordQuestionAttributes>[]> {
		const catergory = await db.Category.findOne({
			where: {
				id: data.category_id,
				deleted_at: null,
			},
		})
		if (!catergory)
			throw new ValidationRequestError({
				category_id: ['The selected category id is invalid.'],
			})

		if (data.sub_category_id) {
			const subCategory = await db.Subcategory.findOne({
				where: {
					id: data.sub_category_id,
					deleted_at: null,
				},
			})
			if (!subCategory)
				throw new ValidationRequestError({
					sub_category_id: ['The selected sub category id is invalid.'],
				})
		}

		const language = await db.Language.findOne({
			where: {
				id: data.language_id,
				deleted_at: null,
			},
		})
		if (!language)
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid.'],
			})

		for (const value of data.questions) {
			const question = await db.DailyRecordQuestion.findOne({
				where: {
					question: value.question,
					delete_status: false,
				},
			})
			if (question)
				throw new ValidationRequestError({
					[`questions.${data.questions.indexOf(value)}.question`]: [
						`questions.${data.questions.indexOf(value)}.question has already been taken.`,
					],
				})

			const formType = await db.FormType.findOne({
				where: {
					id: value.form_type_id,
					deleted_at: null,
				},
			})
			if (!formType)
				throw new ValidationRequestError({
					[`questions.${data.questions.indexOf(value)}.form_type_id`]: [
						`The selected questions.${data.questions.indexOf(value)}.form_type_id is invalid.`,
					],
				})

			const validationRule = await db.ValidationRule.findOne({
				where: {
					id: value.validation_rule_id,
					deleted_at: null,
				},
			})
			if (!validationRule)
				throw new ValidationRequestError({
					[`questions.${data.questions.indexOf(value)}.validation_rule_id`]: [
						`The selected questions.${data.questions.indexOf(value)}.validation_rule_id is invalid.`,
					],
				})

			if (Array.isArray(value.question_tag) && value.question_tag.length > 0) {
				const questionTags = await db.QuestionTag.findAll({
					where: { id: value.question_tag, deleted_at: null },
				})

				if (questionTags.length !== value.question_tag.length) {
					throw new ValidationRequestError({
						[`questions.${data.questions.indexOf(value)}.question_tag`]: [
							`The selected questions.${data.questions.indexOf(value)}.question_tag is invalid.`,
						],
					})
				}
			}

			const questionUnit = await db.QuestionUnit.findOne({
				where: {
					id: value.question_unit,
					deleted_at: null,
				},
			})
			if (!questionUnit)
				throw new ValidationRequestError({
					[`questions.${data.questions.indexOf(value)}.question_unit`]: [
						`The selected questions.${data.questions.indexOf(value)}.question_unit is invalid.`,
					],
				})
		}

		const questions = data.questions.map((q) => this.buildQuestionData(data, q))
		const savedQuestions = await db.DailyRecordQuestion.bulkCreate(questions, {
			returning: true,
		})
		await Promise.all([
			this.createTagMappings(savedQuestions, data.questions),
			this.createLanguageMappings(savedQuestions, data),
		])
		return savedQuestions
	}

	static async listAll(): Promise<{
		message: string
		data: Record<string, Record<string, GroupedQuestion[]>> | []
	}> {
		const query = `
                SELECT 
                    dr.id as daily_record_question_id,
                    dr.question,
                    c.name as category_name,
                    s.name as sub_category_name,
                    vr.name as validation_rule,
                    ft.name as form_type,
                    dr.date,
                    dr.category_id,
                    dr.sub_category_id,
                    dr.validation_rule_id,
                    dr.form_type_id,
                    dr.form_type_value,
                    dr.question_tag,
                    dr.question_unit,
                    dr.delete_status,
                    vr.constant_value,
                    qt.name as question_tag_name,
                    qu.name as question_unit_name
                FROM daily_record_questions dr
                INNER JOIN categories c ON c.id = dr.category_id AND c.deleted_at IS NULL
                LEFT JOIN subcategories s ON s.id = dr.sub_category_id AND s.deleted_at IS NULL
                LEFT JOIN validation_rules vr ON vr.id = dr.validation_rule_id AND vr.deleted_at IS NULL
                LEFT JOIN form_type ft ON ft.id = dr.form_type_id AND ft.deleted_at IS NULL
                LEFT JOIN question_tags qt ON qt.id = dr.question_tag AND qt.deleted_at IS NULL
                LEFT JOIN question_units qu ON qu.id = dr.question_unit AND qu.deleted_at IS NULL
                WHERE dr.delete_status != 1
            `
		let dailyQuestions = []
		dailyQuestions = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
		})) as unknown as DailyQuestionRawResult[]

		const resData = dailyQuestions.reduce<
			Record<string, Record<string, GroupedQuestion[]>>
		>((acc, row) => {
			const categoryName = row.category_name || ''
			const subCategoryName = row.sub_category_name || ''

			if (!acc[categoryName]) {
				acc[categoryName] = {}
			}
			if (!acc[categoryName][subCategoryName]) {
				acc[categoryName][subCategoryName] = []
			}

			acc[categoryName][subCategoryName].push({
				question: row.question,
				form_type: row?.form_type,
				validation_rule: row?.validation_rule,
				daily_record_question_id: row.daily_record_question_id,
				date: row.date,
				category_id: row.category_id,
				sub_category_id: row.sub_category_id,
				validation_rule_id: row.validation_rule_id,
				form_type_id: row.form_type_id,
				form_type_value: row.form_type_value,
				question_tag: row.question_tag_name || null,
				question_unit: row.question_unit_name || null,
				constant_value: row.constant_value,
				question_tag_id: row.question_tag,
				question_unit_id: row.question_unit,
				delete_status: row.delete_status,
			})

			return acc
		}, {})

		return { message: 'Success', data: resData }
	}

	static async listAllDailyRecordQuestions(): Promise<{
		message: string
		data: Record<string, Record<string, GroupedQuestionWithTags[]>>
	}> {
		const query = `
                SELECT 
                    dr.id as daily_record_question_id,
                    dr.question,
                    c.name as category_name,
                    s.name as sub_category_name,
                    vr.name as validation_rule,
                    ft.name as form_type,
                    dr.date,
                    dr.category_id,
                    dr.sub_category_id,
                    dr.validation_rule_id,
                    dr.form_type_id,
                    dr.form_type_value,
                    dr.question_tag,
                    dr.question_unit,
                    dr.delete_status,
                    vr.constant_value,
                    dr.hint,
                    qu.name as question_unit_name,
                COALESCE(
                   (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', sq.id, 'name', sq.name))
                    FROM (
                    SELECT qt.id, qt.name
                    FROM question_tags qt
                    INNER JOIN question_tag_mapping qtm ON qtm.question_tag_id = qt.id AND qtm.deleted_at IS NULL
                    WHERE qtm.question_id = dr.id AND qt.deleted_at IS NULL
                    ORDER BY qt.name ASC
                   ) AS sq
                ),
                JSON_ARRAY()
                ) AS question_tags_json
                FROM daily_record_questions dr
                INNER JOIN categories c ON c.id = dr.category_id AND c.deleted_at IS NULL
                LEFT JOIN subcategories s ON s.id = dr.sub_category_id AND s.deleted_at IS NULL
                LEFT JOIN validation_rules vr ON vr.id = dr.validation_rule_id AND vr.deleted_at IS NULL
                LEFT JOIN form_type ft ON ft.id = dr.form_type_id AND ft.deleted_at IS NULL
                LEFT JOIN question_units qu ON qu.id = dr.question_unit AND qu.deleted_at IS NULL
                LEFT JOIN question_tag_mapping qqt ON qqt.question_id = dr.id AND qqt.deleted_at IS NULL
                LEFT JOIN question_tags qt ON qt.id = qqt.question_tag_id AND qt.deleted_at IS NULL
                WHERE dr.delete_status != 1
                GROUP BY dr.id, c.name, s.name, vr.name, ft.name, dr.date, 
                         dr.category_id, dr.sub_category_id, dr.validation_rule_id,
                         dr.form_type_id, dr.form_type_value, dr.question_tag,
                         dr.question_unit, dr.delete_status, vr.constant_value,
                         dr.hint, qu.name, dr.question
            `

		const dailyQuestions = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
		})) as unknown as (DailyQuestionRawResult & {
			question_unit_name: string | null
			question_tags_json: {
				id: number
				name: string
			}[]
			hint: string
		})[]

		const resData = dailyQuestions.reduce<
			Record<string, Record<string, GroupedQuestionWithTags[]>>
		>((acc, row) => {
			const categoryName = row.category_name || ''
			const subCategoryName = row.sub_category_name || ''

			if (!acc[categoryName]) {
				acc[categoryName] = {}
			}
			if (!acc[categoryName][subCategoryName]) {
				acc[categoryName][subCategoryName] = []
			}

			// let questionTags: QuestionTag[] = []
			// if (row.question_tags_json) {
			// 	questionTags = row.question_tags_json
			// 		.filter(
			// 			(tag: { id: number; name: string }) =>
			// 				tag !== null && tag.id && tag.name,
			// 		)
			// 		.map((tag: { id: number; name: string }) => ({
			// 			question_tag_id: tag.id,
			// 			question_tag_name: tag.name,
			// 		}))
			// }

			const questionTags: QuestionTag[] =
				row.question_tags_json
					?.filter((tag) => tag?.id && tag?.name)
					.map((tag) => ({
						question_tag_id: tag.id,
						question_tag_name: tag.name,
					})) ?? []

			acc[categoryName][subCategoryName].push({
				question: row.question,
				form_type: row.form_type,
				validation_rule: row.validation_rule,
				daily_record_question_id: row.daily_record_question_id,
				date: row.date,
				category_id: row.category_id,
				sub_category_id: row.sub_category_id,
				validation_rule_id: row.validation_rule_id,
				form_type_id: row.form_type_id,
				form_type_value: row.form_type_value,
				question_unit: row.question_unit_name || null,
				constant_value: row.constant_value,
				question_unit_id: row.question_unit,
				delete_status: row.delete_status,
				question_tags: questionTags,
				hint: row.hint,
			})

			return acc
		}, {})

		return { message: 'Success', data: resData }
	}

	static async update(
		id: number,
		data: UpdateDailyRecordQuestionInput,
	): Promise<void> {
		const { DailyRecordQuestion, QuestionTagMapping } = db
		const question = await DailyRecordQuestion.findOne({
			where: { id, delete_status: 0 },
		})
		if (!question) throw new NotFoundError('Question not found')

		const uniqueQuestion = await DailyRecordQuestion.findOne({
			where: {
				question: data.question,
				delete_status: 0,
			},
		})

		if (uniqueQuestion && uniqueQuestion?.get('id') !== id)
			throw new ValidationRequestError({
				question: ['The question has already been taken.'],
			})
		const catergory = await db.Category.findOne({
			where: {
				id: data.category_id,
				deleted_at: null,
			},
		})
		if (!catergory)
			throw new ValidationRequestError({
				category_id: ['The selected category id is invalid.'],
			})

		if (data.sub_category_id) {
			const subCategory = await db.Subcategory.findOne({
				where: {
					id: data.sub_category_id,
					deleted_at: null,
				},
			})
			if (!subCategory)
				throw new ValidationRequestError({
					sub_category_id: ['The selected sub category id is invalid.'],
				})
		}

		const formType = await db.FormType.findOne({
			where: {
				id: data.form_type_id,
				deleted_at: null,
			},
		})
		if (!formType)
			throw new ValidationRequestError({
				form_type_id: ['The selected form type id is invalid.'],
			})

		const validationRule = await db.ValidationRule.findOne({
			where: {
				id: data.validation_rule_id,
				deleted_at: null,
			},
		})
		if (!validationRule)
			throw new ValidationRequestError({
				validation_rule_id: ['The selected validation rule id is invalid.'],
			})

		if (
			Array.isArray(data?.question_tag_id) &&
			data?.question_tag_id.length > 0
		) {
			const questionTags = await db.QuestionTag.findAll({
				where: { id: data.question_tag_id, deleted_at: null },
			})

			if (questionTags.length !== data.question_tag_id.length) {
				throw new ValidationRequestError({
					[`question_tag_id`]: [`The selected question tag id is invalid.`],
				})
			}
		}

		const questionUnit = await db.QuestionUnit.findOne({
			where: {
				id: data.question_unit_id,
				deleted_at: null,
			},
		})
		if (!questionUnit)
			throw new ValidationRequestError({
				question_unit_id: ['The selected question unit id is invalid.'],
			})

		question.category_id = data.category_id
		question.sub_category_id = data.sub_category_id ?? null
		question.question = data.question
		question.validation_rule_id = data.validation_rule_id
		question.form_type_id = data.form_type_id
		question.date = data.date
		question.form_type_value = data.form_type_value ?? null
		question.question_tag = data.question_tag_id[0]
		question.question_unit = data.question_unit_id
		question.hint = data.hint ?? null

		await QuestionTagMapping.destroy({ where: { question_id: id } })
		const tagData = data.question_tag_id.map((tagId) => ({
			question_id: id,
			question_tag_id: tagId,
			created_at: new Date(),
			updated_at: new Date(),
		}))
		await QuestionTagMapping.bulkCreate(tagData)
		await DailyRecordQuestion.update(question, { where: { id } })
	}

	static async delete(id: number): Promise<boolean> {
		const transaction = await db.sequelize.transaction()
		try {
			const question = await db.DailyRecordQuestion.findOne({
				where: { id, delete_status: 0 },
			})
			if (!question) return false

			await db.DailyRecordQuestion.update(
				{ delete_status: true },
				{ where: { id }, transaction },
			)
			await db.DailyRecordQuestionLanguage.destroy({
				where: { daily_record_question_id: id },
				transaction,
			})

			await db.QuestionTagMapping.destroy({
				where: { question_id: id },
				transaction,
			})
			await transaction.commit()
			return true
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}

	static async addDailyQuestionsInOtherLanguage(data: {
		daily_record_question_id: number
		language_id: number
		question: string
		form_type_value?: string | null
	}): Promise<{ message: string }> {
		const { DailyRecordQuestionLanguage, Language, DailyRecordQuestion } = db
		const language = await Language.findOne({
			where: { id: data.language_id, deleted_at: null },
		})
		if (!language) {
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid.'],
			})
		}
		const question = await DailyRecordQuestion.findOne({
			where: {
				id: data.daily_record_question_id,
				delete_status: 0,
			},
		})
		if (!question) {
			throw new ValidationRequestError({
				daily_record_question_id: [
					'The selected daily record question id is invalid.',
				],
			})
		}
		const exists = await DailyRecordQuestionLanguage.findOne({
			where: {
				daily_record_question_id: data.daily_record_question_id,
				language_id: data.language_id,
				deleted_at: null,
			},
		})
		if (exists) {
			throw new ValidationError(
				'This question is already added in this language',
			)
		}
		await DailyRecordQuestionLanguage.create({
			daily_record_question_id: data.daily_record_question_id,
			language_id: data.language_id,
			question: data.question,
		})
		return { message: 'Success' }
	}

	static async getDailyQuestionsInOtherLanguage(language_id: number): Promise<{
		message: string
		data: Record<string, Record<string, DailyQuestionInLanguage[]>> | []
	}> {
		const query = `
        SELECT 
            cl.category_language_name,
            scl.sub_category_language_name,
            dql.daily_record_question_id,
            dql.question,
            vr.name as validation_rule,
            ft.name as form_type,
            dq.question as master_question,
            dq.question_tag,
            dq.question_unit,
            dql.id as daily_record_questions_language_id,
            dq.delete_status,
            dql.created_at,
            c.sequence_number,
            dq.date,
            dq.form_type_value,
            dql.form_type_value as language_form_type_value,
            vr.constant_value,
            dql.hint,
            dq.hint as master_hint,
            qu.name as question_unit_name,
            qt.name as question_tag_name
        FROM daily_record_questions as dq
        INNER JOIN daily_record_question_language as dql ON dql.daily_record_question_id = dq.id AND dql.deleted_at IS NULL
        INNER JOIN category_language as cl ON cl.category_id = dq.category_id AND cl.language_id = ? AND cl.deleted_at IS NULL
        LEFT JOIN sub_category_language as scl ON scl.sub_category_id = dq.sub_category_id AND scl.language_id = ? AND scl.deleted_at IS NULL
        LEFT JOIN form_type as ft ON ft.id = dq.form_type_id AND ft.deleted_at IS NULL
        INNER JOIN validation_rules as vr ON vr.id = dq.validation_rule_id AND vr.deleted_at IS NULL
        INNER JOIN categories as c ON c.id = dq.category_id AND c.deleted_at IS NULL
        LEFT JOIN question_units as qu ON qu.id = dq.question_unit AND qu.deleted_at IS NULL
        LEFT JOIN question_tags as qt ON qt.id = dq.question_tag AND qt.deleted_at IS NULL
        WHERE dql.language_id = ? 
        AND dq.delete_status != 1
        ORDER BY c.sequence_number ASC, dql.created_at ASC
    `

		const questions = (await db.sequelize.query(query, {
			replacements: [language_id, language_id, language_id],
			type: QueryTypes.SELECT,
		})) as unknown as Array<{
			category_language_name: string | null
			sub_category_language_name: string | null
			daily_record_question_id: number
			question: string
			validation_rule: string
			form_type: string | null
			master_question: string
			question_tag: number | null
			question_unit: number | null
			daily_record_questions_language_id: number
			delete_status: number
			created_at: string
			sequence_number: number
			date: string
			form_type_value: string | null
			language_form_type_value: string | null
			constant_value: string | null
			hint: string | null
			master_hint: string | null
			question_unit_name: string | null
			question_tag_name: string | null
		}>

		if (questions?.length === 0) {
			return { message: 'Success', data: [] }
		}
		const resData: Record<
			string,
			Record<string, DailyQuestionInLanguage[]>
		> = {}

		// questions.forEach((value) => {
		for (const value of questions) {
			const categoryName = value.category_language_name || ''
			const subCategoryName = value.sub_category_language_name || ''

			if (!resData[categoryName]) {
				resData[categoryName] = {}
			}
			if (!resData[categoryName][subCategoryName]) {
				resData[categoryName][subCategoryName] = []
			}

			resData[categoryName][subCategoryName].push({
				daily_record_question_id: value.daily_record_question_id,
				master_question: value.master_question,
				question_in_other_language: value.question,
				validation_rule: value.validation_rule,
				form_type: value.form_type,
				date: value.date,
				form_type_value: value.form_type_value,
				language_form_type_value: value.language_form_type_value,
				question_tag: value.question_tag_name,
				question_unit: value.question_unit_name,
				constant_value: value.constant_value,
				daily_record_questions_language_id:
					value.daily_record_questions_language_id,
				delete_status: value.delete_status,
				language_hint: value.hint,
				master_hint: value.master_hint,
				created_at: value.created_at,
			})
		}
		// })

		return { message: 'Success', data: resData }
	}

	static async updateDailyRecordQuestionInOtherLanguage(
		id: number,
		data: {
			daily_record_question_id: number
			language_id: number
			question: string
			form_type_value?: string | null
			hint?: string | null
		},
	): Promise<{ success: boolean; code: number; message: string }> {
		const language = await db.Language.findOne({
			where: { id: data.language_id, deleted_at: null },
		})
		if (!language) {
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid.'],
			})
		}
		const question = await db.DailyRecordQuestion.findOne({
			where: {
				id: data.daily_record_question_id,
				delete_status: 0,
			},
		})
		if (!question) {
			throw new ValidationRequestError({
				daily_record_question_id: [
					'The selected daily record question id is invalid.',
				],
			})
		}

		const exists = await db.DailyRecordQuestionLanguage.findOne({
			where: {
				daily_record_question_id: data.daily_record_question_id,
				language_id: data.language_id,
				deleted_at: null,
			},
		})
		if (exists && exists.get('id') !== id) {
			throw new ValidationError(
				'This question is already added in this language',
			)
		}

		const dailyLanguageQuestion = await db.DailyRecordQuestionLanguage.findOne({
			where: { id, deleted_at: null },
		})
		if (!dailyLanguageQuestion) {
			throw new ValidationRequestError({
				id: ['The selected id is invalid.'],
			})
		}

		const questionDetails = {
			daily_record_question_id: data.daily_record_question_id,
			language_id: data.language_id,
			question: data.question,
			form_type_value: data.form_type_value ?? null,
			hint: data.hint ?? null,
		}
		await db.DailyRecordQuestionLanguage.update(questionDetails, {
			where: { id },
		})

		return { success: true, code: 200, message: 'Updated successfully.' }
	}

	private static buildQuestionData(
		data: CreateDailyRecordQuestionsInput,
		value: QuestionInput,
	): DailyRecordQuestionAttributes {
		return {
			category_id: data.category_id,
			sub_category_id: data.sub_category_id ?? null,
			question: value.question,
			form_type_id: value.form_type_id,
			validation_rule_id: value.validation_rule_id,
			date: value.date ?? false,
			form_type_value: value.form_type_value ?? null,
			question_tag: value.question_tag[0],
			question_unit: value.question_unit,
			hint: value.hint ?? null,
			sequence_number: value.sequence_number ?? 0,
			delete_status: false,
		}
	}

	private static async createTagMappings(
		savedQuestions: Model<DailyRecordQuestionAttributes>[],
		questions: QuestionInput[],
	): Promise<void> {
		const tagMappings = savedQuestions.flatMap((q, i) =>
			questions[i].question_tag.map((tagId) => ({
				question_id: q.get('id') as number,
				question_tag_id: tagId,
			})),
		)
		await db.QuestionTagMapping.bulkCreate(tagMappings)
	}

	private static async createLanguageMappings(
		savedQuestions: Model<DailyRecordQuestionAttributes>[],
		data: CreateDailyRecordQuestionsInput,
	): Promise<void> {
		const languageMappings = savedQuestions.map((q, i) => ({
			daily_record_question_id: q.get('id') as number,
			language_id: data.language_id,
			question: data.questions[i].question,
			form_type_value: data.questions[i].form_type_value ?? null,
			hint: data.questions[i].hint ?? null,
		}))
		await db.DailyRecordQuestionLanguage.bulkCreate(languageMappings)
	}
}
