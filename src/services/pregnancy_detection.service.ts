import db from '@/config/database'
import { QueryTypes } from 'sequelize'
import type { AnimalQuestionAnswerAttributes } from '@/models/animal_question_answers.model'

// Types for query results
interface PregnancyDetectionQuestion {
	question_id: number
	question: string
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number
	category_language_name: string
	sub_category_language_name: string | null
	language_hint: string | null
	form_type_id: number | null
	date: string | null
	master_question: string
	animal_id: number
	validation_rule: string | null
	form_type: string | null
	answer: string | null
	form_type_value: string | null
	language_form_type_value: string | null
	constant_value: string | null
	question_tag: number | null
	created_at: string | null
	question_unit: string | null
	animal_number: string
}

interface PregnancyDetectionAnswer {
	question_id: number
	category_id: number
	category_language_name: string
	answer: string | null
	question_tag: number
	created_at: string
	animal_number: string
}

export class PregnancyDetectionService {
	static async updatePregnancyDetection(
		user_id: number,
		animal_id: number,
		animal_num: string,
		data: {
			answers: { question_id: number; answer: string }[]
			animal_id?: number
			animal_number?: string
			date?: string
		},
	): Promise<void> {
		const animal_number = data.animal_number ?? animal_num
		const date = data.date ? new Date(data.date) : new Date()
		const lastLactation = await this.getLastLactationStatus(
			animal_id,
			animal_number,
			user_id,
		)
		let date_of_pregnancy_detected = ''
		let pregnancy_detected_status = ''
		let updateBasic = false
		const answers: AnimalQuestionAnswerAttributes[] = []
		for (const value of data.answers) {
			answers.push({
				question_id: value.question_id,
				answer: value.answer,
				user_id,
				animal_id,
				created_at: date,
				updated_at: date,
				animal_number,
				logic_value: null,
				status: false,
				id: 0,
			})
			if (value.question_id === 56 && value.answer.toLowerCase() === 'yes') {
				updateBasic = true
				pregnancy_detected_status = value.answer
				answers.push({
					question_id: 8,
					answer: 'Yes',
					user_id,
					animal_id,
					created_at: date,
					updated_at: date,
					animal_number,
					logic_value: null,
					status: false,
					id: 0,
				})
				answers.push({
					question_id: 9,
					answer: lastLactation?.answer ?? '',
					user_id,
					animal_id,
					created_at: date,
					updated_at: date,
					animal_number,
					logic_value: null,
					status: false,
					id: 0,
				})
			}
			if (value.question_id === 57) {
				date_of_pregnancy_detected = value.answer
			}
		}
		const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
		const getTodaysData = await this.getTodayPregnancyDetectionData(
			animal_id,
			animal_number,
			user_id,
			currentDate,
		)
		const lastBasicDetailCreatedAt = await this.getLastBasicDetailCreatedAt(
			animal_id,
			animal_number,
			user_id,
		)
		if (lastBasicDetailCreatedAt && updateBasic) {
			await this.updateBasicDetailCreatedAt(
				animal_id,
				animal_number,
				user_id,
				lastBasicDetailCreatedAt,
			)
		}
		const dateExist = await this.getLastQuestionAnswerByTag(
			animal_id,
			animal_number,
			70,
			user_id,
		)
		if (getTodaysData.length > 0) {
			await this.deletePregnancyDetectionDataByCreatedAt(
				animal_id,
				animal_number,
				user_id,
				currentDate,
			)
			await db.AnimalQuestionAnswer.bulkCreate(answers)
		} else if (dateExist && dateExist.answer === date_of_pregnancy_detected) {
			await this.deletePregnancyDetectionDataByCreatedAt(
				animal_id,
				animal_number,
				user_id,
				dateExist.created_at,
			)
			await db.AnimalLactationYieldHistory.destroy({
				where: {
					animal_id,
					animal_number,
					created_at: dateExist.created_at,
				},
			})
			await db.AnimalQuestionAnswer.bulkCreate(answers)
		} else {
			await db.AnimalQuestionAnswer.bulkCreate(answers)
		}
		await db.AnimalLactationYieldHistory.create({
			user_id,
			animal_id,
			animal_number,
			created_at: date,
			date: date_of_pregnancy_detected
				? new Date(date_of_pregnancy_detected)
				: date,
			pregnancy_status: pregnancy_detected_status || null,
			lactating_status: lastLactation?.answer ?? null,
		})
	}

