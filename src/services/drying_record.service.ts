import db from '@/config/database'
import { QueryTypes } from 'sequelize'
import type { AnimalQuestionAnswerAttributes } from '@/models/animal_question_answers.model'

// Define the type for lactation yield history attributes
interface LactationYieldHistoryInput {
	user_id: number
	animal_id: number
	animal_number: string
	created_at: Date
	date: Date
	pregnancy_status: string
	lactating_status: string | null
}

// Define the type for drying record query result
interface DryingRecordQuestionRow {
	question_id: number
	question: string
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number
	category_language_name: string
	sub_category_language_name: string | null
	language_hint: string | null
	form_type_id: number
	date: string | null
	master_question: string
	animal_id: number
	validation_rule: string | null
	form_type: string | null
	answer: string | null
	form_type_value: string | null
	language_form_type_value: string | null
	constant_value: number | null
	question_tag: number | null
	created_at: string | null
	question_unit: number | null
	animal_number: string
}

interface DryingRecordGrouped {
	animal_id: number
	validation_rule: string | null
	master_question: string
	language_question: string
	question_id: number
	form_type: string | null
	date: string | null
	answer: string | null
	form_type_value: string | null
	language_form_type_value: string | null
	constant_value: number | null
	question_tag: number | null
	question_unit: number | null
	answer_date: string | null
	animal_number: string
	hint: string | null
}

export class DryingRecordService {
	static async updateDryingRecord(
		user_id: number,
		animal_id: number,
		animal_num: string,
		data: {
			answers: { question_id: number; answer: string }[]
		},
	): Promise<void> {
		const lastPregnancy =
			(await this.getLastPregnancyStatus(animal_id, animal_num, user_id)) ??
			null
		const answers = this.buildDryingAnswers(
			data.answers,
			user_id,
			animal_id,
			animal_num,
			lastPregnancy,
		)
		const date_of_drying_off = this.getDryingOffDate(data.answers)
		const lactation_yield = this.buildLactationYield(
			user_id,
			animal_id,
			animal_num,
			date_of_drying_off,
			lastPregnancy,
		)

		const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
		const getTodaysData = await this.getTodayDryingOffData(
			animal_id,
			animal_num,
			user_id,
			currentDate,
		)
		const lastBasicDetailCreatedAt = await this.getLastBasicDetailCreatedAt(
			animal_id,
			animal_num,
			user_id,
		)
		if (lastBasicDetailCreatedAt) {
			await this.updateBasicDetailCreatedAt(
				animal_id,
				animal_num,
				user_id,
				lastBasicDetailCreatedAt,
			)
		}
		const dateExist = await this.getLastQuestionAnswerByTag(
			animal_id,
			animal_num,
			68,
			user_id,
		)

		if (getTodaysData.length > 0) {
			await this.deleteDryingOffDataByCreatedAt(
				animal_id,
				animal_num,
				user_id,
				currentDate,
			)
			await db.AnimalQuestionAnswer.bulkCreate(answers)
		} else if (dateExist && dateExist.answer === date_of_drying_off) {
			await this.deleteDryingOffDataByCreatedAt(
				animal_id,
				animal_num,
				user_id,
				dateExist.created_at,
			)
			await db.AnimalLactationYieldHistory.destroy({
				where: {
					animal_id,
					animal_number: animal_num,
					created_at: dateExist.created_at,
				},
			})
			await db.AnimalQuestionAnswer.bulkCreate(answers)
		} else {
			await db.AnimalQuestionAnswer.bulkCreate(answers)
		}
		await this.insertLactationYieldHistory(lactation_yield)
	}

	private static buildDryingAnswers(
		answers: { question_id: number; answer: string }[],
		user_id: number,
		animal_id: number,
		animal_number: string,
		lastPregnancy: { answer: string | null } | null,
	): AnimalQuestionAnswerAttributes[] {
		const now = new Date()
		const result: AnimalQuestionAnswerAttributes[] = answers.map((v) => ({
			question_id: v.question_id,
			answer: v.answer,
			user_id,
			animal_id,
			created_at: now,
			updated_at: now,
			animal_number,
			logic_value: null,
			status: false,
			id: 0,
		}))
		// Add question_id 9 (No)
		result.push({
			question_id: 9,
			answer: 'No',
			user_id,
			animal_id,
			created_at: now,
			updated_at: now,
			animal_number,
			logic_value: null,
			status: false,
			id: 0,
		})
		// Add question_id 8 (last pregnancy answer)
		result.push({
			question_id: 8,
			answer: lastPregnancy?.answer ? lastPregnancy.answer : '',
			user_id,
			animal_id,
			created_at: now,
			updated_at: now,
			animal_number,
			logic_value: null,
			status: false,
			id: 0,
		})
		return result
	}

