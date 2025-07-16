import db from '@/config/database'
import { Op } from 'sequelize'
import { AppError } from '@/utils/errors'

type ConstantValue = string | number | null
type answer = string | number | null
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
	question_tag: string | null
	question_unit: string | null
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

// Add interfaces for Sequelize query results
interface AnimalQuestionWithMeta {
	animal_id: number
	Answers?: {
		answer?: answer
		created_at?: Date
	}[]
	CommonQuestion?: {
		id: number
		question: string
		date: boolean
		form_type_value: string | null
		FormType?: { name: string } | null
		ValidationRule?: {
			name: string
			constant_value: ConstantValue
		} | null
		CategoryLanguage?: { category_language_name: string } | null
		SubCategoryLanguage?: { sub_category_language_name: string } | null
		QuestionLanguages?: Array<{
			id: number
			question: string
			form_type_value: string | null
			hint: string | null
		}>
		QuestionUnit?: { name: string } | null
		QuestionTag?: { name: string } | null
		created_at: Date
		hint: string | null
	}
}

interface AnimalQuestionAnswerWithCommon {
	animal_id: number
	animal_number: string
	answer: answer
	created_at: Date
	CommonQuestion?: {
		id: number
		question: string
		date: boolean
		form_type_value: string | null
		FormType?: { name: string } | null
		ValidationRule?: {
			name: string
			constant_value: ConstantValue
		} | null
		CategoryLanguage?: { category_language_name: string } | null
		QuestionLanguages?: Array<{
			id: number
			question: string
			form_type_value: string | null
			hint: string | null
		}>
		question_tag?: string | null
		question_unit?: string | null
		created_at: Date
		hint: string | null
	}
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

interface AnimalWithName {
	id: number
	name: string
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
	): Promise<void> {
		// Check uniqueness
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
				created_at: answerDate,
				animal_number: data.animal_number,
				logic_value: logicValue,
			})
			answerDate = this.assignGestationProps(gestation, value, answerDate)
		}
		if (!gestation.date) gestation.date = answerDate
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
		await db.AnimalLactationYieldHistory.create({
			...gestation,
			date:
				gestation.date instanceof Date
					? gestation.date
					: new Date(gestation.date ?? answerDate),
			pregnancy_status:
				gestation.pregnancy_status != null
					? String(gestation.pregnancy_status)
					: null,
			lactating_status:
				gestation.lactating_status != null
					? String(gestation.lactating_status)
					: null,
		})
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
		// Find latest answer date for this animal/user/number
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.created_at
		// Find all questions for this animal
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id: Number(animal_id) },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
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
							where: { language_id: Number(language_id) },
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
						user_id: user_id,
						animal_id: Number(animal_id),
						animal_number,
						status: { [Op.ne]: 1 },
						...(answerDate ? { created_at: answerDate } : {}),
					},
					required: false,
				},
			],
		})
		// Group and format result
		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}
		for (const aq of questions as AnimalQuestionWithMeta[]) {
			const cq = aq.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const answer = aq.Answers?.[0]?.answer ?? null
			const answer_date = aq.Answers?.[0]?.created_at ?? null
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
	}): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
		// Find latest answer date for this animal/user/number/category_id=1
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 1 },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.created_at
		// Find all basic details questions for this animal
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id: Number(animal_id) },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 1 },
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
							where: { language_id: Number(language_id), category_id: 1 },
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
						user_id: user_id,
						animal_id: Number(animal_id),
						animal_number,
						status: { [Op.ne]: 1 },
						...(answerDate ? { created_at: answerDate } : {}),
					},
					required: false,
				},
			],
			order: [
				[
					{ model: db.CommonQuestions, as: 'CommonQuestion' },
					'created_at',
					'ASC',
				],
			],
		})
		// Group and format result
		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}
		for (const aq of questions as AnimalQuestionWithMeta[]) {
			const cq = aq.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const answer = aq.Answers?.[0]?.answer ?? null
			const answer_date = aq.Answers?.[0]?.created_at ?? null
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
				question_created_at: cq.created_at,
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
	): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
		const { user_id, animal_id, language_id, animal_number } = params
		// Find latest answer date for this animal/user/number/category_id
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['created_at'],
		})
		const answerDate = latest?.created_at
		// Find all questions for this animal/category
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id: Number(animal_id) },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id },
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
							where: { language_id: Number(language_id), category_id },
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
						user_id: user_id,
						animal_id: Number(animal_id),
						animal_number,
						status: { [Op.ne]: 1 },
						...(answerDate ? { created_at: answerDate } : {}),
					},
					required: false,
				},
			],
			order: [
				[
					{ model: db.CommonQuestions, as: 'CommonQuestion' },
					'created_at',
					'ASC',
				],
			],
		})
		// Group and format result
		const resData: Record<
			string,
			Record<string, GroupedAnimalQuestionAnswer[]>
		> = {}
		for (const aq of questions as AnimalQuestionWithMeta[]) {
			const cq = aq.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const answer = aq.Answers?.[0]?.answer ?? null
			const answer_date = aq.Answers?.[0]?.created_at ?? null
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
				question_created_at: cq.created_at,
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
	}): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
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
	}): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
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
	}): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
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
	}): Promise<Record<string, Record<string, GroupedAnimalQuestionAnswer[]>>> {
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
			typeof animalNumber === 'string' ? animalNumber.toLowerCase() : ''
		const where: { [key: string]: unknown } = {
			user_id: user_id,
			status: { [Op.ne]: 1 },
		}
		if (qry) {
			where.animal_number = { [Op.iLike || Op.like]: `%${qry}%` }
		}
		const animalNumbers = await db.AnimalQuestionAnswer.findAll({
			where,
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			order: [['created_at', 'DESC']],
			raw: true,
		})
		const resData: AnimalNumberResult[] = []
		for (const num of animalNumbers as { animal_number: string }[]) {
			const answer = await db.AnimalQuestionAnswer.findOne({
				where: {
					user_id: user_id,
					animal_number: num.animal_number,
					status: { [Op.ne]: 1 },
				},
				include: [
					{
						model: db.Animal,
						as: 'Animal',
						attributes: ['id', 'name'],
						required: true,
					},
				],
				order: [['created_at', 'DESC']],
			})
			const animal = answer && (answer as { Animal?: AnimalWithName }).Animal
			if (animal) {
				resData.push({
					animal_id: animal.id,
					animal_name: animal.name,
					animal_number: num.animal_number,
				})
			}
		}
		return resData
	}

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
		const now = new Date()
		const today = now.toISOString().slice(0, 10)
		const toDelete = await db.AnimalQuestionAnswer.findAll({
			where: { animal_number, user_id, animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 1 },
				},
			],
		})
		const toDeleteIds = toDelete
			.filter((a) => a.created_at.toISOString().slice(0, 10) === today)
			.map((a) => a.id)
		if (toDeleteIds.length > 0) {
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
		}
		const answerRecords: Array<{
			question_id: number
			answer: string
			user_id: number
			animal_id: number
			created_at: Date
			animal_number: string
			logic_value: string | null
		}> = []
		for (const value of answers) {
			let logicValue: string | null = null
			const ans = String(value.answer).toLowerCase()
			if (['cow', 'गाय', 'ఆవు'].includes(ans)) logicValue = 'cow'
			else if (['calf', 'कालवड', 'बछड़ा', 'దూడ', 'रेडी'].includes(ans))
				logicValue = 'calf'
			else if (['buffalo', 'म्हैस', 'भैंस', 'గేదె'].includes(ans))
				logicValue = 'buffalo'
			answerRecords.push({
				question_id: value.question_id,
				answer: String(value.answer),
				user_id,
				animal_id,
				created_at: now,
				animal_number,
				logic_value: logicValue,
			})
		}
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
	}

	static async updateAnimalBreedingQuestionAnswers({
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
		const toDelete = await db.AnimalQuestionAnswer.findAll({
			where: { animal_number, user_id, animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 2 },
				},
			],
		})
		const toDeleteIds = toDelete
			.filter(
				(a) => a.created_at.toISOString().slice(0, 10) === date.slice(0, 10),
			)
			.map((a) => a.id)
		if (toDeleteIds.length > 0) {
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
		}
		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: new Date(date),
			animal_number,
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
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
		const toDelete = await db.AnimalQuestionAnswer.findAll({
			where: { animal_number, user_id, animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 3 },
				},
			],
		})
		const toDeleteIds = toDelete
			.filter(
				(a) => a.created_at.toISOString().slice(0, 10) === date.slice(0, 10),
			)
			.map((a) => a.id)
		if (toDeleteIds.length > 0) {
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
		}
		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: new Date(date),
			animal_number,
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
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
		const now = new Date()
		const today = now.toISOString().slice(0, 10)
		const toDelete = await db.AnimalQuestionAnswer.findAll({
			where: { animal_number, user_id, animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 4 },
				},
			],
		})
		const toDeleteIds = toDelete
			.filter((a) => a.created_at.toISOString().slice(0, 10) === today)
			.map((a) => a.id)
		if (toDeleteIds.length > 0) {
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
		}
		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: now,
			animal_number,
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
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
		const toDelete = await db.AnimalQuestionAnswer.findAll({
			where: { animal_number, user_id, animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 5 },
				},
			],
		})
		const toDeleteIds = toDelete
			.filter(
				(a) => a.created_at.toISOString().slice(0, 10) === date.slice(0, 10),
			)
			.map((a) => a.id)
		if (toDeleteIds.length > 0) {
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
		}
		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: new Date(date),
			animal_number,
		}))
		await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
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
		date: string
	}): Promise<void> {
		const answerRecords = answers.map((value) => ({
			question_id: value.question_id,
			answer: String(value.answer),
			user_id,
			animal_id,
			created_at: date ? new Date(date) : new Date(),
			animal_number,
			logic_value: null,
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
			})
			if (value.question_id === 51) {
				date_of_heat = String(value.answer)
			}
		}
		const getTodaysData = await db.AnimalQuestionAnswer.findAll({
			where: { animal_number, user_id, animal_id, created_at: now },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 99 },
				},
			],
		})
		const dateExist = await db.AnimalQuestionAnswer.findOne({
			where: { animal_id, animal_number },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 64 },
				},
			],
			order: [['created_at', 'DESC']],
		})
		if (getTodaysData.length > 0) {
			const toDeleteIds = getTodaysData.map((a) => a.id)
			await db.AnimalQuestionAnswer.destroy({ where: { id: toDeleteIds } })
			await db.AnimalQuestionAnswer.bulkCreate(answerRecords)
		} else if (dateExist && dateExist.answer === date_of_heat) {
			await db.AnimalQuestionAnswer.destroy({
				where: { animal_id, animal_number, created_at: dateExist.created_at },
			})
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
	}): Promise<Record<string, GroupedAnimalQuestionAnswer[]>> {
		// Step 1: Find the latest answer (by value) for this animal/user/number/category_id=99
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 99 },
				},
			],
			order: [['answer', 'DESC']],
			attributes: ['answer'],
		})

		let answerFilter: Record<string, unknown> = {}
		if (latest?.answer) {
			answerFilter = { answer: latest.answer }
		}

		// Step 2: Get all questions and answers for this animal/user/number/category_id=99
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id: Number(animal_id) },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 99 },
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
							where: { language_id: Number(language_id), category_id: 99 },
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
						user_id: user_id,
						animal_id: Number(animal_id),
						animal_number,
						status: { [Op.ne]: 1 },
						...answerFilter,
					},
					required: false,
				},
			],
		})

		// Step 3: Group and format result
		const resData: Record<string, GroupedAnimalQuestionAnswer[]> = {}
		for (const aq of questions as AnimalQuestionWithMeta[]) {
			const cq = aq.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const answer = aq.Answers?.[0]?.answer ?? null
			const answer_date = aq.Answers?.[0]?.created_at ?? null
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = []
			resData[categoryName].push({
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
				question_created_at: cq.created_at,
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
	}): Promise<Record<string, GroupedAnimalQuestionAnswer[]>> {
		// Step 1: Find the latest answer (by value) for this animal/user/number/category_id=99
		const latest = await db.AnimalQuestionAnswer.findOne({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 99 },
				},
			],
			order: [['answer', 'DESC']],
			attributes: ['answer'],
		})

		let answerFilter: Record<string, unknown> = {}
		if (latest?.answer) {
			answerFilter = { answer: { [Op.ne]: latest.answer } }
		}

		// Step 2: Get all previous answers for this animal/user/number/category_id=99, question_tag=64, excluding latest answer
		const answers = await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_id: Number(animal_id),
				user_id: user_id,
				animal_number,
				status: { [Op.ne]: 1 },
				...answerFilter,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 99, question_tag: 64 },
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
							where: { language_id: Number(language_id), category_id: 99 },
							attributes: ['category_language_name'],
							required: true,
						},
					],
				},
			],
			order: [['answer', 'DESC']],
		})

		// Step 3: Group and format result
		const resData: Record<string, GroupedAnimalQuestionAnswer[]> = {}
		for (const aqa of answers as AnimalQuestionAnswerWithCommon[]) {
			const cq = aqa.CommonQuestion
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const categoryKey = cq.CategoryLanguage?.category_language_name
				? cq.CategoryLanguage.category_language_name
						.toLowerCase()
						.replace(/ /g, '_')
				: 'uncategorized'
			if (!resData[categoryKey]) resData[categoryKey] = []
			resData[categoryKey].push({
				animal_id: aqa.animal_id,
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql?.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				answer: aqa.answer,
				form_type_value: cq.form_type_value ?? null,
				language_form_type_value: ql?.form_type_value ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? null,
				question_tag: cq.question_tag ?? null,
				question_unit: cq.question_unit ?? null,
				answer_date: aqa.created_at ?? null,
				animal_number: aqa.animal_number,
				hint: ql?.hint ?? null,
				question_created_at: cq.created_at,
			})
		}
		return resData
	}
}