	private static async getLastLactationStatus(
		animal_id: number,
		animal_number: string,
		user_id: number,
	): Promise<{ answer: string | null } | undefined> {
		const result = await db.sequelize.query(
			`SELECT aqa.answer FROM common_questions cq
       JOIN animal_question_answers aqa ON aqa.question_id = cq.id
       WHERE cq.question_tag = 16
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_number
         AND aqa.status <> 1
       ORDER BY aqa.created_at DESC
       LIMIT 1`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)
		return result[0] as { answer: string | null } | undefined
	}
	private static async getTodayPregnancyDetectionData(
		animal_id: number,
		animal_number: string,
		user_id: number,
		currentDate: string,
	): Promise<unknown[]> {
		return await db.sequelize.query(
			`SELECT aqa.* FROM animal_question_answers aqa
       WHERE aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_number
         AND aqa.user_id = :user_id
         AND aqa.created_at = :currentDate`,
			{
				replacements: { animal_id, animal_number, user_id, currentDate },
				type: QueryTypes.SELECT,
			},
		)
	}
	private static async deletePregnancyDetectionDataByCreatedAt(
		animal_id: number,
		animal_number: string,
		user_id: number,
		created_at: string,
	): Promise<void> {
		await db.AnimalQuestionAnswer.destroy({
			where: { animal_id, animal_number, user_id, created_at },
		})
	}
	private static async getLastBasicDetailCreatedAt(
		animal_id: number,
		animal_number: string,
		user_id: number,
	): Promise<string | null> {
		const result = await db.sequelize.query(
			`SELECT aqa.created_at FROM animal_question_answers aqa
       JOIN common_questions cq ON cq.id = aqa.question_id
       WHERE cq.category_id = 1
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_number
         AND aqa.status <> 1
       ORDER BY aqa.created_at DESC
       LIMIT 1`,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)
		return (
			(result[0] as { created_at?: string } | undefined)?.created_at ?? null
		)
	}
	private static async updateBasicDetailCreatedAt(
		animal_id: number,
		animal_number: string,
		user_id: number,
		created_at: string,
	): Promise<void> {
		await db.sequelize.query(
			`UPDATE animal_question_answers aqa
       JOIN common_questions cq ON cq.id = aqa.question_id
       SET aqa.created_at = :now
       WHERE aqa.animal_number = :animal_number
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND cq.category_id = 1
         AND cq.question_tag NOT IN (15,16)
         AND aqa.created_at = :created_at`,
			{
				replacements: {
					animal_number,
					user_id,
					animal_id,
					created_at,
					now: new Date(),
				},
				type: QueryTypes.UPDATE,
			},
		)
	}
	private static async getLastQuestionAnswerByTag(
		animal_id: number,
		animal_number: string,
		question_tag: number,
		user_id: number,
	): Promise<{ answer: string; created_at: string } | null> {
		const result = await db.sequelize.query(
			`SELECT aqa.answer, aqa.created_at FROM animal_question_answers aqa
       JOIN common_questions cq ON cq.id = aqa.question_id
       WHERE cq.question_tag = :question_tag
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_number
         AND aqa.status <> 1
       ORDER BY aqa.created_at DESC
       LIMIT 1`,
			{
				replacements: { question_tag, user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)
		return (
			(result[0] as { answer: string; created_at: string } | undefined) ?? null
		)
	}

	static async animalPregnancyDetectionRecord(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_num: string,
	): Promise<Record<string, Record<string, PregnancyDetectionQuestion[]>>> {
		// 1. Get latest created_at for pregnancy detection (category_id = 102)
		const date1Result = await db.sequelize.query<{ created_at?: string }>(
			`SELECT aqa.created_at FROM animal_question_answers aqa
			JOIN common_questions cq ON cq.id = aqa.question_id
			WHERE aqa.animal_id = :animal_id
			AND aqa.user_id = :user_id
			AND aqa.animal_number = :animal_num
			AND aqa.status <> 1
			AND cq.category_id = 102
			ORDER BY aqa.created_at DESC
			LIMIT 1`,
			{
				replacements: { animal_id, user_id, animal_num },
				type: QueryTypes.SELECT,
			},
		)

		const latestCreatedAt: string | undefined = date1Result[0]?.created_at

		// 2. Fetch all relevant questions and answers for this animal, language, and latestCreatedAt
		const languageQuestions =
			await db.sequelize.query<PregnancyDetectionQuestion>(
				`SELECT aq.question_id, ql.question, cq.category_id, cq.sub_category_id, cq.validation_rule_id, cl.category_language_name,
					scl.sub_category_language_name, ql.hint as language_hint, cq.form_type_id, cq.date, cq.question as master_question,
					aq.animal_id, vr.name as validation_rule, ft.name as form_type, aqa.answer, cq.form_type_value, ql.form_type_value as language_form_type_value,
					vr.constant_value, cq.question_tag, aqa.created_at, cq.question_unit, aqa.animal_number
			FROM common_questions cq
			JOIN animal_questions aq ON cq.id = aq.question_id
			JOIN question_language ql ON cq.id = ql.question_id
			LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id
				AND aqa.user_id = :user_id
				AND aqa.animal_id = :animal_id
				AND aqa.animal_number = :animal_num
				${latestCreatedAt ? 'AND aqa.created_at = :latestCreatedAt' : ''}
			LEFT JOIN form_type ft ON ft.id = cq.form_type_id
			JOIN validation_rules vr ON vr.id = cq.validation_rule_id
			JOIN category_language cl ON cl.category_id = cq.category_id AND cl.language_id = :language_id AND cl.category_id = 102
			LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id AND scl.language_id = :language_id
			WHERE ql.language_id = :language_id
			AND aq.animal_id = :animal_id
			ORDER BY cq.category_id, cq.sub_category_id, aq.question_id`,
				{
					replacements: {
						user_id,
						animal_id,
						animal_num,
						language_id,
						...(latestCreatedAt ? { latestCreatedAt } : {}),
					},
					type: QueryTypes.SELECT,
				},
			)

		// 3. Group by category_language_name and sub_category_language_name
		const resData: Record<
			string,
			Record<string, PregnancyDetectionQuestion[]>
		> = {}
		for (const value of languageQuestions) {
			const cat = value.category_language_name
			const subcat = value.sub_category_language_name || 'default'
			if (!resData[cat]) resData[cat] = {}
			if (!resData[cat][subcat]) resData[cat][subcat] = []
			resData[cat][subcat].push({ ...value })
		}
		return resData
	}

	static async userAnimalAllAnswersOfPregnancyDetection(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_num: string,
	): Promise<
		{ pregnancy_detected?: string; pregnancy_detection_date?: string }[]
	> {
		// Fetch all answers for question_tag 69, 70 for this animal
		const languageQuestions =
			await db.sequelize.query<PregnancyDetectionAnswer>(
				`SELECT aqa.question_id, cq.category_id, cl.category_language_name, aqa.answer, cq.question_tag, aqa.created_at, aqa.animal_number
			FROM common_questions cq
			JOIN question_language ql ON cq.id = ql.question_id
			LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id
				AND aqa.user_id = :user_id
				AND aqa.animal_id = :animal_id
				AND aqa.animal_number = :animal_num
			JOIN category_language cl ON cl.category_id = cq.category_id AND cl.language_id = :language_id AND cl.category_id = 102
			WHERE ql.language_id = :language_id
			AND aqa.animal_id = :animal_id
			AND cq.question_tag IN (69, 70)
			ORDER BY aqa.created_at DESC`,
				{
					replacements: { user_id, animal_id, animal_num, language_id },
					type: QueryTypes.SELECT,
				},
			)

		// Group by created_at
		const record_pregnancy_detection: Record<
			string,
			{ pregnancy_detected?: string; pregnancy_detection_date?: string }
		> = {}
		for (const value of languageQuestions) {
			if (!value.created_at) continue
			if (!record_pregnancy_detection[value.created_at]) {
				record_pregnancy_detection[value.created_at] = {}
			}
			if (value.question_tag === 69) {
				record_pregnancy_detection[value.created_at].pregnancy_detected =
					value.answer ?? undefined
			} else if (value.question_tag === 70) {
				record_pregnancy_detection[value.created_at].pregnancy_detection_date =
					value.answer ?? undefined
			}
		}
		return Object.values(record_pregnancy_detection)
	}
}