	private static getDryingOffDate(
		answers: { question_id: number; answer: string }[],
	): string {
		const drying = answers.find((v) => v.question_id === 55)
		return drying ? drying.answer : ''
	}

	private static buildLactationYield(
		user_id: number,
		animal_id: number,
		animal_number: string,
		date_of_drying_off: string,
		lastPregnancy: { answer: string | null } | null,
	): LactationYieldHistoryInput {
		return {
			user_id,
			animal_id,
			animal_number,
			created_at: new Date(),
			date: date_of_drying_off ? new Date(date_of_drying_off) : new Date(),
			pregnancy_status: lastPregnancy?.answer ? lastPregnancy.answer : '',
			lactating_status: date_of_drying_off ? 'No' : null,
		}
	}

	private static async getLastPregnancyStatus(
		animal_id: number,
		animal_number: string,
		user_id: number,
	): Promise<{ answer: string | null } | undefined> {
		const result = await db.sequelize.query(
			`SELECT aqa.answer FROM common_questions cq
       JOIN animal_question_answers aqa ON aqa.question_id = cq.id
       WHERE cq.question_tag = 15
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

	private static async getLastBasicDetailCreatedAt(
		animal_id: number,
		animal_num: string,
		user_id: number,
	): Promise<string | null> {
		const result = await db.sequelize.query(
			`SELECT aqa.created_at FROM animal_question_answers aqa
       JOIN common_questions cq ON cq.id = aqa.question_id
       WHERE cq.category_id = 1
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_num
         AND aqa.status <> 1
       ORDER BY aqa.created_at DESC
       LIMIT 1`,
			{
				replacements: { user_id, animal_id, animal_num },
				type: QueryTypes.SELECT,
			},
		)
		return (
			(result[0] as { created_at?: string } | undefined)?.created_at ?? null
		)
	}

	private static async updateBasicDetailCreatedAt(
		animal_id: number,
		animal_num: string,
		user_id: number,
		created_at: string,
	): Promise<void> {
		await db.sequelize.query(
			`UPDATE animal_question_answers aqa
       JOIN common_questions cq ON cq.id = aqa.question_id
       SET aqa.created_at = :now
       WHERE aqa.animal_number = :animal_num
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND cq.category_id = 1
         AND cq.question_tag NOT IN (15,16)
         AND aqa.created_at = :created_at`,
			{
				replacements: {
					animal_num,
					user_id,
					animal_id,
					created_at,
					now: new Date(),
				},
				type: QueryTypes.UPDATE,
			},
		)
	}

	private static async getTodayDryingOffData(
		animal_id: number,
		animal_num: string,
		user_id: number,
		currentDate: string,
	): Promise<unknown[]> {
		return await db.sequelize.query(
			`SELECT aqa.* FROM animal_question_answers aqa
       WHERE aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_num
         AND aqa.user_id = :user_id
         AND aqa.created_at = :currentDate`,
			{
				replacements: { animal_id, animal_num, user_id, currentDate },
				type: QueryTypes.SELECT,
			},
		)
	}

	private static async getLastQuestionAnswerByTag(
		animal_id: number,
		animal_num: string,
		questionTag: number,
		user_id: number,
	): Promise<{ answer: string | null; created_at: string } | undefined> {
		const result = await db.sequelize.query(
			`SELECT aqa.answer, aqa.created_at FROM animal_question_answers aqa
       JOIN common_questions cq ON cq.id = aqa.question_id
       WHERE cq.question_tag = :questionTag
         AND aqa.user_id = :user_id
         AND aqa.animal_id = :animal_id
         AND aqa.animal_number = :animal_num
         AND aqa.status <> 1
       ORDER BY aqa.created_at DESC
       LIMIT 1`,
			{
				replacements: { questionTag, user_id, animal_id, animal_num },
				type: QueryTypes.SELECT,
			},
		)
		return result[0] as
			| { answer: string | null; created_at: string }
			| undefined
	}

	private static async deleteDryingOffDataByCreatedAt(
		animal_id: number,
		animal_num: string,
		user_id: number,
		created_at: string,
	): Promise<void> {
		await db.AnimalQuestionAnswer.destroy({
			where: { animal_id, animal_number: animal_num, user_id, created_at },
		})
	}

	private static async insertLactationYieldHistory(
		lactation_yield: LactationYieldHistoryInput,
	): Promise<void> {
		await db.AnimalLactationYieldHistory.create(lactation_yield)
	}

	static async animalDryingRecord(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_num: string,
	): Promise<Record<string, Record<string, DryingRecordGrouped[]>>> {
		// Get latest drying record date
		const [latest] = await db.sequelize.query<{ created_at: string }>(
			`SELECT aqa.created_at
         FROM animal_question_answers aqa
         JOIN common_questions cq ON cq.id = aqa.question_id
        WHERE aqa.animal_id = :animal_id
          AND aqa.user_id = :user_id
          AND aqa.animal_number = :animal_num
          AND aqa.status != 1
          AND cq.category_id = 101
        ORDER BY aqa.created_at DESC
        LIMIT 1`,
			{
				replacements: { animal_id, user_id, animal_num },
				type: QueryTypes.SELECT,
			},
		)

		// Get all drying questions and answers for the latest date (if any)
		const languageQuestions = await db.sequelize.query<DryingRecordQuestionRow>(
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
           ${latest ? 'AND aqa.created_at = :latestDate' : ''}
         LEFT JOIN form_type ft ON ft.id = cq.form_type_id
         JOIN validation_rules vr ON vr.id = cq.validation_rule_id
         JOIN category_language cl ON cl.category_id = cq.category_id AND cl.language_id = 2 AND cl.category_id = 101
         LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id AND scl.language_id = :language_id
        WHERE ql.language_id = :language_id
          AND aq.animal_id = :animal_id
        `,
			{
				replacements: {
					user_id,
					animal_id,
					animal_num,
					language_id,
					...(latest ? { latestDate: latest.created_at } : {}),
				},
				type: QueryTypes.SELECT,
			},
		)

		// Group results
		const resData: Record<string, Record<string, DryingRecordGrouped[]>> = {}
		for (const value of languageQuestions) {
			const cat = value.category_language_name || 'Unknown'
			const subcat = value.sub_category_language_name || 'Unknown'
			if (!resData[cat]) resData[cat] = {}
			if (!resData[cat][subcat]) resData[cat][subcat] = []
			resData[cat][subcat].push({
				animal_id: value.animal_id,
				validation_rule: value.validation_rule ?? null,
				master_question: value.master_question,
				language_question: value.question,
				question_id: value.question_id,
				form_type: value.form_type ?? null,
				date: value.date ?? null,
				answer: value.answer ?? null,
				form_type_value: value.form_type_value ?? null,
				language_form_type_value: value.language_form_type_value ?? null,
				constant_value: value.constant_value ?? null,
				question_tag: value.question_tag ?? null,
				question_unit: value.question_unit ?? null,
				answer_date: value.created_at ?? null,
				animal_number: value.animal_number,
				hint: value.language_hint ?? null,
			})
		}
		return resData
	}

