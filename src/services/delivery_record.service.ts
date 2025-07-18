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
	name?: string | null
}

interface QuestionTag {
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
}

interface AnimalQuestionAnswer {
	answer?: string | null
	created_at?: Date | null
}

interface AnimalQuestionWithAssociations {
	animal_id: number
	CommonQuestion?: CommonQuestion
	Answers?: AnimalQuestionAnswer[]
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

export class DeliveryRecordService {
	static async saveRecordDeliveryOfAnimal(
		data: {
			animal_number?: string
			date?: Date
			answers: { question_id: number; answer: string }[]
			animal_id: number
		},
		userId: number,
	): Promise<{ status: number; message: string; data: [] }> {
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
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answers)
		return { status: 201, message: 'Success', data: [] }
	}

	static async updateRecordDeliveryOfAnimal(
		animal_number: string,
		data: {
			answers: { question_id: number; answer: string }[]
			animal_id: number
		},
		userId: number,
	): Promise<{ status: number; message: string; data: [] }> {
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
			}
		})
		// Add milking state
		answers.push({
			question_id: 9,
			answer: 'Yes',
			user_id: userId,
			animal_id: data.animal_id,
			created_at: now,
			updated_at: now,
			animal_number,
			logic_value: null,
		})
		// Add pregnancy state
		answers.push({
			question_id: 8,
			answer: 'No',
			user_id: userId,
			animal_id: data.animal_id,
			created_at: now,
			updated_at: now,
			animal_number,
			logic_value: null,
		})
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
		return { status: 201, message: 'Success', data: [] }
	}

	static async userAnimalQuestionAnswerRecordDelivery(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_number: string,
	): Promise<Record<string, Record<string, object[]>>> {
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 100 },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.created_at
		const questions = (await db.AnimalQuestions.findAll({
			where: { animal_id: Number(animal_id) },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 100 },
					include: [
						{
							model: db.QuestionLanguage,
							as: 'QuestionLanguages',
							where: { language_id: Number(language_id) },
							required: true,
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
							model: db.CategoryLanguage,
							as: 'CategoryLanguage',
							where: { language_id: Number(language_id), category_id: 100 },
							attributes: ['category_language_name'],
							required: true,
						},
						{
							model: db.SubCategoryLanguage,
							as: 'SubCategoryLanguage',
							where: { language_id: Number(language_id) },
							attributes: ['sub_category_language_name'],
							required: false,
						},
						{
							model: db.QuestionUnit,
							as: 'QuestionUnit',
							attributes: ['id', 'name'],
							required: false,
						},
						{
							model: db.QuestionTag,
							as: 'QuestionTag',
							attributes: ['id', 'name'],
							required: false,
						},
					],
				},
				{
					model: db.AnimalQuestionAnswer,
					as: 'Answers',
					where: {
						user_id,
						animal_id: Number(animal_id),
						animal_number,
						status: { [Op.ne]: 1 },
						...(answerDate ? { created_at: answerDate } : {}),
					},
					required: false,
				},
			],
		})) as AnimalQuestionWithAssociations[]
		const resData: Record<string, Record<string, object[]>> = {}
		for (const aq of questions) {
			const cq = aq.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const answerObj = aq.Answers?.[0]
			const answer = answerObj?.answer ?? null
			const answer_date = answerObj?.created_at ?? null
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			const subCategoryName =
				cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []
			resData[categoryName][subCategoryName].push({
				animal_id: aq.animal_id,
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql?.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				answer,
				form_type_value: cq.form_type_value ?? null,
				language_form_type_value: ql?.form_type_value ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? null,
				question_tag: cq.QuestionTag?.name ?? null,
				question_unit: cq.QuestionUnit?.name ?? null,
				answer_date,
				animal_number,
				hint: ql?.hint ?? null,
			})
		}
		return resData
	}

	static async userAllAnimalQuestionAnswersOfRecordDelivery(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_number: string,
	): Promise<Record<string, DeliveryRecordGrouped[]>> {
		// 1. Fetch answers for question_tag 65,66 and category_id=100
		const answers = await db.sequelize.query<DeliveryRecordAnswer>(
			`SELECT aqa.question_id, cq.category_id, cl.category_language_name, aqa.answer, cq.question_tag, aqa.created_at, aqa.animal_number
     FROM common_questions cq
     JOIN question_language ql ON cq.id = ql.question_id
     LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id
       AND aqa.user_id = :user_id
       AND aqa.animal_id = :animal_id
       AND aqa.animal_number = :animal_number
     JOIN category_language cl ON cl.category_id = cq.category_id AND cl.language_id = :language_id AND cl.category_id = 100
     WHERE ql.language_id = :language_id
       AND aqa.animal_id = :animal_id
       AND cq.question_tag IN (65,66)
     ORDER BY aqa.created_at DESC`,
			{
				replacements: { user_id, animal_id, animal_number, language_id },
				type: QueryTypes.SELECT,
			},
		)

		// 2. Fetch delivery dates from animal_mother_calfs
		const calfRows = (await db.AnimalMotherCalf.findAll({
			where: { user_id, animal_id },
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

		// 5. Group by category_language_name
		const key = category_language_name
			? category_language_name.toLowerCase().replace(/ /g, '_')
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
       AND aqa.user_id = :user_id
       AND aqa.animal_id = :animal_id
       AND aqa.animal_number = :animal_number
       AND aqa.status <> 1
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
       AND aqa.user_id = :user_id
       AND aqa.animal_id = :animal_id
       AND aqa.animal_number = :animal_number
       AND aqa.status <> 1`,
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
