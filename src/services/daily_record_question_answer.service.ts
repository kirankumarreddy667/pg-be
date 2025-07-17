import db from '@/config/database'
import { DailyRecordQuestionAnswer } from '@/models/daily_record_question_answer.model'
import {
	Notification,
	NotificationAttributes,
} from '@/models/notification.model'
import {
	NotificationLanguage,
	NotificationLanguageAttributes,
} from '@/models/notification_language.model'
import { QueryTypes } from 'sequelize'

interface AnswerInput {
	question_id: number
	answer: string
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

interface DailyRecordQuestionWithAnswerRow {
	question_id: number
	master_question: string
	category_language_name: string
	sub_category_language_name: string | null
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
	sequence_number: number
	langauge_hint: string | null
	validation_rule: string
}

export class DailyRecordQuestionAnswerService {
	static async createAnswers(
		data: CreateDailyRecordAnswerInput,
	): Promise<{ message: string }> {
		const { answers, date, user_id } = data
		const answerRecords = this.buildAnswerRecords(answers, date, user_id)
		const notificationData: NotificationAttributes[] = []
		const notificationLanguage: NotificationLanguageAttributes[] = []

		for (const value of answers) {
			await this.handleDewormingNotifications(
				value,
				date,
				user_id,
				notificationData,
				notificationLanguage,
			)
			await this.handleBioSecuritySprayNotifications(
				value,
				date,
				user_id,
				notificationData,
				notificationLanguage,
			)
		}

		await this.deleteExistingAnswersAndNotifications(user_id, date)
		await DailyRecordQuestionAnswer.bulkCreate(answerRecords)
		await this.insertNotifications(notificationData, notificationLanguage)
		return { message: 'Success' }
	}

	static buildAnswerRecords(
		answers: AnswerInput[],
		date: string,
		user_id: number,
	): Omit<DailyRecordQuestionAnswer, 'id'>[] {
		const answerDate = new Date(date)
		return answers.map(
			(value) =>
				({
					daily_record_question_id: value.question_id,
					answer: JSON.stringify(value.answer),
					user_id,
					answer_date: answerDate,
					created_at: new Date(),
					updated_at: new Date(),
				}) as Omit<DailyRecordQuestionAnswer, 'id'>,
		)
	}

	static async handleDewormingNotifications(
		value: AnswerInput,
		date: string,
		user_id: number,
		notificationData: NotificationAttributes[],
		notificationLanguage: NotificationLanguageAttributes[],
	): Promise<void> {
		const deWormingTag = await db.QuestionTagMapping.findOne({
			where: { question_id: value.question_id, question_tag_id: 48 },
		})
		if (deWormingTag) {
			const answer = value.answer.toLowerCase()
			if (answer === 'yes') {
				const deWormingDate = new Date(
					new Date(date).getTime() + 90 * 24 * 60 * 60 * 1000,
				)
				const deWormingDateDisplay = deWormingDate.toLocaleDateString('en-GB', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				})
				notificationData.push({
					user_id,
					animal_id: 0,
					animal_number: '',
					message: `Deworming is due on ${deWormingDateDisplay}`,
					send_notification_date: deWormingDate,
					created_at: new Date(),
					updated_at: new Date(),
				})
				notificationLanguage.push(
					{
						user_id,
						language_id: 2,
						langauge_message: `Deworming is due on ${deWormingDateDisplay}`,
						heading: 'Deworming',
						send_notification_date: deWormingDate,
						animal_id: 0,
						animal_number: '',
						status: 0,
						days_before: 7,
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						user_id,
						language_id: 1,
						langauge_message: `डिवर्मिंग अपेक्षित ${deWormingDateDisplay}`,
						heading: 'डी वर्मिंग',
						send_notification_date: deWormingDate,
						animal_id: 0,
						animal_number: '',
						status: 0,
						days_before: 7,
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						user_id,
						language_id: 19,
						langauge_message: `जंताचे औषध देणे अपेक्षित ${deWormingDateDisplay}`,
						heading: 'जंताचे औषध',
						send_notification_date: deWormingDate,
						animal_id: 0,
						animal_number: '',
						status: 0,
						days_before: 7,
						created_at: new Date(),
						updated_at: new Date(),
					},
				)
			}
		}
	}

