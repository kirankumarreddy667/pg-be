import db from '@/config/database'
import { NotFoundError, ValidationRequestError } from '@/utils/errors'
import { QueryTypes, Transaction } from 'sequelize'

interface QuestionLanguage {
	question_language_id: number
	language_id: number
	question: string
	hint?: string | null
	language_form_type_value?: string | null
	date: boolean
	question_id: number
	master_question: string
	category_id: number
	sub_category_id: number | null
	category_language_name: string
	sub_category_language_name?: string | null
	form_type: string | null
	form_type_value: string | null
	validation_rule: string | null
	validation_rule_id: number | null
	master_hint: string | null
}


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

interface QuestionRow {
	category_id: number
	category_name?: string | null
	sub_category_id: number | null
	sub_category_name?: string | null
	qiestion_id: number
	question: string
	form_type: string | null
	validation_rule: string | null
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
}

type NestedResult = Record<string, Record<string, QuestionRow[]>>

export class CommonQuestionService {
	// static async create(data: {
	// 	category_id: number
	// 	sub_category_id?: number | null
	// 	language_id: number
	// 	questions: Array<{
	// 		question: string
	// 		form_type_id: number
	// 		validation_rule_id: number
	// 		date: boolean
	// 		form_type_value?: string | null
	// 		question_tag: number
	// 		question_unit: number
	// 		hint?: string | null
	// 	}>
	// }): Promise<{ message: string; data: [] }> {
	// 	const t: Transaction = await db.sequelize.transaction()
	// 	try {
	// 		const catergory = await db.Category.findOne({
	// 			where: {
	// 				id: data.category_id,
	// 				deleted_at: null,
	// 			},
	// 			transaction: t,
	// 		})
	// 		if (!catergory)
	// 			throw new ValidationRequestError({
	// 				category_id: ['The selected category id is invalid.'],
	// 			})

	// 		if (data.sub_category_id) {
	// 			const subCategory = await db.Subcategory.findOne({
	// 				where: {
	// 					id: data.sub_category_id,
	// 					deleted_at: null,
	// 				},
	// 				transaction: t,
	// 			})
	// 			if (!subCategory)
	// 				throw new ValidationRequestError({
	// 					sub_category_id: ['The selected sub category id is invalid.'],
	// 				})
	// 		}

	// 		const language = await db.Language.findOne({
	// 			where: {
	// 				id: data.language_id,
	// 				deleted_at: null,
	// 			},
	// 			transaction: t,
	// 		})
	// 		if (!language)
	// 			throw new ValidationRequestError({
	// 				language_id: ['The selected language id is invalid.'],
	// 			})
	// 		for (const value of data.questions) {
	// 			const question = await db.CommonQuestions.findOne({
	// 				where: {
	// 					question: value.question,
	// 					deleted_at: null,
	// 				},
	// 				transaction: t,
	// 			})
	// 			if (question)
	// 				throw new ValidationRequestError({
	// 					[`questions.${data.questions.indexOf(value)}.question`]: [
	// 						`questions.${data.questions.indexOf(value)}.question has already been taken.`,
	// 					],
	// 				})

	// 			const formType = await db.FormType.findOne({
	// 				where: {
	// 					id: value.form_type_id,
	// 					deleted_at: null,
	// 				},
	// 				transaction: t,
	// 			})
	// 			if (!formType)
	// 				throw new ValidationRequestError({
	// 					[`questions.${data.questions.indexOf(value)}.form_type_id`]: [
	// 						`The selected questions.${data.questions.indexOf(value)}.form_type_id is invalid.`,
	// 					],
	// 				})

	// 			const validationRule = await db.ValidationRule.findOne({
	// 				where: {
	// 					id: value.validation_rule_id,
	// 					deleted_at: null,
	// 				},
	// 				transaction: t,
	// 			})
	// 			if (!validationRule)
	// 				throw new ValidationRequestError({
	// 					[`questions.${data.questions.indexOf(value)}.validation_rule_id`]: [
	// 						`The selected questions.${data.questions.indexOf(value)}.validation_rule_id is invalid.`,
	// 					],
	// 				})

	// 			const questionTag = await db.QuestionTag.findOne({
	// 				where: {
	// 					id: value.question_tag,
	// 					deleted_at: null,
	// 				},
	// 				transaction: t,
	// 			})
	// 			if (!questionTag)
	// 				throw new ValidationRequestError({
	// 					[`questions.${data.questions.indexOf(value)}.question_tag`]: [
	// 						`The selected questions.${data.questions.indexOf(value)}.question_tag is invalid.`,
	// 					],
	// 				})

