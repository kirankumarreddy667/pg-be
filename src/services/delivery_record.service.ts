import db from '@/config/database'
import { Op, QueryTypes } from 'sequelize'

interface QuestionLanguage {
	question: string
	form_type_value?: string | null
	hint?: string | null
}

interface ValidationRule {
	name?: string | null
	constant_value?: string | null
}

interface CategoryLanguage {
	category_language_name?: string | null
}

interface SubCategoryLanguage {
	sub_category_language_name?: string | null
}

interface QuestionUnit {
	id?: number | null
	name?: string | null
}

interface QuestionTag {
	id?: number | null
	name?: string | null
}

interface FormType {
	name?: string | null
}

interface CommonQuestion {
	id: number
	question: string
	date?: string | null
	form_type_value?: string | null
	ValidationRule?: ValidationRule
	CategoryLanguage?: CategoryLanguage
	SubCategoryLanguage?: SubCategoryLanguage
	QuestionLanguages?: QuestionLanguage[]
	QuestionUnit?: QuestionUnit
	QuestionTag?: QuestionTag
	FormType?: FormType
	Answers?: AnimalQuestionAnswer[]
}

interface AnimalQuestionAnswer {
	answer?: string | null
	created_at?: Date | null
}


interface DeliveryRecordAnswer {
	question_id: number
	category_id: number
	category_language_name: string
	answer: string
	question_tag: number
	created_at: string
	animal_number: string
}

interface DeliveryRecordGrouped {
	type_of_delivery_answer?: string
	delivery_date_answer?: string
	calf_number?: string
}