	static async handleBioSecuritySprayNotifications(
		value: AnswerInput,
		date: string,
		user_id: number,
		notificationData: NotificationAttributes[],
		notificationLanguage: NotificationLanguageAttributes[],
	): Promise<void> {
		const bioSecuritySpray = await db.QuestionTagMapping.findOne({
			where: { question_id: value.question_id, question_tag_id: 47 },
		})
		if (bioSecuritySpray) {
			const answer = value.answer.toLowerCase()
			if (answer === 'yes') {
				const sprayDate = new Date(
					new Date(date).getTime() + 30 * 24 * 60 * 60 * 1000,
				)
				const sprayDateDisplay = sprayDate.toLocaleDateString('en-GB', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				})
				notificationData.push({
					user_id,
					animal_id: 0,
					animal_number: '',
					message: `Biosecurity spray is due on ${sprayDateDisplay}`,
					send_notification_date: sprayDate,
					created_at: new Date(),
					updated_at: new Date(),
				})
				notificationLanguage.push(
					{
						user_id,
						language_id: 2,
						langauge_message: `Biosecurity spray is due on ${sprayDateDisplay}`,
						heading: 'BioSecurity Spray',
						send_notification_date: sprayDate,
						animal_id: 0,
						animal_number: '',
						status: 0,
						days_before: 7,
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						user_id,
						language_id: 1,
						langauge_message: `बायोसिक्योरिटी स्प्रे अपेक्षित ${sprayDateDisplay}`,
						heading: 'निर्जंतुकीकरण स्प्रे',
						send_notification_date: sprayDate,
						animal_id: 0,
						animal_number: '',
						status: 0,
						days_before: 7,
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						user_id,
						language_id: 19,
						langauge_message: `निर्जंतुकीकरण फवारणी अपेक्षित ${sprayDateDisplay}`,
						heading: 'निर्जंतुकीकरण फवारणी ',
						send_notification_date: sprayDate,
						animal_id: 0,
						animal_number: '',
						status: 0,
						days_before: 7,
						created_at: new Date(),
						updated_at: new Date(),
					},
				)
			}
		}
	}

	static async deleteExistingAnswersAndNotifications(
		user_id: number,
		date: string,
	): Promise<void> {
		await DailyRecordQuestionAnswer.destroy({
			where: { user_id, answer_date: new Date(date) },
		})
		const notifications = await Notification.findAll({ where: { user_id } })
		const dailyIds = notifications
			.filter(
				(n: { message: string }) =>
					n.message.includes('Deworming is due on') ||
					n.message.includes('Biosecurity spray is due on'),
			)
			.map((n: { id: number }) => n.id)
		if (dailyIds.length) {
			await Notification.destroy({ where: { id: dailyIds } })
		}
		await NotificationLanguage.destroy({ where: { user_id, animal_id: 0 } })
	}

	static async insertNotifications(
		notificationData: NotificationAttributes[],
		notificationLanguage: NotificationLanguageAttributes[],
	): Promise<void> {
		if (notificationData.length) {
			await Notification.bulkCreate(notificationData)
		}
		if (notificationLanguage.length) {
			await NotificationLanguage.bulkCreate(notificationLanguage)
		}
	}

	static async updateAnswers(
		user_id: number,
		answers: UpdateAnswerInput[],
	): Promise<{ message: string }> {
		for (const value of answers) {
			await DailyRecordQuestionAnswer.update(
				{
					answer: JSON.stringify(value.answer),
					updated_at: new Date(),
				},
				{
					where: {
						user_id,
						id: value.daily_record_answer_id,
					},
				},
			)
		}
		return { message: 'Success' }
	}

	static async getDailyRecordQuestionsWithAnswers(
		user_id: number,
		language_id: number,
		date: string,
	): Promise<
		Record<string, Record<string, DailyRecordQuestionWithAnswerRow[]>>
	> {
		const result = await db.sequelize.query(
			`SELECT drq.id as question_id, drq.question as master_question, cl.category_language_name, scl.sub_category_language_name, ft.name as form_type, drq.form_type_value, dql.created_at,
        drqa.answer, dql.question, dql.form_type_value as language_form_type_value, vr.constant_value, drq.question_tag, drq.delete_status,
        drq.question_unit, drq.hint, c.sequence_number, dql.hint as langauge_hint, vr.name as validation_rule
      FROM daily_record_questions drq
      JOIN category_language cl ON cl.category_id = drq.category_id AND cl.language_id = :language_id
      LEFT JOIN sub_category_language scl ON scl.sub_category_id = drq.sub_category_id AND scl.language_id = :language_id
      JOIN daily_record_question_language dql ON dql.daily_record_question_id = drq.id
      JOIN validation_rules vr ON vr.id = drq.validation_rule_id
      LEFT JOIN form_type ft ON ft.id = drq.form_type_id
      LEFT JOIN daily_record_question_answer drqa ON drq.id = drqa.daily_record_question_id AND drqa.user_id = :user_id AND DATE(drqa.answer_date) = :date
      JOIN categories c ON c.id = drq.category_id
      WHERE dql.language_id = :language_id AND drq.delete_status != 1
      ORDER BY c.sequence_number ASC, dql.created_at ASC`,
			{
				replacements: { language_id, user_id, date },
				type: QueryTypes.SELECT,
			},
		)
		const questions = result[0] as DailyRecordQuestionWithAnswerRow[]
		const resData: Record<
			string,
			Record<string, DailyRecordQuestionWithAnswerRow[]>
		> = {}
		for (const value of questions) {
			const cat = value.category_language_name || 'Unknown'
			const subcat = value.sub_category_language_name || 'Unknown'
			if (!resData[cat]) resData[cat] = {}
			if (!resData[cat][subcat]) resData[cat][subcat] = []
			// Parse answer if present
			const parsedValue = {
				...value,
				answer: value.answer ? (JSON.parse(value.answer) as string) : null,
			}
			resData[cat][subcat].push(parsedValue)
		}
		return resData
	}

	static async getBioSecuritySprayDetails(
		user_id: number,
	): Promise<{ message: string; data: { date: string; due_date: string }[] }> {
		const biosecurityData = await db.sequelize.query(
			`SELECT drq.answer, drq.answer_date
       FROM question_tag_mapping qtm
       JOIN daily_record_question_answer drq ON drq.daily_record_question_id = qtm.question_id
       WHERE qtm.question_tag_id = 47 AND drq.user_id = :user_id
       ORDER BY drq.answer_date DESC`,
			{
				replacements: { user_id },
				type: QueryTypes.SELECT,
			},
		)
		const resData: { date: string; due_date: string }[] = []
		for (const value of biosecurityData as {
			answer: string
			answer_date: string
		}[]) {
			if (value?.answer?.toLowerCase() === 'yes') {
				const answerDate = new Date(value.answer_date)
				const dueDate = new Date(
					answerDate.getTime() + 30 * 24 * 60 * 60 * 1000,
				)
				resData.push({
					date: answerDate.toISOString(),
					due_date: dueDate.toISOString(),
				})
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
       JOIN daily_record_question_answer drq ON drq.daily_record_question_id = qtm.question_id
       WHERE qtm.question_tag_id = 48 AND drq.user_id = :user_id
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
			if (value?.answer?.toLowerCase() === 'yes') {
				const answerDate = new Date(value.answer_date)
				const dueDate = new Date(
					answerDate.getTime() + 90 * 24 * 60 * 60 * 1000,
				)
				resData.push({
					date: answerDate.toISOString(),
					due_date: dueDate.toISOString(),
				})
			}
		}
		return { message: 'success', data: resData }
	}
}
