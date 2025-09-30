import db from '@/config/database'
import moment from 'moment-timezone'
import { ValidationRequestError } from '@/utils/errors'
import { Op, QueryTypes, Transaction } from 'sequelize'

interface AnswerInput {
	question_id: number
	answer: { [key: string]: string }[]
}

interface CreateDailyRecordAnswerInput {
	answers: AnswerInput[]
	date: string
	user_id: number
}

interface UpdateAnswerInput {
	daily_record_answer_id: number
	answer: string
}

interface DailyRecordAnswerRecord {
	daily_record_question_id: number
	answer: string
	user_id: number
	answer_date: Date
}

interface NotificationRecord {
	user_id: number
	message: string
	type: string
	heading: string
	send_notification_date: Date
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
}

interface LanguageTemplate {
	language_id: number
	langauge_message: string
	heading: string
}

interface DailyRecordQuestionWithAnswerRow {
	question_id: number
	master_question: string
	category_language_name?: string
	sub_category_language_name?: string | null
	form_type: string | null
	form_type_value: string | null
	created_at: string
	answer: string | null
	question: string
	language_form_type_value: string | null
	constant_value: number | null
	question_tag: number
	delete_status: boolean
	question_unit: number
	hint: string | null
	hint1: 1
	language_question: string
	sequence_number: number
	langauge_hint: string | null
	validation_rule: string
}