	static async userAnimalAllAnswersOfDryingRecord(
		user_id: number,
		animal_id: number,
		language_id: number,
		animal_num: string,
	): Promise<Array<{ type_of_drying?: string; date_of_drying?: string }>> {
		const languageQuestions = await db.sequelize.query<{
			question_id: number
			category_id: number
			category_language_name: string
			answer: string
			question_tag: number
			created_at: string
			animal_number: string
		}>(
			`SELECT aqa.question_id, cq.category_id, cl.category_language_name, aqa.answer, cq.question_tag, aqa.created_at, aqa.animal_number
         FROM common_questions cq
         JOIN question_language ql ON cq.id = ql.question_id
         LEFT JOIN animal_question_answers aqa ON cq.id = aqa.question_id
           AND aqa.user_id = :user_id
           AND aqa.animal_id = :animal_id
           AND aqa.animal_number = :animal_num
         JOIN category_language cl ON cl.category_id = cq.category_id AND cl.language_id = 2 AND cl.category_id = 101
        WHERE ql.language_id = :language_id
          AND aqa.animal_id = :animal_id
          AND cq.question_tag IN (67, 68)
        ORDER BY aqa.created_at DESC`,
			{
				replacements: { user_id, animal_id, animal_num, language_id },
				type: QueryTypes.SELECT,
			},
		)

		// Group by created_at
		const record_drying: Record<
			string,
			{ type_of_drying?: string; date_of_drying?: string }
		> = {}
		for (const value of languageQuestions) {
			if (value.question_tag === 67) {
				record_drying[value.created_at] = record_drying[value.created_at] || {}
				record_drying[value.created_at].type_of_drying = value.answer
			} else if (value.question_tag === 68) {
				record_drying[value.created_at] = record_drying[value.created_at] || {}
				record_drying[value.created_at].date_of_drying = value.answer
			}
		}
		return Object.values(record_drying)
	}
}