	// 			const questionUnit = await db.QuestionUnit.findOne({
	// 				where: {
	// 					id: value.question_unit,
	// 					deleted_at: null,
	// 				},
	// 				transaction: t,
	// 			})
	// 			if (!questionUnit)
	// 				throw new ValidationRequestError({
	// 					[`questions.${data.questions.indexOf(value)}.question_unit`]: [
	// 						`The selected questions.${data.questions.indexOf(value)}.question_unit is invalid.`,
	// 					],
	// 				})
	// 			const questionData = {
	// 				category_id: data.category_id,
	// 				sub_category_id: data.sub_category_id ?? null,
	// 				question: value.question,
	// 				form_type_id: value.form_type_id,
	// 				validation_rule_id: value.validation_rule_id,
	// 				date: value.date,
	// 				form_type_value: value.form_type_value ?? null,
	// 				question_tag: value.question_tag,
	// 				question_unit: value.question_unit,
	// 				hint: value.hint ?? null,
	// 				sequence_number: 0,
	// 			}
	// 			const saveQuestion = await db.CommonQuestions.create(questionData, {
	// 				transaction: t,
	// 			})
	// 			const languageQuestion = {
	// 				question_id: saveQuestion.id,
	// 				language_id: data.language_id,
	// 				question: value.question,
	// 				form_type_value: value.form_type_value ?? null,
	// 				hint: value.hint ?? null,
	// 			}
	// 			await db.QuestionLanguage.create(languageQuestion, { transaction: t })
	// 		}
	// 		await t.commit()
	// 		return { message: 'Questions added successfully', data: [] }
	// 	} catch (error) {
	// 		await t.rollback()
	// 		throw error
	// 	}
	// }

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
        const catergory = await db.Category.findOne({
            where: {
                id: data.category_id,
                deleted_at: null,
            },
            transaction: t,
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
                transaction: t,
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
            transaction: t,
        })
        if (!language)
            throw new ValidationRequestError({
                language_id: ['The selected language id is invalid.'],
            })

        await this.processQuestions(data, t)
        await t.commit()
        return { message: 'Questions added successfully', data: [] }
    } catch (error) {
        await t.rollback()
        throw error
    }
}