export class DailyRecordQuestionAnswerService {
	static async createAnswers(
		data: CreateDailyRecordAnswerInput,
	): Promise<{ message: string }> {
		const transaction = await db.sequelize.transaction()

		try {
			const questionIds = data.answers.map((answer) => answer.question_id)

			// Step 1: Validate questions
			await this.validateQuestions(data.answers)

			// Step 2: Get question tag mappings
			const { deWormingQuestions, bioSecurityQuestions } =
				await this.getQuestionTagMappings(questionIds, transaction)

			// Step 3: Create answer records
			const answerRecords = this.createAnswerRecords(
				data.answers,
				data.user_id,
				data.date as unknown as Date,
			) as DailyRecordAnswerRecord[]

			// Step 4: Create notifications
			const deWormingData = this.createDeWormingNotifications(
				data.answers,
				deWormingQuestions,
				data.user_id,
				data.date,
			)

			const bioSecurityData = this.createBioSecurityNotifications(
				data.answers,
				bioSecurityQuestions,
				data.user_id,
				data.date,
			)

			const allNotifications = [
				...deWormingData.notifications,
				...bioSecurityData.notifications,
			]
			const allLanguages = [
				...deWormingData.languages,
				...bioSecurityData.languages,
			]

			// Step 5: Clean existing data
			await this.cleanExistingData(data.user_id, data.date, transaction)

			// Step 6: Save new data
			await this.saveData(
				answerRecords,
				allNotifications,
				allLanguages,
				transaction,
			)

			await transaction.commit()
			return { message: 'Success' }
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}

	static async updateAnswers(
		user_id: number,
		answers: UpdateAnswerInput[],
		_date?: string,
	): Promise<{ message: string }> {
		for (const answer of answers) {
			const dailyRecordQuestionAnswer =
				await db.DailyRecordQuestionAnswer.findOne({
					where: {
						id: answer.daily_record_answer_id,
						deleted_at: null,
					},
				})

			if (!dailyRecordQuestionAnswer) {
				throw new ValidationRequestError({
					[`answers.${answers.indexOf(answer)}.daily_record_answer_id`]: [
						`The selected answers.${answers.indexOf(answer)}.daily_record_answer_id is invalid.`,
					],
				})
			}
		}
		const cases = answers
			.map(
				(answer) =>
					`WHEN id = ${answer.daily_record_answer_id} THEN '${JSON.stringify(answer.answer).replace(/'/g, "''")}'`,
			)
			.join(' ')

		const ids = answers.map((answer) => answer.daily_record_answer_id).join(',')

		const query = `
        UPDATE daily_record_question_answer 
        SET 
            answer = CASE ${cases} END,
            updated_at = NOW()
        WHERE user_id = :user_id 
		AND deleted_at IS NULL
        AND id IN (${ids})
    `

		await db.sequelize.query(query, {
			replacements: { user_id },
			type: QueryTypes.UPDATE,
		})

		return { message: 'Success' }
	}

	static async getDailyRecordQuestionsWithAnswers(
		user_id: number,
		language_id: number,
		date: string,
	): Promise<
		Record<string, Record<string, DailyRecordQuestionWithAnswerRow[]>> | []
	> {
		const questions = (await db.sequelize.query(
			`SELECT drq.id as question_id,cl.category_language_name, scl.sub_category_language_name,  drq.question as master_question,
	            ft.name as form_type, drq.form_type_value, dql.created_at,dql.hint as hint,dql.question as language_question,
	            drqa.answer, dql.form_type_value as language_form_type_value, vr.constant_value,
	            drq.question_tag, drq.delete_status, drq.question_unit, drq.hint as hint1, c.sequence_number,
	            vr.name as validation_rule
	        FROM daily_record_questions drq
	        JOIN category_language cl
	            ON cl.category_id = drq.category_id AND cl.language_id = :language_id 
			    AND cl.deleted_at IS NULL
	        LEFT JOIN sub_category_language scl
				ON scl.sub_category_id = drq.sub_category_id AND scl.language_id = :language_id 
				AND scl.deleted_at IS NULL
	        JOIN daily_record_question_language dql
				ON dql.daily_record_question_id = drq.id 
				AND dql.deleted_at IS NULL
	        JOIN validation_rules vr
				ON vr.id = drq.validation_rule_id 
				AND vr.deleted_at IS NULL
	        LEFT JOIN form_type ft
				ON ft.id = drq.form_type_id 
				AND ft.deleted_at IS NULL
	        LEFT JOIN daily_record_question_answer drqa 
				ON drq.id = drqa.daily_record_question_id 
				AND drqa.deleted_at IS NULL
				AND drqa.user_id = :user_id
				AND DATE(drqa.answer_date) = :date
	        JOIN categories c
				ON c.id = drq.category_id 
				AND c.deleted_at IS NULL
	        WHERE dql.language_id = :language_id
	            AND drq.delete_status != 1
	        ORDER BY  c.sequence_number,dql.created_at ASC`,
			{
				replacements: { language_id, user_id, date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as DailyRecordQuestionWithAnswerRow[]

		if (!questions.length) return []

		const resData: Record<
			string,
			Record<string, DailyRecordQuestionWithAnswerRow[]>
		> = {}

		for (const value of questions) {
			const cat = value.category_language_name || ''
			const subcat = value.sub_category_language_name || ''

			if (!resData[cat]) resData[cat] = {}
			if (!resData[cat][subcat]) resData[cat][subcat] = []
			const {
				category_language_name: _category_language_name,
				sub_category_language_name: _sub_category_language_name,
				...questionWithoutCategoryNames
			} = value

			const parsedValue: DailyRecordQuestionWithAnswerRow = {
				...questionWithoutCategoryNames,
				answer: value.answer ? (JSON.parse(value.answer) as string) : null,
			}

			resData[cat][subcat].push(parsedValue)
		}

		return resData
	}

	static async getBioSecuritySprayDetails(
		user_id: number,
	): Promise<{ message: string; data: { date: Date; due_date: Date }[] }> {
		const biosecurityData = await db.sequelize.query(
			`SELECT drq.answer, drq.answer_date
	        FROM question_tag_mapping qtm
	        JOIN daily_record_question_answer drq ON drq.daily_record_question_id = qtm.question_id 
			AND drq.deleted_at IS NULL
	        WHERE qtm.question_tag_id = 47 AND drq.user_id = :user_id AND qtm.deleted_at IS NULL
	        ORDER BY drq.answer_date DESC`,
			{
				replacements: { user_id },
				type: QueryTypes.SELECT,
			},
		)

		const resData: { date: Date; due_date: Date }[] = []

		for (const value of biosecurityData as {
			answer: string
			answer_date: string
		}[]) {
			if (value?.answer) {
				let parsedAnswer: {
					name: string
					[key: string]: unknown
				}[]
				try {
					parsedAnswer = JSON.parse(value.answer) as {
						name: string
						[key: string]: unknown
					}[]
				} catch {
					continue
				}

				if (
					Array.isArray(parsedAnswer) &&
					parsedAnswer.length > 0 &&
					typeof parsedAnswer[0].name === 'string' &&
					parsedAnswer[0].name.toLowerCase() === 'yes'
				) {
					const answerDate = value.answer_date as unknown as Date
					const answer_date = moment.tz(value.answer_date, 'Asia/Kolkata')
					const dueDate = answer_date.add(30, 'days')

					resData.push({
						date: answerDate,
						due_date: dueDate.format('YYYY-MM-DD HH:mm:ss') as unknown as Date,
					})
				}
			}
		}

		return { message: 'success', data: resData }
	}

	static async getDewormingDetails(
		user_id: number,
	): Promise<{ message: string; data: { date: string; due_date: string }[] }> {
		const deWormingData = await db.sequelize.query(
			`SELECT drq.answer, drq.answer_date
	        FROM question_tag_mapping qtm
	        JOIN daily_record_question_answer drq ON drq.daily_record_question_id = qtm.question_id AND drq.deleted_at IS NULL
	        WHERE qtm.question_tag_id = 48 AND drq.user_id = :user_id AND qtm.deleted_at IS NULL
	        ORDER BY drq.answer_date DESC`,
			{
				replacements: { user_id },
				type: QueryTypes.SELECT,
			},
		)

		const resData: { date: string; due_date: string }[] = []

		for (const value of deWormingData as {
			answer: string
			answer_date: string
		}[]) {
			if (value?.answer) {
				let parsedAnswer: {
					name: string
					[key: string]: unknown
				}[]
				try {
					parsedAnswer = JSON.parse(value.answer) as {
						name: string
						[key: string]: unknown
					}[]
				} catch {
					continue
				}

				if (
					Array.isArray(parsedAnswer) &&
					parsedAnswer.length > 0 &&
					typeof parsedAnswer[0].name === 'string' &&
					parsedAnswer[0].name.toLowerCase() === 'yes'
				) {
					const answerDate = value.answer_date
					const answer_date = moment.tz(value.answer_date, 'Asia/Kolkata')
					const dueDate = answer_date.add(90, 'days')
					resData.push({
						date: answerDate,
						due_date: dueDate.format('YYYY-MM-DD HH:mm:ss'),
					})
				}
			}
		}

		return { message: 'success', data: resData }
	}

	//Helper fucntions
	static async validateQuestions(
		answers: CreateDailyRecordAnswerInput['answers'],
	): Promise<void> {
		for (const answer of answers) {
			const question = await db.DailyRecordQuestion.findOne({
				where: { id: answer.question_id, delete_status: 0 },
			})
			if (!question)
				throw new ValidationRequestError({
					[`answers.${answers.indexOf(answer)}.question_id`]: [
						`The selected answers.${answers.indexOf(answer)}.question_id is invalid.`,
					],
				})
		}
	}

	static async getQuestionTagMappings(
		questionIds: number[],
		transaction: Transaction,
	): Promise<{
		deWormingQuestions: Set<number>
		bioSecurityQuestions: Set<number>
	}> {
		const questionTagMappings = await db.QuestionTagMapping.findAll({
			where: {
				question_id: { [Op.in]: questionIds },
				question_tag_id: { [Op.in]: [47, 48] },
				deleted_at: null,
			},
			attributes: ['question_id', 'question_tag_id'],
			transaction,
		})

		const deWormingQuestions = new Set(
			questionTagMappings
				.filter((mapping) => mapping.question_tag_id === 48)
				.map((mapping) => mapping.question_id),
		)

		const bioSecurityQuestions = new Set(
			questionTagMappings
				.filter((mapping) => mapping.question_tag_id === 47)
				.map((mapping) => mapping.question_id),
		)

		return { deWormingQuestions, bioSecurityQuestions }
	}

	static createAnswerRecords(
		answers: CreateDailyRecordAnswerInput['answers'],
		userId: number,
		date: Date,
	): {
		daily_record_question_id: number
		answer: string
		user_id: number
		answer_date: Date
	}[] {
		return answers.map((answer) => ({
			daily_record_question_id: answer.question_id,
			answer: JSON.stringify(answer.answer),
			user_id: userId,
			answer_date: date,
		}))
	}

	static createDeWormingNotifications(
		answers: CreateDailyRecordAnswerInput['answers'],
		deWormingQuestions: Set<number>,
		userId: number,
		baseDate: string,
	): {
		notifications: NotificationRecord[]
		languages: NotificationLanguageRecord[]
	} {
		const yesAnswers = answers.filter(
			(answer) =>
				answer.answer[0]?.name?.toLowerCase() === 'yes' &&
				deWormingQuestions.has(answer.question_id),
		)

		if (yesAnswers.length === 0) {
			return { notifications: [], languages: [] }
		}

		const dueDate = moment(baseDate).add(90, 'days')
		const dueDateFormatted = dueDate.format('YYYY-MM-DD') as unknown as Date
		const dueDateDisplay = dueDate.format('DD MMM YYYY')

		const reminderDays = [7, 2, 0]

		const notifications: NotificationRecord[] = yesAnswers.map(() => ({
			user_id: userId,
			message: `Deworming is due on ${dueDateDisplay}`,
			heading: 'Deworming',
			send_notification_date: dueDateFormatted,
			type: 'Daily',
		}))

		const languageTemplate: LanguageTemplate[] = [
			{
				language_id: 2,
				langauge_message: `Deworming is due on ${dueDateDisplay}`,
				heading: 'Deworming',
			},
			{
				language_id: 1,
				langauge_message: `डिवर्मिंग अपेक्षित ${dueDateDisplay}`,
				heading: 'डी वर्मिंग',
			},
			{
				language_id: 19,
				langauge_message: `जंताचे औषध देणे अपेक्षित ${dueDateDisplay}`,
				heading: 'जंताचे औषध',
			},
		]

		const languages: NotificationLanguageRecord[] = yesAnswers.flatMap(() =>
			reminderDays.flatMap((daysBefore) => {
				return languageTemplate.map((lang) => ({
					user_id: userId,
					...lang,
					send_notification_date: dueDateFormatted,
					animal_id: 0,
					animal_number: '0',
					status: 0,
					days_before: daysBefore,
				}))
			}),
		)

		return { notifications, languages }
	}

	static createBioSecurityNotifications(
		answers: CreateDailyRecordAnswerInput['answers'],
		bioSecurityQuestions: Set<number>,
		userId: number,
		baseDate: string,
	): {
		notifications: NotificationRecord[]
		languages: NotificationLanguageRecord[]
	} {
		const yesAnswers = answers.filter(
			(answer) =>
				answer.answer[0]?.name?.toLowerCase() === 'yes' &&
				bioSecurityQuestions.has(answer.question_id),
		)

		if (yesAnswers.length === 0) {
			return { notifications: [], languages: [] }
		}

		const dueDate = moment(baseDate).add(30, 'days')
		const dueDateFormatted = dueDate.format('YYYY-MM-DD') as unknown as Date
		const dueDateDisplay = dueDate.format('DD MMM YYYY')

		const reminderDays = [7, 2, 0]

		const notifications: NotificationRecord[] = yesAnswers.map(() => ({
			user_id: userId,
			message: `Biosecurity spray is due on ${dueDateDisplay}`,
			heading: 'BioSecurity Spray',
			send_notification_date: dueDateFormatted,
			type: 'Daily',
		}))

		const languageTemplate: LanguageTemplate[] = [
			{
				language_id: 2,
				langauge_message: `Biosecurity spray is due on ${dueDateDisplay}`,
				heading: 'BioSecurity Spray',
			},
			{
				language_id: 1,
				langauge_message: `बायोसिक्योरिटी स्प्रे अपेक्षित ${dueDateDisplay}`,
				heading: 'निर्जंतुकीकरण स्प्रे',
			},
			{
				language_id: 19,
				langauge_message: `निर्जंतुकीकरण फवारणी अपेक्षित ${dueDateDisplay}`,
				heading: 'निर्जंतुकीकरण फवारणी',
			},
		]

		const languages: NotificationLanguageRecord[] = yesAnswers.flatMap(() =>
			reminderDays.flatMap((daysBefore) => {
				return languageTemplate.map((lang) => ({
					user_id: userId,
					...lang,
					send_notification_date: dueDateFormatted,
					animal_id: 0,
					animal_number: '0',
					status: 0,
					days_before: daysBefore,
				}))
			}),
		)

		return { notifications, languages }
	}

	static async cleanExistingData(
		userId: number,
		date: string,
		transaction: Transaction,
	): Promise<void> {
		const dailyDataExists = await db.DailyRecordQuestionAnswer.findOne({
			where: {
				user_id: userId,
				[Op.and]: [
					db.sequelize.where(
						db.sequelize.fn('DATE', db.sequelize.col('answer_date')),
						date,
					),
				],
				deleted_at: null,
			},
			attributes: ['id'],
			transaction,
		})

		if (!dailyDataExists) return

		await Promise.all([
			db.DailyRecordQuestionAnswer.destroy({
				where: {
					user_id: userId,
					[Op.and]: db.sequelize.where(
						db.sequelize.fn('DATE', db.sequelize.col('answer_date')),
						date,
					),
				},
				transaction,
			}),
			db.Notification.destroy({
				where: {
					user_id: userId,
					type: 'Daily',
				},
				transaction,
			}),
			db.NotificationLanguage.destroy({
				where: {
					user_id: userId,
					animal_id: 0,
				},
				transaction,
			}),
		])
	}

	static async saveData(
		answers: DailyRecordAnswerRecord[],
		notifications: NotificationRecord[],
		languages: NotificationLanguageRecord[],
		transaction: Transaction,
	): Promise<void> {
		const insertOperations: Promise<unknown>[] = []

		if (answers.length > 0) {
			insertOperations.push(
				db.DailyRecordQuestionAnswer.bulkCreate(answers, { transaction }),
			)
		}

		if (notifications.length > 0) {
			insertOperations.push(
				db.Notification.bulkCreate(notifications, { transaction }),
			)
		}

		if (languages.length > 0) {
			insertOperations.push(
				db.NotificationLanguage.bulkCreate(languages, { transaction }),
			)
		}

		if (insertOperations.length > 0) {
			await Promise.all(insertOperations)
		}
	}
}
