import db from '@/config/database'
import { Op, QueryTypes, Transaction } from 'sequelize'
import { AppError, ValidationRequestError } from '@/utils/errors'

type ConstantValue = string | number | null
type answer = string | number | null
type question_tag = string | number | null
type question_unit = string | number | null

export interface GroupedAnimalQuestionAnswer {
	animal_id: number
	validation_rule: string | null
	master_question: string
	language_question: string | null
	question_id: number
	form_type: string | null
	date: boolean
	answer: answer
	form_type_value: string | null
	language_form_type_value: string | null
	constant_value: ConstantValue
	question_tag: question_tag
	question_unit: question_unit
	answer_date: Date | null
	animal_number: string
	hint?: string | null
	question_created_at?: Date
}

export interface AnimalNumberResult {
	animal_id: number
	animal_name: string
	animal_number: string
}

type GestationRecord = {
	user_id: number
	animal_id: number
	animal_number: string
	created_at: Date
	pregnancy_status?: string | number
	lactating_status?: string | number
	date?: string | number | Date
}

interface AnimalAnswerInput {
	question_id: number
	answer: string | number
}

interface NotificationRecord {
	user_id: number
	message: string
	type: string
	heading: string
	send_notification_date: Date
	animal_id: number
	animal_number: string
	created_at: Date
	doctor_message?: string | null
	doctor_num?: string | null
	farm_name?: string | null
}

interface NotificationLanguageRecord {
	user_id: number
	language_id: number
	langauge_message: string
	heading: string
	send_notification_date: Date
	status: number
	days_before: number
	animal_id: number
	animal_number: string
	created_at: Date
}

const ANIMAL_TYPES = {
	cow: ['cow', 'गाय', 'ఆవు'],
	calf: ['calf', 'कालवड', 'बछड़ा', 'దూడ', 'रेडी'],
	buffalo: ['buffalo', 'म्हैस', 'भैंस', 'గేదె'],
}

const NOTIFICATION_LANGUAGES = {
	ENGLISH: 2,
	HINDI: 1,
	MARATHI: 19,
}

const PREGNANCY_MONTHS = {
	DETECTION: 3,
	DRYING_BUFFALO: 8,
	DRYING_COW: 6,
	DELIVERY_BUFFALO: 10,
	DELIVERY_COW: 9,
}

const NOTIFICATION_TEMPLATES = {
	pregnancy_detection: {
		en: (date: string, num: string) =>
			`Pregnancy detection due on ${date} Animal No: ${num}`,
		hi: (date: string, num: string) =>
			`गर्भवती पुष्टि टेस्ट अपेक्षित दिन ${date} जानवर नं :${num}`,
		mr: (date: string, num: string) =>
			`गाभण खात्री चाचणी अपेक्षित दिवस ${date} जनावर क्र:${num}`,
	},
	pregnancy_update: {
		en: (num: string) => `Update pregnancy status for Animal ${num}`,
		hi: (date: string, num: string) =>
			`दिन ${date} जानवर नं :${num} के लिए गर्भवती स्थिति अपडेट करे `,
		mr: (num: string) => `जनावर क्र ${num} साठी गाभण स्थिती अद्ययावत करा `,
	},
	drying_off: {
		en: (num: string, date: string) =>
			`Drying off is due for Animal ${num} Date ${date}`,
		hi: (date: string, num: string) =>
			`सुखाना अपेक्षित दिन ${date} जानवर नं :${num}`,
		mr: (num: string, date: string) => `जनावर क्र ${num} आटवणे अपेक्षित${date}`,
	},
	delivery: {
		en: (num: string, date: string) =>
			`Delivery is due for Animal ${num} Date ${date}`,
		hi: (date: string, num: string) =>
			`प्रसूती अपेक्षित दिन ${date} जानवर नं :${num}`,
		mr: (date: string, num: string) =>
			`प्रसूती अपेक्षित दिवस ${date} जनावर क्र: ${num}`,
	},
}

const NOTIFICATION_HEADINGS = {
	pregnancy_detection: {
		en: 'Pregnency detection test',
		hi: 'गर्भाधान पुष्टि',
		mr: 'गाभण खात्री टेस्ट',
	},
	pregnancy_update: {
		en: 'Update pregnency status',
		hi: 'गर्भवती स्थिति अपडेट करे ',
		mr: 'गाभण स्थिती अपडेट करा ',
	},
	drying_off: {
		en: 'Drying off the animal',
		hi: 'जानवर सुखाना',
		mr: 'जनावर आटवणे',
	},
	delivery: {
		en: 'Delivery due',
		hi: 'डिलीवरी अपेक्षित ',
		mr: 'विणारी जनावर ',
	},
}

export class AnimalQuestionAnswerService {
	private static getLogicValue(ans: string): string | null {
		if (['cow', 'गाय', 'ఆవు'].includes(ans)) return 'cow'
		if (['calf', 'कालवड', 'बछड़ा', 'దూడ', 'रेडी'].includes(ans)) return 'calf'
		if (['buffalo', 'म्हैस', 'भैंस', 'గేదె'].includes(ans)) return 'buffalo'
		return null
	}

	private static assignGestationProps(
		gestation: GestationRecord,
		value: AnimalAnswerInput,
		answerDate: Date,
	): Date {
		if (value.question_id === 8) gestation.pregnancy_status = value.answer
		if (value.question_id === 9) gestation.lactating_status = value.answer
		if (value.question_id === 10) {
			gestation.date = new Date(value.answer)
			return new Date(value.answer)
		}
		return answerDate
	}