private static async processQuestions(data: {
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
}, t: Transaction): Promise<void> {
    for (const [index, value] of data.questions.entries()) {
        const question = await db.CommonQuestions.findOne({
            where: {
                question: value.question,
                deleted_at: null,
            },
            transaction: t,
        })
        if (question)
            throw new ValidationRequestError({
                [`questions.${index}.question`]: [
                    `questions.${index}.question has already been taken.`,
                ],
            })

        const [formType, validationRule, questionTag, questionUnit] = await Promise.all([
            db.FormType.findOne({
                where: { id: value.form_type_id, deleted_at: null },
                transaction: t,
            }),
            db.ValidationRule.findOne({
                where: { id: value.validation_rule_id, deleted_at: null },
                transaction: t,
            }),
            db.QuestionTag.findOne({
                where: { id: value.question_tag, deleted_at: null },
                transaction: t,
            }),
            db.QuestionUnit.findOne({
                where: { id: value.question_unit, deleted_at: null },
                transaction: t,
            })
        ])

        if (!formType)
            throw new ValidationRequestError({
                [`questions.${index}.form_type_id`]: [
                    `The selected questions.${index}.form_type_id is invalid.`,
                ],
            })

        if (!validationRule)
            throw new ValidationRequestError({
                [`questions.${index}.validation_rule_id`]: [
                    `The selected questions.${index}.validation_rule_id is invalid.`,
                ],
            })

        if (!questionTag)
            throw new ValidationRequestError({
                [`questions.${index}.question_tag`]: [
                    `The selected questions.${index}.question_tag is invalid.`,
                ],
            })

        if (!questionUnit)
            throw new ValidationRequestError({
                [`questions.${index}.question_unit`]: [
                    `The selected questions.${index}.question_unit is invalid.`,
                ],
            })

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
			question_tag_id: number
			question_unit_id: number
			hint?: string | null
		},
	): Promise<{ message: string; data: [] }> {
		const t: Transaction = await db.sequelize.transaction()

		try {
			const question = await db.CommonQuestions.findOne({
				where: { id, deleted_at: null },
				transaction: t,
			})
			if (!question) {
				throw new NotFoundError('Question not found')
			}

			const uniqueQuestion = await db.CommonQuestions.findOne({
				where: {
					question: data.question,
					deleted_at: null,
				},
				transaction: t,
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
				transaction: t,
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
					transaction: t,
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
				transaction: t,
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
				transaction: t,
			})
			if (!validationRule)
				throw new ValidationRequestError({
					validation_rule_id: ['The selected validation rule id is invalid.'],
				})

			const questionTag = await db.QuestionTag.findOne({
				where: {
					id: data.question_tag_id,
					deleted_at: null,
				},
				transaction: t,
			})
			if (!questionTag)
				throw new ValidationRequestError({
					question_tag_id: ['The selected question tag id is invalid.'],
				})

			const questionUnit = await db.QuestionUnit.findOne({
				where: {
					id: data.question_unit_id,
					deleted_at: null,
				},
				transaction: t,
			})
			if (!questionUnit)
				throw new ValidationRequestError({
					question_unit_id: ['The selected question unit id is invalid.'],
				})

			await question.update(
				{
					category_id: data.category_id,
					sub_category_id: data.sub_category_id ?? null,
					question: data.question,
					form_type_id: data.form_type_id,
					validation_rule_id: data.validation_rule_id,
					date: data.date,
					form_type_value: data.form_type_value ?? null,
					question_tag: data.question_tag_id,
					question_unit: data.question_unit_id,
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
			where: { id, deleted_at: null },
			include: [
				{
					model: db.Category,
					as: 'Category',
					attributes: [['name', 'category_name']],
					where: { deleted_at: null },
				},
				{
					model: db.Subcategory,
					as: 'Subcategory',
					where: { deleted_at: null },
					attributes: [['name', 'sub_category_name']],
					required: false,
				},
				{
					model: db.ValidationRule,
					as: 'ValidationRule',
					attributes: [['name', 'validation_rule']],
					where: { deleted_at: null },
				},
				{
					model: db.FormType,
					as: 'FormType',
					attributes: [['name', 'form_type']],
					required: false,
					where: { deleted_at: null },
				},
			],
			attributes: [['id', 'question_id'], 'question', 'date'],
			raw: true,
			nest: true,
		})) as {
			Category: { category_name: string } | null
			Subcategory: { sub_category_name: string } | null
			ValidationRule: { validation_rule: string } | null
			FormType: { form_type: string } | null
			question_id: number
			question: string
			date: boolean
		} | null
		if (!result) return null

		return {
			category_name: result?.Category?.category_name || null,
			sub_category_name: result?.Subcategory?.sub_category_name || null,
			validation_rule: result?.ValidationRule?.validation_rule || null,
			question: result.question,
			form_type: result?.FormType?.form_type || null,
			question_id: result.question_id,
			date: result.date,
		}
	}

	static async listAll(): Promise<{ message: string; data: NestedResult }> {
		const sql = `
			SELECT 
				c.id AS category_id,
				c.name AS category_name,
				s.id AS sub_category_id,
				s.name AS sub_category_name,
				cq.id AS qiestion_id,
				cq.question,
				ft.id AS form_type_id,
				ft.name AS form_type,
				vr.id AS validation_rule_id,
				vr.name AS validation_rule,
				cq.date,
				cq.form_type_value,
				vr.constant_value,
				qt.id AS question_tag_id,
				qt.name AS question_tag,
				qu.id AS question_unit_id,
				qu.name AS question_unit,
				cq.hint
			FROM common_questions cq
			JOIN categories c ON c.id = cq.category_id AND c.deleted_at IS NULL
			LEFT JOIN subcategories s ON s.id = cq.sub_category_id AND s.deleted_at IS NULL
			LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
			JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
			LEFT JOIN question_tags qt ON qt.id = cq.question_tag AND qt.deleted_at IS NULL
			LEFT JOIN question_units qu ON qu.id = cq.question_unit AND qu.deleted_at IS NULL
			WHERE cq.deleted_at IS NULL
		`

		const rows = await db.sequelize.query<QuestionRow>(sql, {
			type: QueryTypes.SELECT,
		})

		const resData: NestedResult = {}

		for (const row of rows) {
			const categoryKey = row.category_name ?? ''
			const subCategoryKey = row.sub_category_name ?? ''

			if (!resData[categoryKey]) {
				resData[categoryKey] = {}
			}
			if (!resData[categoryKey][subCategoryKey]) {
				resData[categoryKey][subCategoryKey] = []
			}

			resData[categoryKey][subCategoryKey].push({
				category_id: row.category_id,
				sub_category_id: row.sub_category_id,
				qiestion_id: row.qiestion_id,
				question: row.question,
				form_type: row.form_type,
				validation_rule: row.validation_rule,
				form_type_id: row.form_type_id,
				validation_rule_id: row.validation_rule_id,
				date: row.date,
				form_type_value: row.form_type_value,
				constant_value: row.constant_value,
				question_tag: row.question_tag ?? null,
				question_unit: row.question_unit ?? null,
				question_tag_id: row.question_tag_id ?? null,
				question_unit_id: row.question_unit_id ?? null,
				hint: row.hint,
			})
		}

		return { message: 'Success', data: resData }
	}

	static async addQuestionsInOtherLanguage(data: {
		question_id: number
		language_id: number
		question: string
		form_type_value?: string | null
		hint?: string | null
	}): Promise<{ success: boolean; message: string; data?: []; errors?: [] }> {
		const question = await db.CommonQuestions.findOne({
			where: { id: data.question_id, deleted_at: null },
		})
		if (!question) {
			throw new ValidationRequestError({
				question_id: ['The selected question id is invalid'],
			})
		}

		const language = await db.Language.findOne({
			where: { id: data.language_id, deleted_at: null },
		})
		if (!language) {
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid'],
			})
		}
		const exists = await db.QuestionLanguage.findOne({
			where: {
				question_id: data.question_id,
				language_id: data.language_id,
				deleted_at: null,
			},
		})
		if (exists) {
			return {
				success: false,
				message: 'This question is already added in this language',
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
	): Promise<{ message: string; data: []; success: boolean }> {
		const record = await db.QuestionLanguage.findOne({
			where: { id, deleted_at: null },
		})
		if (!record) throw new NotFoundError('Question language record not found')

		const question = await db.CommonQuestions.findOne({
			where: { id: data.question_id, deleted_at: null },
		})
		if (!question) {
			throw new ValidationRequestError({
				question_id: ['The selected question id is invalid'],
			})
		}

		const language = await db.Language.findOne({
			where: { id: data.language_id, deleted_at: null },
		})
		if (!language) {
			throw new ValidationRequestError({
				language_id: ['The selected language id is invalid'],
			})
		}
		const exists = await db.QuestionLanguage.findOne({
			where: {
				question_id: data.question_id,
				language_id: data.language_id,
				deleted_at: null,
			},
		})
		if (exists) {
			return {
				message: 'This question is already added in this language',
				data: [],
				success: false,
			}
		}

		await db.QuestionLanguage.update(
			{
				question_id: data.question_id,
				language_id: data.language_id,
				question: data.question,
				form_type_value: data.form_type_value ?? null,
				hint: data.hint ?? null,
			},
			{
				where: {
					id,
				},
			},
		)
		return { message: 'Updated successfully.', data: [], success: true }
	}

	static async getAllQuestionsInDifferentLanguages(
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, GroupedQuestion[]>> | []
	}> {
		const questions = (await db.sequelize.query(
			`
        SELECT 
            ql.question,
            cq.category_id,
            cq.sub_category_id,
            cq.validation_rule_id,
            cl.category_language_name,
            scl.sub_category_language_name,
            cq.form_type_id,
            cq.date,
            cq.question AS master_question,
            vr.name AS validation_rule,
            ft.name AS form_type,
            cq.form_type_value,
            ql.id AS question_language_id,
            ql.form_type_value AS language_form_type_value,
            cq.id AS question_id,
            ql.hint,
            cq.hint AS master_hint
        FROM common_questions cq
        INNER JOIN question_language ql
            ON cq.id = ql.question_id
        LEFT JOIN form_type ft
            ON ft.id = cq.form_type_id
            AND ft.deleted_at IS NULL
        INNER JOIN validation_rules vr
            ON vr.id = cq.validation_rule_id
			AND vr.deleted_at IS NULL
        INNER JOIN category_language cl
            ON cl.category_id = cq.category_id
            AND cl.language_id = :language_id
            AND cl.deleted_at IS NULL
        LEFT JOIN sub_category_language scl
            ON scl.sub_category_id = cq.sub_category_id
            AND scl.language_id = :language_id
            AND scl.deleted_at IS NULL
        WHERE ql.language_id = :language_id 
		AND ql.deleted_at IS NULL 
		AND cq.deleted_at IS NULL
        `,
			{
				replacements: { language_id },
				type: QueryTypes.SELECT,
			},
		)) as unknown as QuestionLanguage[]

		if (!questions || questions.length === 0) {
			return { message: 'success', data: [] }
		}

		const resData = questions.reduce<
			Record<string, Record<string, GroupedQuestion[]>>
		>((acc, q) => {
			const categoryName = q.category_language_name || ''
			const subCategoryName = q.sub_category_language_name || ''

			if (!acc[categoryName]) acc[categoryName] = {}
			if (!acc[categoryName][subCategoryName])
				acc[categoryName][subCategoryName] = []

			acc[categoryName][subCategoryName].push({
				validation_rule: q.validation_rule,
				master_question: q.master_question,
				language_question: q.question,
				question_id: q.question_id,
				form_type: q.form_type,
				date: q.date,
				form_type_value: q.form_type_value ?? null,
				question_language_id: q.question_language_id,
				category_id: q.category_id,
				sub_category_id: q.sub_category_id,
				validation_rule_id: q.validation_rule_id,
				language_form_type_value: q.language_form_type_value ?? null,
				language_hint: q.hint ?? null,
				master_hint: q.master_hint,
			})

			return acc
		}, {})

		return { message: 'success', data: resData }
	}
}