interface ApiResponse {
	status: number
	message: string
	data: [] | Record<string, unknown>
	errors?: Record<string, string[]>
}
type ResponseData = Record<string, Record<string, object[]>>
export class DeliveryRecordService {
	static async saveRecordDeliveryOfAnimal(
		data: {
			animal_number?: string
			date?: Date
			answers: { question_id: number; answer: string }[]
			animal_id: number
		},
		userId: number,
	): Promise<ApiResponse> {
		const animal = await db.Animal.findOne({
			where: { id: data.animal_id, deleted_at: null },
		})
		if (!animal) {
			return {
				status: 422,
				message: 'The given data was invalid.',
				data: [],
				errors: {
					animal_id: ['The selected animal id is invalid.'],
				},
			}
		}
		const animal_number = data.animal_number ?? ''
		const date = data.date ?? new Date()
		const answers = data.answers.map((value) => ({
			question_id: value.question_id,
			answer: value.answer,
			user_id: userId,
			animal_id: data.animal_id,
			created_at: date,
			animal_number,
			logic_value: null,
			status: false,
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answers)
		return { data: [], message: 'Success', status: 200 }
	}
	static async updateRecordDeliveryOfAnimal(
		animal_number: string,
		data: {
			answers: { question_id: number; answer: string }[]
			animal_id: number
		},
		userId: number,
	): Promise<ApiResponse> {
		const animal = await db.Animal.findOne({
			where: { id: data.animal_id, deleted_at: null },
		})
		if (!animal) {
			return {
				status: 422,
				message: 'The given data was invalid.',
				data: [],
				errors: {
					animal_id: ['The selected animal id is invalid.'],
				},
			}
		}

		for (const ans of data.answers) {
			const qExists = await db.CommonQuestions.findOne({
				where: { id: ans.question_id, deleted_at: null },
			})
			if (!qExists) {
				return {
					status: 422,
					message: 'The given data was invalid.',
					data: [],
					errors: {
						question_id: ['The selected question id is invalid.'],
					},
				}
			}
		}

		for (const ans of data.answers) {
			const qExists = await db.CommonQuestions.findOne({
				where: { id: ans.question_id, deleted_at: null },
			})
			if (!qExists) {
				return {
					status: 422,
					message: 'The given data was invalid.',
					data: [],
					errors: {
						question_id: ['The selected question id is invalid.'],
					},
				}
			}
		}

		let date_of_delivery = ''
		const now = new Date()
		const answers = data.answers.map((value) => {
			if (value.question_id === 53) {
				date_of_delivery = value.answer
			}
			return {
				question_id: value.question_id,
				answer: value.answer,
				user_id: userId,
				animal_id: data.animal_id,
				created_at: now,
				updated_at: now,
				animal_number,
				logic_value: null,
				status: false,
			}
		})
		answers.push(
			{
				question_id: 9,
				answer: 'Yes',
				user_id: userId,
				animal_id: data.animal_id,
				created_at: now,
				updated_at: now,
				animal_number,
				logic_value: null,
				status: false,
			},
			{
				question_id: 8,
				answer: 'No',
				user_id: userId,
				animal_id: data.animal_id,
				created_at: now,
				updated_at: now,
				animal_number,
				logic_value: null,
				status: false,
			},
		)
		await db.AnimalQuestionAnswer.bulkCreate(answers)
		// Insert lactation yield
		await db.AnimalLactationYieldHistory.create({
			user_id: userId,
			animal_id: data.animal_id,
			animal_number,
			date: date_of_delivery ? new Date(date_of_delivery) : now,
			pregnancy_status: 'No',
			lactating_status: 'Yes',
			created_at: now,
		})
		return { data: [], message: 'Success', status: 200 }
	}

	static async userAnimalQuestionAnswerRecordDelivery(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_number?: string,
	): Promise<ResponseData> {
		const questionModels = await db.CommonQuestions.findAll({
			where: { category_id: 100 },
			include: [
				{
					model: db.QuestionLanguage,
					as: 'QuestionLanguage',
					where: { language_id, deleted_at: null },
					required: false,
				},
				{
					model: db.FormType,
					as: 'FormType',
					where: { deleted_at: null },
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.ValidationRule,
					as: 'ValidationRule',
					where: { deleted_at: null },
					attributes: ['id', 'name', 'constant_value'],
					required: false,
				},
				{
					model: db.CategoryLanguage,
					as: 'CategoryLanguage',
					where: { language_id, category_id: 100, deleted_at: null },
					attributes: ['category_language_name'],
					required: false,
				},
				{
					model: db.SubCategoryLanguage,
					as: 'SubCategoryLanguage',
					where: { language_id, deleted_at: null },
					attributes: ['sub_category_language_name'],
					required: false,
				},
				{
					model: db.QuestionUnit,
					as: 'QuestionUnit',
					where: { deleted_at: null },
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.QuestionTag,
					as: 'QuestionTag',
					where: { deleted_at: null },
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.AnimalQuestionAnswer,
					as: 'Answers',
					where: {
						user_id,
						animal_id,
						animal_number,
						status: { [Op.ne]: 1 },
						deleted_at: null,
					},
					required: false,
				},
			],
			order: [['id', 'ASC']],
		})

		const questions = questionModels.map((q) => {
			const plain = q.get({ plain: true }) as unknown
			return plain as CommonQuestion
		})

		const resData: ResponseData = {}
		const categoryName = 'Details Info'
		const subCategoryName = ''

		resData[categoryName] = { [subCategoryName]: [] }

		for (const cq of questions) {
			const qLang = cq.QuestionLanguages?.[0]
			const answerObj = cq.Answers?.[0]

			resData[categoryName][subCategoryName].push({
				animal_id,
				validation_rule: cq.ValidationRule?.name ?? 'TYPE_CLASS_TEXT',
				master_question: cq.question ?? 'No Question',
				language_question: qLang?.question ?? cq.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? 'Text',
				date: cq.date ?? 0,
				answer: answerObj?.answer ?? null,
				form_type_value: cq.form_type_value ?? qLang?.form_type_value ?? null,
				language_form_type_value:
					qLang?.form_type_value ?? cq.form_type_value ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? 1,
				question_tag: cq.QuestionTag?.id ?? 0,
				question_unit: cq.QuestionUnit?.id ?? 0,
				answer_date: answerObj?.created_at ?? null,
				animal_number: animal_number ?? null,
				hint: qLang?.hint ?? null,
			})
		}

		return resData
	}

	static async userAllAnimalQuestionAnswersOfRecordDelivery(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_number: string,
	): Promise<
		DeliveryRecordGrouped[] | Record<string, DeliveryRecordGrouped[]>
	> {
		// 1. Fetch answers for question_tag 65,66 and category_id=100
		const answers = await db.sequelize.query<DeliveryRecordAnswer>(
			`SELECT aqa.question_id, cq.category_id, cl.category_language_name, aqa.answer, cq.question_tag, aqa.created_at, aqa.animal_number
			FROM common_questions cq
			JOIN question_language ql ON cq.id = ql.question_id
			LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id
				AND aqa.user_id = :user_id
				AND aqa.animal_id = :animal_id
				AND aqa.animal_number = :animal_number
				AND aqa.deleted_at IS NULL
			JOIN category_language cl ON cl.category_id = cq.category_id 
			    AND cl.language_id = :language_id 
			    AND cl.category_id = 100 
			    AND cl.deleted_at IS NULL
			WHERE ql.language_id = :language_id
				AND ql.deleted_at IS NULL
				AND aqa.animal_id = :animal_id
				AND cq.question_tag IN (65,66)
				AND cq.deleted_at IS NULL
			ORDER BY aqa.created_at DESC`,
			{
				replacements: { user_id, animal_id, animal_number, language_id },
				type: QueryTypes.SELECT,
			},
		)

		// 2. Fetch delivery dates
		const calfRows = (await db.AnimalMotherCalf.findAll({
			where: { user_id, animal_id, deleted_at: null },
			attributes: ['delivery_date', 'calf_animal_number'],
			raw: true,
		})) as { delivery_date: Date | string; calf_animal_number: string }[]

		const deliveryDates: Record<string, string> = {}
		for (const row of calfRows) {
			const dateStr =
				typeof row.delivery_date === 'string'
					? row.delivery_date
					: row.delivery_date.toISOString().slice(0, 10)
			deliveryDates[dateStr] = row.calf_animal_number
		}

		// 3. Group answers by created_at
		const recordDelivery: Record<string, DeliveryRecordGrouped> = {}
		let category_language_name = ''
		for (const value of answers) {
			if (value.question_tag === 65) {
				recordDelivery[value.created_at] =
					recordDelivery[value.created_at] || {}
				recordDelivery[value.created_at].type_of_delivery_answer = value.answer
			} else if (value.question_tag === 66) {
				recordDelivery[value.created_at] =
					recordDelivery[value.created_at] || {}
				recordDelivery[value.created_at].delivery_date_answer = value.answer
			}
			category_language_name = value.category_language_name
		}

		// 4. Attach calf_number if delivery_date matches
		const attachedCalfWithDates: DeliveryRecordGrouped[] = Object.values(
			recordDelivery,
		).map((item) => {
			if (
				item.delivery_date_answer &&
				deliveryDates[item.delivery_date_answer]
			) {
				item.calf_number = deliveryDates[item.delivery_date_answer]
				delete deliveryDates[item.delivery_date_answer]
			}
			return item
		})

		// 5. Return empty array if no records
		if (attachedCalfWithDates.length === 0) return []

		// 6. Otherwise, return grouped object
		const key = category_language_name
			? category_language_name.toLowerCase().replaceAll(' ', '_')
			: 'unknown'

		return { [key]: attachedCalfWithDates }
	}

	static async animalLactationYieldCount(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ pregnancy_detection_count: number; delivery_count: number }> {
		// Pregnancy detection count (question_tag=69, answer yes)
		const pregnancyDetectionCntArr = await db.sequelize.query<{
			count: number
		}>(
			`SELECT COUNT(*) as count
			FROM animal_question_answers aqa
			JOIN common_questions cq ON cq.id = aqa.question_id
			WHERE cq.question_tag = 69
			AND cq.deleted_at IS NULL
			AND aqa.user_id = :user_id
			AND aqa.animal_id = :animal_id
			AND aqa.animal_number = :animal_number
			AND aqa.status <> 1
			AND aqa.deleted_at IS NULL
			AND LOWER(aqa.answer) = 'yes'`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)
		const pregnancyDetectionCnt = pregnancyDetectionCntArr[0]?.count ?? 0
		// Delivery count (question_tag=66)
		const deliveryCntArr = await db.sequelize.query<{ count: number }>(
			`SELECT COUNT(*) as count
			FROM animal_question_answers aqa
			JOIN common_questions cq ON cq.id = aqa.question_id
			WHERE cq.question_tag = 66
			AND cq.deleted_at IS NULL
			AND aqa.user_id = :user_id
			AND aqa.animal_id = :animal_id
			AND aqa.animal_number = :animal_number
			AND aqa.status <> 1
			AND aqa.deleted_at IS NULL`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)
		const deliveryCnt = deliveryCntArr[0]?.count ?? 0
		return {
			pregnancy_detection_count: Number(pregnancyDetectionCnt),
			delivery_count: Number(deliveryCnt),
		}
	}
}