	static async create(
		data: {
			animal_id: number
			animal_number: string
			answers: AnimalAnswerInput[]
			date: string
		},
		user_id: number,
		transaction: Transaction,
	): Promise<void> {
		const animal = await db.Animal.findOne({
			where: { id: data.animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})
		for (const answer of data.answers) {
			const question = await db.CommonQuestions.findOne({
				where: { id: answer.question_id, deleted_at: null },
			})
			if (!question)
				throw new ValidationRequestError({
					[`answers.${data.answers.indexOf(answer)}.question_id`]: [
						`The selected answers.${data.answers.indexOf(answer)}.question_id is invalid.`,
					],
				})
		}
		const exists = await db.AnimalQuestionAnswer.findOne({
			where: {
				user_id,
				animal_id: data.animal_id,
				animal_number: data.animal_number,
				status: { [Op.ne]: 1 },
			},
		})
		if (exists) {
			throw new AppError('This animal number is already taken', 409)
		}
		const gestation: GestationRecord = {
			user_id,
			animal_id: data.animal_id,
			animal_number: data.animal_number,
			created_at: new Date(),
		}
		const answerRecords: {
			question_id: number
			answer: string
			user_id: number
			animal_id: number
			created_at: Date
			animal_number: string
			logic_value: string | null
		}[] = []
		let answerDate = data.date ? new Date(data.date) : new Date()
		for (const value of data.answers) {
			if (!value.question_id || value.answer === undefined) continue
			const ans = String(value.answer).toLowerCase()
			const logicValue = this.getLogicValue(ans)
			answerRecords.push({
				question_id: value.question_id,
				answer: String(value.answer),
				user_id,
				animal_id: data.animal_id,
				created_at: data.date ? new Date(data.date) : new Date(),
				animal_number: data.animal_number,
				logic_value: logicValue,
			})
			answerDate = this.assignGestationProps(gestation, value, answerDate)
		}
		if (!gestation.date) gestation.date = answerDate
		const answerRecordsWithStatus = answerRecords.map((record) => ({
			...record,
			status: false,
		}))

		await db.AnimalQuestionAnswer.bulkCreate(answerRecordsWithStatus, {
			transaction,
		})
		await db.AnimalLactationYieldHistory.create(
			{
				...gestation,
				date:
					gestation.date instanceof Date
						? gestation.date
						: new Date(gestation.date ?? answerDate),
				pregnancy_status:
					gestation.pregnancy_status == null
						? null
						: String(gestation.pregnancy_status),
				lactating_status:
					gestation.lactating_status == null
						? null
						: String(gestation.lactating_status),
			},
			{ transaction },
		)
	}

	static async userAnimalQuestionAnswer({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.get('created_at') ?? null
		const query = `
		SELECT 
			aq.question_id,
			ql.question,
			cq.category_id,
			cq.sub_category_id,
			cq.validation_rule_id,
			cl.category_language_name,
			scl.sub_category_language_name,
			cq.form_type_id,
			cq.date,
			cq.question as master_question,
			aq.animal_id,
			vr.name as validation_rule,
			ft.name as form_type,
			aqa.answer,
			cq.form_type_value,
			ql.form_type_value as language_form_type_value,
			vr.constant_value,
			cq.question_tag,
			aqa.created_at,
			cq.question_unit,
			aqa.animal_number
		FROM common_questions cq
		INNER JOIN animal_questions aq ON cq.id = aq.question_id AND aq.deleted_at IS NULL
		INNER JOIN question_language ql ON cq.id = ql.question_id AND ql.deleted_at IS NULL
		LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id 
			AND aqa.user_id = ? 
			AND aqa.animal_id = ? 
			AND aqa.animal_number = ?
			AND (? IS NULL OR DATE(aqa.created_at) = DATE(?))
			AND aqa.deleted_at IS NULL
		LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
		INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
		INNER JOIN category_language cl ON cl.category_id = cq.category_id 
			AND cl.language_id = ?
			AND cl.deleted_at IS NULL
		LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id 
			AND scl.language_id = ?
			AND scl.deleted_at IS NULL
		WHERE ql.language_id = ?
			AND aq.animal_id = ?
			AND cq.deleted_at IS NULL
	`

		const questions = (await db.sequelize.query(query, {
			replacements: [
				user_id,
				animal_id,
				animal_number,
				answerDate,
				answerDate,
				language_id,
				language_id,
				language_id,
				animal_id,
			],
			type: QueryTypes.SELECT,
		})) as unknown as {
			question_id: number
			question: string
			category_id: number
			sub_category_id: number
			validation_rule_id: number
			category_language_name: string
			sub_category_language_name: string
			form_type_id: number
			date: boolean
			master_question: string
			animal_id: number
			validation_rule: string
			form_type: string
			answer: string
			form_type_value: string
			language_form_type_value: string
			constant_value: string
			question_tag: string
			created_at: Date
			question_unit: string
			animal_number: string
		}[]

		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}

		for (const question of questions) {
			const answer = question.answer ?? null
			const answer_date = question.created_at ?? null
			const categoryName = question.category_language_name || ''
			const subCategoryName = question.sub_category_language_name || ''

			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []

			resData[categoryName][subCategoryName].push({
				animal_id: question.animal_id,
				validation_rule: question.validation_rule ?? null,
				master_question: question.master_question,
				language_question: question.question ?? null,
				question_id: question.question_id,
				form_type: question.form_type ?? null,
				date: question.date,
				answer,
				form_type_value: question.form_type_value ?? null,
				language_form_type_value: question.language_form_type_value ?? null,
				constant_value: question.constant_value ?? null,
				question_tag: question.question_tag ?? null,
				question_unit: question.question_unit ?? null,
				answer_date,
				animal_number: question.animal_number,
			})
		}

		return resData
	}

	static async userAnimalQuestionAnswerBasicDetails({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { category_id: 1, deleted_at: null },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.get('created_at') ?? null

		const languageQuestions = (await db.sequelize.query(
			`
            SELECT 
            aq.question_id,
            ql.question,
            cq.category_id,
            cq.sub_category_id,
            cq.validation_rule_id,
            cl.category_language_name,
            scl.sub_category_language_name,
            ql.hint as language_hint,
            cq.form_type_id,
            cq.date,
            cq.question as master_question,
            aq.animal_id,
            vr.name as validation_rule,
            ft.name as form_type,
            aqa.answer,
            cq.form_type_value,
            ql.form_type_value as language_form_type_value,
            vr.constant_value,
            cq.question_tag,
            aqa.created_at as answer_created_at,
            cq.question_unit,
            aqa.animal_number,
            cq.created_at,
            qu.name as question_unit_name,
            qt.name as question_tag_name
            FROM common_questions cq
            JOIN animal_questions aq ON cq.id = aq.question_id AND aq.deleted_at IS NULL
            JOIN question_language ql ON cq.id = ql.question_id AND ql.deleted_at IS NULL
            LEFT JOIN animal_question_answers aqa ON (
            cq.id = aqa.question_id 
               AND aqa.user_id = :user_id
               AND aqa.animal_id = :animal_id
               AND aqa.animal_number = :animal_number
               AND aqa.status != 1
			   AND aqa.deleted_at IS NULL
               AND (:answer_date IS NULL OR aqa.created_at = :answer_date)
            )
            LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
            JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
            JOIN category_language cl ON (
            cl.category_id = cq.category_id 
               AND cl.language_id = :language_id 
               AND cl.category_id = 1
			   AND cl.deleted_at IS NULL
            )
            LEFT JOIN sub_category_language scl ON (
               scl.sub_category_id = cq.sub_category_id 
               AND scl.language_id = :language_id
			   AND scl.deleted_at IS NULL
            )
            LEFT JOIN question_units qu ON qu.id = cq.question_unit AND qu.deleted_at IS NULL
            LEFT JOIN question_tags qt ON qt.id = cq.question_tag AND qt.deleted_at IS NULL
            WHERE ql.language_id = :language_id
               AND aq.animal_id = :animal_id
               AND cq.category_id = 1
			   AND cq.deleted_at IS NULL
               ORDER BY cq.created_at ASC
            `,
			{
				replacements: {
					user_id,
					animal_id: Number(animal_id),
					animal_number,
					answer_date: answerDate || null,
					language_id: Number(language_id),
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			question_id: number
			question: string
			category_id: number
			sub_category_id: number
			validation_rule_id: number
			category_language_name: string
			sub_category_language_name: string
			language_hint: string
			form_type_id: number
			date: boolean
			master_question: string
			animal_id: number
			validation_rule: string
			form_type: string
			answer: string
			form_type_value: string
			language_form_type_value: string
			constant_value: string
			question_tag: number
			answer_created_at: Date
			question_unit: number
			question_unit_name: string
			question_tag_name: string
			created_at: Date
			animal_number: string
		}[]

		if (!languageQuestions) return []

		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}
		for (const row of languageQuestions) {
			const categoryName = row.category_language_name || ''
			const subCategoryName = row.sub_category_language_name || ''

			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []

			resData[categoryName][subCategoryName].push({
				animal_id: row.animal_id,
				validation_rule: row.validation_rule ?? null,
				master_question: row.master_question,
				language_question: row.question ?? null,
				question_id: row.question_id,
				form_type: row.form_type ?? null,
				date: row.date,
				answer: row.answer ?? null,
				form_type_value: row.form_type_value ?? null,
				language_form_type_value: row.language_form_type_value ?? null,
				constant_value: row.constant_value ?? null,
				question_tag: row.question_tag ?? null,
				question_unit: row.question_unit ?? null,
				answer_date: row.created_at ?? null,
				animal_number: row.animal_number,
				hint: row.language_hint ?? null,
				question_created_at: row.created_at,
			})
		}
		return resData
	}

	private static async userAnimalQuestionAnswerByCategory(
		params: {
			user_id: number
			animal_id: number
			language_id: number
			animal_number: string
		},
		category_id: number,
	): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		const { user_id, animal_id, language_id, animal_number } = params
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { category_id, deleted_at: null },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.get('created_at') ?? null
		const languageQuestions = (await db.sequelize.query(
			`
            SELECT 
            aq.question_id,
            ql.question,
            cq.category_id,
            cq.sub_category_id,
            cq.validation_rule_id,
            cl.category_language_name,
            scl.sub_category_language_name,
            ql.hint as language_hint,
            cq.form_type_id,
            cq.date,
            cq.question as master_question,
            aq.animal_id,
            vr.name as validation_rule,
            ft.name as form_type,
            aqa.answer,
            cq.form_type_value,
            ql.form_type_value as language_form_type_value,
            vr.constant_value,
            cq.question_tag,
            aqa.created_at as answer_created_at,
            cq.question_unit,
            aqa.animal_number,
            cq.created_at,
            qu.name as question_unit_name,
            qt.name as question_tag_name
            FROM common_questions cq
            JOIN animal_questions aq ON cq.id = aq.question_id AND aq.deleted_at IS NULL
            JOIN question_language ql ON cq.id = ql.question_id AND ql.deleted_at IS NULL
            LEFT JOIN animal_question_answers aqa ON (
            cq.id = aqa.question_id 
               AND aqa.user_id = :user_id
               AND aqa.animal_id = :animal_id
               AND aqa.animal_number = :animal_number
               AND aqa.status != 1
			   AND aqa.deleted_at IS NULL
               AND (:answer_date IS NULL OR aqa.created_at = :answer_date)
            )
            LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
            JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
            JOIN category_language cl ON (
            cl.category_id = cq.category_id 
               AND cl.language_id = :language_id 
               AND cl.category_id = :category_id
			   AND cl.deleted_at IS NULL
            )
            LEFT JOIN sub_category_language scl ON (
               scl.sub_category_id = cq.sub_category_id 
               AND scl.language_id = :language_id
			   AND scl.deleted_at IS NULL
            )
            LEFT JOIN question_units qu ON qu.id = cq.question_unit AND qu.deleted_at IS NULL
            LEFT JOIN question_tags qt ON qt.id = cq.question_tag AND qt.deleted_at IS NULL
            WHERE ql.language_id = :language_id
               AND aq.animal_id = :animal_id
               AND cq.category_id = :category_id
			   AND cq.deleted_at IS NULL
               ORDER BY cq.created_at ASC
            `,
			{
				replacements: {
					user_id,
					animal_id: Number(animal_id),
					animal_number,
					answer_date: answerDate || null,
					language_id: Number(language_id),
					category_id: Number(category_id),
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			question_id: number
			question: string
			category_id: number
			sub_category_id: number
			validation_rule_id: number
			category_language_name: string
			sub_category_language_name: string
			language_hint: string
			form_type_id: number
			date: boolean
			master_question: string
			animal_id: number
			validation_rule: string
			form_type: string
			answer: string
			form_type_value: string
			language_form_type_value: string
			constant_value: string
			question_tag: number
			answer_created_at: Date
			question_unit: number
			question_unit_name: string
			question_tag_name: string
			created_at: Date
			animal_number: string
		}[]

		if (!languageQuestions) return []

		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}
		for (const row of languageQuestions) {
			const categoryName = row.category_language_name || ''
			const subCategoryName = row.sub_category_language_name || ''

			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []

			resData[categoryName][subCategoryName].push({
				animal_id: row.animal_id,
				validation_rule: row.validation_rule ?? null,
				master_question: row.master_question,
				language_question: row.question ?? null,
				question_id: row.question_id,
				form_type: row.form_type ?? null,
				date: row.date,
				answer: row.answer ?? null,
				form_type_value: row.form_type_value ?? null,
				language_form_type_value: row.language_form_type_value ?? null,
				constant_value: row.constant_value ?? null,
				question_tag: row.question_tag ?? null,
				question_unit: row.question_unit ?? null,
				answer_date: row.answer_created_at ?? null,
				animal_number: row.animal_number,
				hint: row.language_hint ?? null,
			})
		}
		return resData
	}

	static async userAnimalQuestionAnswerBreedingDetails({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		return this.userAnimalQuestionAnswerByCategory(
			{ user_id, animal_id, language_id, animal_number },
			2,
		)
	}

	static async userAnimalQuestionAnswerMilkDetails({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		return this.userAnimalQuestionAnswerByCategory(
			{ user_id, animal_id, language_id, animal_number },
			3,
		)
	}

	static async userAnimalQuestionAnswerBirthDetails({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		return this.userAnimalQuestionAnswerByCategory(
			{ user_id, animal_id, language_id, animal_number },
			4,
		)
	}

	static async userAnimalQuestionAnswerHealthDetails({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		return this.userAnimalQuestionAnswerByCategory(
			{ user_id, animal_id, language_id, animal_number },
			5,
		)
	}

	static async userAnimalNumbersFromQuestionAnswer({
		user_id,
		animalNumber,
	}: {
		user_id: number
		animalNumber?: string
	}): Promise<AnimalNumberResult[]> {
		const qry =
			typeof animalNumber === 'string' ? animalNumber.toLowerCase() : null

		let query = `
        WITH latest_answers AS (
            SELECT aqa.animal_number,
                   aqa.animal_id,
                   ROW_NUMBER() OVER (PARTITION BY aqa.animal_number ORDER BY aqa.created_at DESC) as rn
            FROM animal_question_answers aqa
            WHERE aqa.user_id = ?
            AND aqa.status != 1
			AND aqa.deleted_at IS NULL
    `

		const replacements: unknown[] = [user_id]

		if (qry !== null || qry !== undefined) {
			query += ` AND LOWER(aqa.animal_number) LIKE ?`
			replacements.push(`%${qry}%`)
		}

		query += `
        )
        SELECT la.animal_number,
               la.animal_id,
               a.name as animal_name
        FROM latest_answers la
        JOIN animals a ON a.id = la.animal_id AND a.deleted_at IS NULL
        WHERE la.rn = 1
        ORDER BY la.animal_number
    `

		const results = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements,
		})) as unknown as Array<{
			animal_number: string
			animal_id: number
			animal_name: string
		}>

		return results.map((row) => ({
			animal_id: row.animal_id,
			animal_name: row.animal_name,
			animal_number: row.animal_number,
		}))
	}

	private static getAnimalLogicValue(answer: string | number): string | null {
		const answerStr = String(answer).toLowerCase()

		for (const [type, values] of Object.entries(ANIMAL_TYPES)) {
			if (values.some((val) => val === answerStr || val === answer)) {
				return type
			}
		}
		return null
	}

	private static formatDate(date: Date, format: string): string {
		if (format === 'd M Y') {
			const months = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			]
			const day = date.getDate().toString().padStart(2, '0')
			const month = months[date.getMonth()]
			const year = date.getFullYear()
			return `${day} ${month} ${year}`
		}
		return date.toISOString().slice(0, 10)
	}

	private static calculatePregnancyDates(
		aiDate: Date,
		animalId: number,
	): {
		detection: Date
		drying: Date
		delivery: Date
		detectionFormatted: string
		dryingFormatted: string
		deliveryFormatted: string
	} {
		const detection = new Date(aiDate)
		detection.setMonth(detection.getMonth() + PREGNANCY_MONTHS.DETECTION)

		const drying = new Date(aiDate)
		const dryingMonths =
			animalId === 2
				? PREGNANCY_MONTHS.DRYING_BUFFALO
				: PREGNANCY_MONTHS.DRYING_COW
		drying.setMonth(drying.getMonth() + dryingMonths)

		const delivery = new Date(aiDate)
		const deliveryMonths =
			animalId === 2
				? PREGNANCY_MONTHS.DELIVERY_BUFFALO
				: PREGNANCY_MONTHS.DELIVERY_COW
		delivery.setMonth(delivery.getMonth() + deliveryMonths)

		return {
			detection,
			drying,
			delivery,
			detectionFormatted: this.formatDate(detection, 'd M Y'),
			dryingFormatted:
				animalId === 2
					? this.formatDate(drying, 'd M Y')
					: this.formatDate(drying, 'Y-m-d'),
			deliveryFormatted: this.formatDate(delivery, 'd M Y'),
		}
	}

	

	private static createMultilingualNotifications(
		userId: number,
		animalId: number,
		animalNumber: string,
		dates: {
			detection: Date
			drying: Date
			delivery: Date
			detectionFormatted: string
			dryingFormatted: string
			deliveryFormatted: string
		},
		docNum: string | null,
		farmName: string | null,
	): {
		notifications: NotificationRecord[]
		languages: NotificationLanguageRecord[]
	} {
		const now = new Date()
		const {
			detection,
			drying,
			delivery,
			detectionFormatted,
			dryingFormatted,
			deliveryFormatted,
		} = dates

		// ----------- Main notifications -----------
		const notifications: NotificationRecord[] = [
			{
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				message: NOTIFICATION_TEMPLATES.pregnancy_detection.en(
					detectionFormatted,
					animalNumber,
				),
				heading: NOTIFICATION_HEADINGS.pregnancy_detection.en,
				send_notification_date: detection,
				type: 'Animal',
				doctor_num: docNum,
				doctor_message: `Pregnancy Detection due on ${detectionFormatted} Farm name: ${farmName} Animal No: ${animalNumber}`,
				created_at: now,
			},
			{
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				message: NOTIFICATION_TEMPLATES.pregnancy_update.en(animalNumber),
				heading: NOTIFICATION_HEADINGS.pregnancy_update.en,
				send_notification_date: detection,
				type: 'Animal',
				doctor_num: docNum,
				doctor_message: null,
				created_at: now,
			},
			{
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				message: NOTIFICATION_TEMPLATES.drying_off.en(
					animalNumber,
					dryingFormatted,
				),
				heading: NOTIFICATION_HEADINGS.drying_off.en,
				send_notification_date: drying,
				type: 'Animal',
				doctor_num: docNum,
				doctor_message: null,
				created_at: now,
			},
			{
				user_id: userId,
				animal_id: animalId,
				animal_number: animalNumber,
				message: NOTIFICATION_TEMPLATES.delivery.en(
					animalNumber,
					deliveryFormatted,
				),
				heading: NOTIFICATION_HEADINGS.delivery.en,
				send_notification_date: delivery,
				type: 'Animal',
				doctor_num: docNum,
				doctor_message: null,
				created_at: now,
			},
		]

		// ----------- Multilingual notifications -----------
		const languages: NotificationLanguageRecord[] = []

		const notificationTypes = [
			{
				type: 'pregnancy_detection',
				date: detection,
				dateStr: detectionFormatted,
			},
			{
				type: 'pregnancy_update',
				date: detection,
				dateStr: detectionFormatted,
			},
			{ type: 'drying_off', date: drying, dateStr: dryingFormatted },
			{ type: 'delivery', date: delivery, dateStr: deliveryFormatted },
		]

		for (const { type, date, dateStr } of notificationTypes) {
			for (const daysBefore of [7, 2, 0]) {
				// Extract messages for each language
				let messageEn: string
				let messageHi: string
				let messageMr: string

				switch (type) {
					case 'pregnancy_detection':
						messageEn = NOTIFICATION_TEMPLATES.pregnancy_detection.en(
							dateStr,
							animalNumber,
						)
						messageHi = NOTIFICATION_TEMPLATES.pregnancy_detection.hi(
							dateStr,
							animalNumber,
						)
						messageMr = NOTIFICATION_TEMPLATES.pregnancy_detection.mr(
							dateStr,
							animalNumber,
						)
						break
					case 'pregnancy_update':
						messageEn = NOTIFICATION_TEMPLATES.pregnancy_update.en(animalNumber)
						messageHi = NOTIFICATION_TEMPLATES.pregnancy_update.hi(
							dateStr,
							animalNumber,
						)
						messageMr = NOTIFICATION_TEMPLATES.pregnancy_update.mr(animalNumber)
						break
					case 'drying_off':
						messageEn = NOTIFICATION_TEMPLATES.drying_off.en(
							animalNumber,
							dateStr,
						)
						messageHi = NOTIFICATION_TEMPLATES.drying_off.hi(
							dateStr,
							animalNumber,
						)
						messageMr = NOTIFICATION_TEMPLATES.drying_off.mr(
							animalNumber,
							dateStr,
						)
						break
					case 'delivery':
						messageEn = NOTIFICATION_TEMPLATES.delivery.en(
							animalNumber,
							dateStr,
						)
						messageHi = NOTIFICATION_TEMPLATES.delivery.hi(
							dateStr,
							animalNumber,
						)
						messageMr = NOTIFICATION_TEMPLATES.delivery.mr(
							dateStr,
							animalNumber,
						)
						break
					default:
						messageEn = messageHi = messageMr = ''
				}

				const languageEntries: NotificationLanguageRecord[] = [
					{
						user_id: userId,
						langauge_message: messageEn,
						heading:
							NOTIFICATION_HEADINGS[type as keyof typeof NOTIFICATION_HEADINGS]
								.en,
						language_id: NOTIFICATION_LANGUAGES.ENGLISH,
						animal_id: animalId,
						animal_number: animalNumber,
						send_notification_date: date,
						status: 0,
						days_before: daysBefore,
						created_at: now,
					},
					{
						user_id: userId,
						langauge_message: messageHi,
						heading:
							NOTIFICATION_HEADINGS[type as keyof typeof NOTIFICATION_HEADINGS]
								.hi,
						language_id: NOTIFICATION_LANGUAGES.HINDI,
						animal_id: animalId,
						animal_number: animalNumber,
						send_notification_date: date,
						status: 0,
						days_before: daysBefore,
						created_at: now,
					},
					{
						user_id: userId,
						langauge_message: messageMr,
						heading:
							NOTIFICATION_HEADINGS[type as keyof typeof NOTIFICATION_HEADINGS]
								.mr,
						language_id: NOTIFICATION_LANGUAGES.MARATHI,
						animal_id: animalId,
						animal_number: animalNumber,
						send_notification_date: date,
						status: 0,
						days_before: daysBefore,
						created_at: now,
					},
				]

				languages.push(...languageEntries)
			}
		}

		return { notifications, languages }
	}

	private static async cleanupExistingData(
		userId: number,
		animalNumber: string,
		animalId: number,
		categoryId: number,
		currentDate: string,
	): Promise<boolean> {
		const existingData = await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_number: animalNumber,
				user_id: userId,
				animal_id: animalId,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { category_id: categoryId, deleted_at: null },
				},
			],
		})

		const todaysData = existingData.filter((a) => {
			const createdAt = a.get('created_at')
			if (!createdAt) return false

			const dateStr = String(createdAt)
			return dateStr.slice(0, 10) === currentDate
		})

		if (todaysData.length > 0) {
			const toDeleteIds = todaysData.map((a) => a.get('id'))
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
			return true
		}

		return existingData.length > 0
	}

	private static async cleanupNotifications(
		userId: number,
		animalNumber: string,
		animalId: number,
	): Promise<void> {
		await Promise.all([
			db.Notification.destroy({
				where: {
					user_id: userId,
					animal_number: animalNumber,
					animal_id: animalId,
				},
			}),
			db.NotificationLanguage.destroy({
				where: {
					user_id: userId,
					animal_number: animalNumber,
					animal_id: animalId,
				},
			}),
		])
	}

	// Main functions
	static async updateAnimalBasicQuestionAnswers({
		user_id,
		animal_number,
		animal_id,
		answers,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
	}): Promise<void> {
		await this.updateSimpleAnimalQuestions({
			user_id,
			animal_number,
			animal_id,
			answers,
			date: new Date().toISOString(),
			categoryId: 1,
		})
	}

	static async updateAnimalBreedingQuestionAnswers({
		user_id,
		animal_number,
		animal_id,
		answers,
		date,
		farm_name,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
		date: string
		farm_name: string | null
	}): Promise<void> {
		const [doctorQuestion, aiQuestion] = await Promise.all([
			db.CommonQuestions.findOne({
				where: {
					id: { [Op.in]: answers.map((a) => a.question_id) },
					question_tag: 58,
					deleted_at: null,
				},
			}),
			db.CommonQuestions.findOne({
				where: {
					id: { [Op.in]: answers.map((a) => a.question_id) },
					question_tag: 23,
					deleted_at: null,
				},
			}),
		])

		const docNum = doctorQuestion
			? String(
					answers.find((a) => a.question_id === doctorQuestion.get('id'))
						?.answer,
				)
			: null
		const aiAnswer = aiQuestion
			? answers.find((a) => a.question_id === aiQuestion.get('id'))?.answer
			: null

		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: new Date(date),
			animal_number,
			status: false,
		}))

		const currentDate = date.slice(0, 10)
		const hasExistingData = await this.cleanupExistingData(
			user_id,
			animal_number,
			animal_id,
			2,
			currentDate,
		)

		// Create notifications only if AI date exists
		let notifications: NotificationRecord[] = []
		let languages: NotificationLanguageRecord[] = []

		if (aiAnswer) {
			const pregnancyDates = this.calculatePregnancyDates(
				new Date(aiAnswer),
				animal_id,
			)

			const notificationData = this.createMultilingualNotifications(
				user_id,
				animal_id,
				animal_number,
				pregnancyDates,
				docNum,
				farm_name,
			)
			notifications = notificationData.notifications
			languages = notificationData.languages
		}

		if (hasExistingData) {
			await this.cleanupNotifications(user_id, animal_number, animal_id)
		}

		await Promise.all([
			db.AnimalQuestionAnswer.bulkCreate(answerRecords),
			notifications.length > 0
				? db.Notification.bulkCreate(notifications)
				: Promise.resolve(),
			languages.length > 0
				? db.NotificationLanguage.bulkCreate(languages)
				: Promise.resolve(),
		])
	}

	static async updateAnimalMilkQuestionAnswers({
		user_id,
		animal_number,
		animal_id,
		answers,
		date,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
		date: string
	}): Promise<void> {
		await this.updateSimpleAnimalQuestions({
			user_id,
			animal_number,
			animal_id,
			answers,
			date,
			categoryId: 3,
		})
	}

	static async updateAnimalBirthQuestionAnswers({
		user_id,
		animal_number,
		animal_id,
		answers,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
	}): Promise<void> {
		await this.updateSimpleAnimalQuestions({
			user_id,
			animal_number,
			animal_id,
			answers,
			date: new Date().toISOString(),
			categoryId: 4,
		})
	}

	static async updateAnimalHealthQuestionAnswers({
		user_id,
		animal_number,
		animal_id,
		answers,
		date,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
		date: string
	}): Promise<void> {
		await this.updateSimpleAnimalQuestions({
			user_id,
			animal_number,
			animal_id,
			answers,
			date,
			categoryId: 5,
		})
	}

	private static async updateSimpleAnimalQuestions({
		user_id,
		animal_number,
		animal_id,
		answers,
		date,
		categoryId,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
		date: string
		categoryId: number
	}): Promise<{ success: boolean; message: string; data?: [] }> {
		const user = await db.User.findOne({
			where: { id: user_id, deleted_at: null },
		})
		if (!user) {
			return { success: false, message: 'User not found', data: [] }
		}

		const animal = await db.Animal.findOne({
			where: { id: animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})
		for (const answer of answers) {
			const question = await db.CommonQuestions.findOne({
				where: { id: answer.question_id, deleted_at: null },
			})
			if (!question)
				throw new ValidationRequestError({
					[`answers.${answers.indexOf(answer)}.question_id`]: [
						`The selected answers.${answers.indexOf(answer)}.question_id is invalid.`,
					],
				})
		}
		const answerRecords = answers.map((value) => {
			const record: {
				question_id: number
				answer: string
				user_id: number
				animal_id: number
				created_at: Date
				updated_at: Date
				animal_number: string
				status: boolean
				logic_value?: string | null
			} = {
				question_id: value.question_id,
				answer: String(value.answer),
				user_id,
				animal_id,
				created_at: new Date(date),
				updated_at: new Date(date),
				animal_number,
				status: false,
			}

			// Add logic_value only for basic questions (category 1)
			if (categoryId === 1) {
				record.logic_value = this.getAnimalLogicValue(value.answer)
			}

			return record
		})

		const currentDate = date.slice(0, 10)

		await this.cleanupExistingData(
			user_id,
			animal_number,
			animal_id,
			categoryId,
			currentDate,
		)
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)

		return { success: true, message: 'Success', data: [] }
	}

	static async saveHeatEventDetailsOfAnimal({
		user_id,
		animal_id,
		animal_number,
		answers,
		date,
	}: {
		user_id: number
		animal_id: number
		animal_number: string
		answers: AnimalAnswerInput[]
		date?: string
	}): Promise<void> {
		const animal = await db.Animal.findOne({
			where: { id: animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})
		const animalNumber = await db.AnimalQuestionAnswer.findOne({
			where: { animal_number, deleted_at: null },
		})
		if (!animalNumber)
			throw new ValidationRequestError({
				animal_number: ['The selected animal number is invalid.'],
			})
		for (const answer of answers) {
			const question = await db.CommonQuestions.findOne({
				where: { id: answer.question_id, deleted_at: null },
			})
			if (!question)
				throw new ValidationRequestError({
					[`answers.${answers.indexOf(answer)}.question_id`]: [
						`The selected answers.${answers.indexOf(answer)}.question_id is invalid.`,
					],
				})
		}

		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: date ? new Date(date) : new Date(),
			animal_number,
			logic_value: null,
			status: false,
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
	}

	static async updateHeatEventDetailsOfAnimal({
		user_id,
		animal_number,
		animal_id,
		answers,
	}: {
		user_id: number
		animal_number: string
		animal_id: number
		answers: AnimalAnswerInput[]
	}): Promise<void> {
		const animal = await db.Animal.findOne({
			where: { id: animal_id, deleted_at: null },
		})
		if (!animal)
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})

		for (const answer of answers) {
			const question = await db.CommonQuestions.findOne({
				where: { id: answer.question_id, deleted_at: null },
			})
			if (!question)
				throw new ValidationRequestError({
					[`answers.${answers.indexOf(answer)}.question_id`]: [
						`The selected answers.${answers.indexOf(answer)}.question_id is invalid.`,
					],
				})
		}
		let date_of_heat = ''
		const now = new Date()
		const answerRecords: Array<{
			question_id: number
			answer: string
			user_id: number
			animal_id: number
			created_at: Date
			animal_number: string
			logic_value: string | null
			status: boolean
		}> = []
		for (const value of answers) {
			answerRecords.push({
				question_id: value.question_id,
				answer: String(value.answer),
				user_id,
				animal_id,
				created_at: now,
				animal_number,
				logic_value: null,
				status: false,
			})
			if (value.question_id === 51) {
				date_of_heat = String(value.answer)
			}
		}
		const getTodaysData = await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_number,
				user_id,
				animal_id,
				created_at: now,
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { category_id: 99, deleted_at: null },
				},
			],
		})
		const dateExist = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id,
				animal_number,
				user_id,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 64, deleted_at: null },
				},
			],
			order: [['created_at', 'DESC']],
		})
		if (getTodaysData.length > 0) {
			const toDeleteIds = getTodaysData.map((a) => a.id)
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
			await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
		} else if (dateExist && dateExist.answer === date_of_heat) {
			await db.sequelize.query(
				`
                    DELETE aqa FROM animal_question_answers aqa
                    JOIN common_questions cq ON cq.id = aqa.question_id AND cq.deleted_at IS NULL
                    WHERE cq.question_tag = :questionTag
                    AND aqa.user_id = :userId
                    AND aqa.animal_id = :animalId
                    AND aqa.animal_number = :animalNumber
                    AND aqa.status <> 1
                    AND aqa.created_at = :createdAt
					AND aqa.deleted_at IS NULL
					AND cq.deleted_at IS NULL
                    `,
				{
					replacements: {
						questionTag: 64,
						userId: user_id,
						animalId: animal_id,
						animalNumber: animal_number,
						createdAt: dateExist.created_at,
					},
					type: QueryTypes.DELETE,
				},
			)
			await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
		} else {
			await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
		}
	}

	static async userAnimalQuestionAnswerHeatEventDetail({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<
		Record<string, Record<string, GroupedAnimalQuestionAnswer[]>> | []
	> {
		const latestAnswerQuery = `
        SELECT aqa.answer 
        FROM animal_question_answers aqa
        INNER JOIN common_questions cq ON aqa.question_id = cq.id
        WHERE aqa.animal_id = :animal_id 
        AND aqa.user_id = :user_id 
        AND aqa.animal_number = :animal_number
        AND cq.category_id = 99
        AND aqa.status != 1
        AND aqa.deleted_at IS NULL
        AND cq.deleted_at IS NULL
        ORDER BY aqa.answer DESC
        LIMIT 1
    `

		const [latestResult] = (await db.sequelize.query(latestAnswerQuery, {
			replacements: {
				animal_id,
				user_id,
				animal_number,
			},
			type: QueryTypes.SELECT,
		})) as unknown as { answer: string }[]

		const date1 = latestResult ? latestResult.answer : null

		const mainQuery = `
        SELECT 
            aq.question_id,
            ql.question,
            cq.category_id,
            cq.sub_category_id,
            cq.validation_rule_id,
            cl.category_language_name,
            scl.sub_category_language_name,
            ql.hint as language_hint,
            cq.form_type_id,
            cq.date,
            cq.question as master_question,
            aq.animal_id,
            vr.name as validation_rule,
            ft.name as form_type,
            aqa.answer,
            cq.form_type_value,
            ql.form_type_value as language_form_type_value,
            vr.constant_value,
            cq.question_tag,
            aqa.created_at,
            cq.question_unit,
            aqa.animal_number
        FROM common_questions cq
        INNER JOIN animal_questions aq ON cq.id = aq.question_id AND aq.deleted_at IS NULL
        INNER JOIN question_language ql ON cq.id = ql.question_id AND ql.deleted_at IS NULL
        LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id AND aqa.deleted_at IS NULL
            AND aqa.user_id = :user_id 
            AND aqa.animal_id = :animal_id 
            AND aqa.animal_number = :animal_number
            ${date1 ? 'AND aqa.answer = :latest_answer_date' : ''}
        LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
        INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
        INNER JOIN category_language cl ON cl.category_id = cq.category_id 
            AND cl.language_id = :language_id 
            AND cl.category_id = 99
            AND cl.deleted_at IS NULL
        LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id 
            AND scl.language_id = :language_id
            AND scl.deleted_at IS NULL
        WHERE ql.language_id = :language_id 
        AND aq.animal_id = :animal_id
		AND cq.deleted_at IS NULL
    `

		const replacements: Record<string, unknown> = {
			user_id,
			animal_id,
			animal_number,
			language_id,
		}

		if (date1) {
			const latestAnswerDate = new Date(date1).toISOString().split('T')[0]
			replacements.latest_answer_date = latestAnswerDate
		}

		const languageQuestions = (await db.sequelize.query(mainQuery, {
			replacements,
			type: QueryTypes.SELECT,
		})) as unknown as {
			question_id: number
			question: string
			category_id: number
			sub_category_id: number
			validation_rule_id: number
			category_language_name: string
			sub_category_language_name: string
			language_hint: string
			form_type_id: number
			date: boolean
			master_question: string
			animal_id: number
			validation_rule: string
			form_type: string
			answer: string
			form_type_value: string
			language_form_type_value: string
			constant_value: string
			question_tag: number
			created_at: Date
			question_unit: string
			animal_number: string
		}[]

		if (!languageQuestions.length) return []

		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}
		for (const value of languageQuestions) {
			const categoryName = value.category_language_name || ''
			const subCategoryName = value.sub_category_language_name || ''

			if (!resData[categoryName]) {
				resData[categoryName] = {}
			}

			if (!resData[categoryName][subCategoryName]) {
				resData[categoryName][subCategoryName] = []
			}

			resData[categoryName][subCategoryName].push({
				animal_id: value.animal_id,
				validation_rule: value.validation_rule || null,
				master_question: value.master_question,
				language_question: value.question,
				question_id: value.question_id,
				form_type: value.form_type,
				date: value.date,
				answer: value.answer,
				form_type_value: value.form_type_value || null,
				language_form_type_value: value.language_form_type_value || null,
				constant_value: value.constant_value || null,
				question_tag: value.question_tag || null,
				question_unit: value.question_unit || null,
				answer_date: value.created_at || null,
				animal_number: value.animal_number,
				hint: value.language_hint,
			})
		}

		return resData
	}

	static async userPreviousAnimalQuestionAnswersHeatEventDetails({
		user_id,
		animal_id,
		language_id,
		animal_number,
	}: {
		user_id: number
		animal_id: number
		language_id: number
		animal_number: string
	}): Promise<Record<string, GroupedAnimalQuestionAnswer[]> | []> {
		const latestAnswerQuery = `
		SELECT aqa.answer 
		FROM animal_question_answers aqa
		INNER JOIN common_questions cq ON aqa.question_id = cq.id
		WHERE aqa.animal_id = :animal_id 
		AND aqa.user_id = :user_id 
		AND aqa.animal_number = :animal_number
		AND cq.category_id = 99
		AND aqa.status != 1
		AND aqa.deleted_at IS NULL
		AND cq.deleted_at IS NULL
		ORDER BY aqa.answer DESC
		LIMIT 1
	`

		const [latestResult] = (await db.sequelize.query(latestAnswerQuery, {
			replacements: {
				animal_id,
				user_id,
				animal_number,
			},
			type: QueryTypes.SELECT,
		})) as unknown as { answer: string }[]

		const date1 = latestResult ? latestResult.answer : null

		const mainQuery = `
		SELECT 
			aqa.question_id,
			ql.question,
			cq.category_id,
			cq.sub_category_id,
			cq.validation_rule_id,
			cl.category_language_name,
			scl.sub_category_language_name,
			ql.hint as language_hint,
			cq.form_type_id,
			cq.date,
			cq.question as master_question,
			aqa.animal_id,
			vr.name as validation_rule,
			ft.name as form_type,
			aqa.answer,
			cq.form_type_value,
			ql.form_type_value as language_form_type_value,
			vr.constant_value,
			cq.question_tag,
			aqa.created_at,
			cq.question_unit,
			aqa.animal_number
		FROM common_questions cq
		INNER JOIN question_language ql ON cq.id = ql.question_id AND ql.deleted_at IS NULL
		LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id AND aqa.deleted_at IS NULL
			AND aqa.user_id = :user_id 
			AND aqa.animal_id = :animal_id 
			AND aqa.animal_number = :animal_number
			${date1 ? 'AND DATE(aqa.answer) != :latest_answer_date' : ''}
		LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
		INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
		INNER JOIN category_language cl ON cl.category_id = cq.category_id 
			AND cl.deleted_at IS NULL
			AND cl.language_id = 2
			AND cl.category_id = 99
		LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id 
			AND scl.language_id = :language_id
			AND scl.deleted_at IS NULL
		WHERE ql.language_id = :language_id 
		AND aqa.animal_id = :animal_id
		AND cq.question_tag = 64
		AND cq.deleted_at IS NULL
		ORDER BY aqa.answer DESC
	`

		const replacements: Record<string, unknown> = {
			user_id,
			animal_id,
			animal_number,
			language_id,
		}

		if (date1) {
			const latestAnswerDate = new Date(date1).toISOString().split('T')[0]
			replacements.latest_answer_date = latestAnswerDate
		}

		const languageQuestions = (await db.sequelize.query(mainQuery, {
			replacements,
			type: QueryTypes.SELECT,
		})) as unknown as {
			question_id: number
			question: string
			category_id: number
			sub_category_id: number
			validation_rule_id: number
			category_language_name: string
			sub_category_language_name: string
			language_hint: string
			form_type_id: number
			date: boolean
			master_question: string
			animal_id: number
			validation_rule: string
			form_type: string
			answer: string
			form_type_value: string
			language_form_type_value: string
			constant_value: string
			question_tag: number
			created_at: Date
			question_unit: string
			animal_number: string
		}[]

		if (!languageQuestions.length) return []

		const resData: Record<string, GroupedAnimalQuestionAnswer[]> = {}

		for (const value of languageQuestions) {
			const categoryName = value.category_language_name || ''
			const categoryKey = categoryName.toLowerCase().replaceAll(' ', '_')

			if (!resData[categoryKey]) {
				resData[categoryKey] = []
			}

			resData[categoryKey].push({
				animal_id: value.animal_id,
				validation_rule: value.validation_rule || null,
				master_question: value.master_question,
				language_question: value.question,
				question_id: value.question_id,
				form_type: value.form_type,
				date: value.date,
				answer: value.answer,
				form_type_value: value.form_type_value || null,
				language_form_type_value: value.language_form_type_value || null,
				constant_value: value.constant_value || null,
				question_tag: value.question_tag || null,
				question_unit: value.question_unit || null,
				answer_date: value.created_at || null,
				animal_number: value.animal_number,
				hint: value.language_hint,
			})
		}

		return resData
	}

	private static buildDeliveryDatesResult(
		mappedDate: string[],
		animalAnswers: string[],
		mappedDateCount: Record<string, number>,
		answerCount: Record<string, number>,
	): { delivery_date: string }[] {
		const resData: { delivery_date: string }[] = []


		// Only proceed if we have either mapped dates or animal answers
		if (mappedDate.length > 0 && animalAnswers.length > 0) {
			for (const [date, count] of Object.entries(answerCount)) {
				if (mappedDate.includes(date)) {
					if (mappedDateCount[date] < count) {
						addMappedDeliveryDates(resData, date, count, mappedDateCount[date])
					}
				} else {
					addUnmappedDeliveryDates(resData, date, count)
				}
			}
		} else if (animalAnswers.length > 0) {
			// No mapped dates but we have animal answers
			for (const date of animalAnswers) {
				resData.push({ delivery_date: date })
			}
		}

		return resData
	}

	static async listOfAnimalDeliveryDates(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ delivery_date: string }[]> {
		// 1. Get all mapped delivery dates for this user/animal/animal_number
		const mappedDateRows = await db.AnimalMotherCalf.findAll({
			where: {
				user_id,
				animal_id,
				mother_animal_number: animal_number,
				deleted_at: null,
			},
			attributes: ['delivery_date'],
			raw: true,
		})
		const mappedDate = mappedDateRows.map((row) => {
			if (typeof row.delivery_date === 'string') return row.delivery_date
			return row.delivery_date instanceof Date
				? row.delivery_date.toISOString().slice(0, 10)
				: ''
		})

		// 2. Get all delivery answers for question_tag=66
		const animalAnswersRows = await db.sequelize.query<{ answer: string }>(
			`SELECT aqa.answer
            FROM animal_question_answers aqa
			JOIN common_questions cq ON cq.id = aqa.question_id
            WHERE aqa.status <> 1
            AND aqa.user_id = :user_id
            AND cq.question_tag = 66
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number = :animal_number
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)
		const animalAnswers = animalAnswersRows.map((row) => row.answer)

		// 3. Count occurrences
		const mappedDateCount: Record<string, number> = {}
		for (const date of mappedDate) {
			mappedDateCount[date] = (mappedDateCount[date] || 0) + 1
		}
		const answerCount: Record<string, number> = {}
		for (const date of animalAnswers) {
			answerCount[date] = (answerCount[date] || 0) + 1
		}

		// 4. Build result using helper
		return this.buildDeliveryDatesResult(
			mappedDate,
			animalAnswers,
			mappedDateCount,
			answerCount,
		)
	}

	static async listOfAnimalCalfs(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ animal_number: string }[]> {
		// 1. Get all mapped calf numbers for this user/animal
		const mappedCalfRows = await db.AnimalMotherCalf.findAll({
			where: { user_id, animal_id, deleted_at: null },
			attributes: ['calf_animal_number'],
			raw: true,
		})
		const mappedCalf = mappedCalfRows.map((row) => row.calf_animal_number)

		// 2. Query for distinct animal_number of calfs not in mappedCalf or animal_number
		const calfs = await db.sequelize.query<{ animal_number: string }>(
			`SELECT DISTINCT aqa.animal_number
            FROM animal_question_answers aqa
            JOIN common_questions cq ON cq.id = aqa.question_id
            WHERE aqa.status <> 1
            AND aqa.user_id = :user_id
            AND aqa.logic_value = 'calf'
            AND cq.question_tag = 60
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number NOT IN (:mappedCalf)
            AND aqa.animal_number <> :animal_number
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL`,
			{
				replacements: {
					user_id,
					animal_id,
					mappedCalf: mappedCalf.length ? mappedCalf : [''],
					animal_number,
				},
				type: QueryTypes.SELECT,
			},
		)
		return calfs
	}

	static async getAnimalLactationStatus(
		user_id: number,
		animal_id: number,
		animal_num: string,
	): Promise<{ lactating_status: string | null }> {
		const result = await db.sequelize.query(
			`SELECT aqa.answer, aqa.created_at, aqa.question_id
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag = 16
            AND aqa.user_id = :user_id
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number = :animal_num
            AND aqa.status <> 1
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            ORDER BY aqa.created_at DESC
            LIMIT 1`,
			{
				replacements: { user_id, animal_id, animal_num },
				type: QueryTypes.SELECT,
			},
		)
		const row =
			(result[0] as
				| { answer?: string; created_at?: string; question_id?: number }
				| undefined) || {}
		return {
			lactating_status: row.answer ?? null,
		}
	}

	static async getAnimalPregnancyStatus(
		user_id: number,
		animal_id: number,
		animal_num: string,
	): Promise<{
		answer: string | null
		created_at: string | null
		question_id: number | null
	}> {
		const result = await db.sequelize.query(
			`SELECT aqa.answer, aqa.created_at, aqa.question_id
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag = 15
            AND aqa.user_id = :user_id
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number = :animal_num
            AND aqa.status <> 1
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            ORDER BY aqa.created_at DESC
            LIMIT 1`,
			{
				replacements: { user_id, animal_id, animal_num },
				type: QueryTypes.SELECT,
			},
		)
		const row =
			(result[0] as
				| { answer?: string; created_at?: string; question_id?: number }
				| undefined) || {}
		return {
			answer: row.answer ?? null,
			created_at: row.created_at ?? null,
			question_id: row.question_id ?? null,
		}
	}

	static async mapAnimalMotherToCalf(
		user_id: number,
		data: {
			animal_id: number
			delivery_date: string
			mother_animal_number: string
			calf_animal_number: string
		},
	): Promise<{ status: number; message: string; data: [] }> {
		const animal = await db.Animal.findOne({
			where: {
				id: data.animal_id,
				deleted_at: null,
			},
		})

		if (!animal) {
			throw new ValidationRequestError({
				animal_id: ['The selected animal id is invalid.'],
			})
		}

		// Validate delivery_date
		const deliveryDateExists = await db.AnimalQuestionAnswer.findOne({
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 66, deleted_at: null },
				},
			],
			where: {
				status: { [Op.ne]: 1 },
				user_id,
				answer: data.delivery_date,
				deleted_at: null,
			},
		})

		if (!deliveryDateExists) {
			throw new ValidationRequestError({
				delivery_date: ['The selected delivery date is invalid.'],
			})
		}

		// Validate mother_animal_number
		const motherAnimalExists = await db.AnimalQuestionAnswer.findOne({
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 60, deleted_at: null },
				},
			],
			where: {
				status: { [Op.ne]: 1 },
				user_id,
				logic_value: { [Op.in]: ['cow', 'buffalo'] },
				animal_number: data.mother_animal_number,
				deleted_at: null,
			},
		})

		if (!motherAnimalExists) {
			throw new ValidationRequestError({
				mother_animal_number: ['The selected animal number is invalid.'],
			})
		}

		// Validate calf_animal_number
		const calfAnimalExists = await db.AnimalQuestionAnswer.findOne({
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 60, deleted_at: null },
				},
			],
			where: {
				status: { [Op.ne]: 1 },
				user_id,
				logic_value: 'calf',
				animal_number: data.calf_animal_number,
				deleted_at: null,
			},
		})

		if (!calfAnimalExists) {
			throw new ValidationRequestError({
				calf_animal_number: ['The selected animal number is invalid.'],
			})
		}

		const exists = await db.AnimalMotherCalf.findOne({
			where: {
				user_id,
				animal_id: data.animal_id,
				mother_animal_number: data.mother_animal_number,
				calf_animal_number: data.calf_animal_number,
				delivery_date: data.delivery_date,
				deleted_at: null,
			},
		})
		if (exists) {
			throw new AppError(
				'This animal mother is already mapped with animal calf',
				409,
			)
		}
		await db.AnimalMotherCalf.create({
			user_id,
			animal_id: data.animal_id,
			delivery_date: new Date(data.delivery_date.slice(0, 10)),
			mother_animal_number: data.mother_animal_number,
			calf_animal_number: data.calf_animal_number,
		})
		return { status: 200, message: 'Success', data: [] }
	}

	static async attachedCalfOfAnimal(
		user_id: number,
		animal_id: number,
		mother_number: string,
	): Promise<{ calf_number: string; delivery_date: string }[]> {
		const rows = (await db.AnimalMotherCalf.findAll({
			where: {
				user_id,
				animal_id,
				mother_animal_number: mother_number,
				deleted_at: null,
			},
			attributes: [['calf_animal_number', 'calf_number'], 'delivery_date'],
			order: [['created_at', 'DESC']],
			raw: true,
		})) as unknown as { calf_number: string; delivery_date: Date | string }[]
		// Convert delivery_date to string (yyyy-mm-dd) if needed
		return rows.map((row) => ({
			calf_number: row.calf_number,
			delivery_date:
				row.delivery_date instanceof Date
					? row.delivery_date.toISOString().slice(0, 10)
					: row.delivery_date,
		}))
	}

	private static async fetchAIAnswers(
		user_id: number,
		animal_id: number,
		animal_number: string,
		question_tag: number,
	): Promise<Array<{ answer: string; answer_date: string }>> {
		const rows = await db.sequelize.query<{
			answer: string
			answer_date: string
		}>(
			`SELECT aqa.answer, aqa.created_at as answer_date
		    FROM common_questions cq
		    JOIN animal_question_answers aqa ON aqa.question_id = cq.id
		    WHERE cq.question_tag = :question_tag
			AND cq.deleted_at IS NULL
		    AND aqa.user_id = :user_id
		    AND aqa.animal_id = :animal_id
		    AND aqa.animal_number = :animal_number
		    AND aqa.status != 1
			AND aqa.deleted_at IS NULL`,
			{
				replacements: { user_id, animal_id, animal_number, question_tag },
				type: QueryTypes.SELECT,
			},
		)
		return rows
	}

	static async getAIHistoryOfAnimal(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<
		{
			date_of_AI: string
			bull_no: string
			mother_yield: string
			semen_company: string
		}[]
	> {
		// Initialize result data structure
		const resData: Record<
			string,
			{
				date_of_AI: string
				bull_no: string
				mother_yield: string
				semen_company: string
			}
		> = {}

		// Fetch and process dateOfAI (question_tag = 23)
		const dateOfAI = await this.fetchAIAnswers(
			user_id,
			animal_id,
			animal_number,
			23,
		)
		for (const item of dateOfAI) {
			if (!resData[item.answer_date]) {
				resData[item.answer_date] = {
					date_of_AI: '',
					bull_no: '',
					mother_yield: '',
					semen_company: '',
				}
			}
			resData[item.answer_date].date_of_AI = item.answer
		}

		// Fetch and process noOfBull (question_tag = 35)
		const noOfBull = await this.fetchAIAnswers(
			user_id,
			animal_id,
			animal_number,
			35,
		)
		for (const item of noOfBull) {
			if (!resData[item.answer_date]) {
				resData[item.answer_date] = {
					date_of_AI: '',
					bull_no: '',
					mother_yield: '',
					semen_company: '',
				}
			}
			resData[item.answer_date].bull_no = item.answer
		}

		// Fetch and process semenCompanyName (question_tag = 42)
		const semenCompanyName = await this.fetchAIAnswers(
			user_id,
			animal_id,
			animal_number,
			42,
		)
		for (const item of semenCompanyName) {
			if (!resData[item.answer_date]) {
				resData[item.answer_date] = {
					date_of_AI: '',
					bull_no: '',
					mother_yield: '',
					semen_company: '',
				}
			}
			resData[item.answer_date].semen_company = item.answer
		}

		// Fetch and process bullMotherYield (question_tag = 14)
		const bullMotherYield = await this.fetchAIAnswers(
			user_id,
			animal_id,
			animal_number,
			14,
		)
		for (const item of bullMotherYield) {
			if (!resData[item.answer_date]) {
				resData[item.answer_date] = {
					date_of_AI: '',
					bull_no: '',
					mother_yield: '',
					semen_company: '',
				}
			}
			resData[item.answer_date].mother_yield = item.answer
		}

		const res = Object.values(resData)

		return res
	}
}

// Helper function for adding mapped delivery dates
function addMappedDeliveryDates(
	resData: { delivery_date: string }[],
	date: string,
	count: number,
	mappedCount: number,
): void {
	for (let i = 0; i < count - mappedCount; i++) {
		resData.push({ delivery_date: date })
	}
}

// Helper function for adding unmapped delivery dates
function addUnmappedDeliveryDates(
	resData: { delivery_date: string }[],
	date: string,
	count: number,
): void {
	for (let i = 0; i < count; i++) {
		resData.push({ delivery_date: date })
	}
}
