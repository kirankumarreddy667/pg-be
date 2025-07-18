import db from '@/config/database'
import { Op, QueryTypes } from 'sequelize'
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

// Helper: Add delivery dates for unmapped dates
function addUnmappedDeliveryDates(
	resData: { delivery_date: string }[],
	date: string,
	count: number,
): void {
	for (let i = 0; i < count; i++) {
		resData.push({ delivery_date: date })
	}
}

// Helper: Add delivery dates for mapped dates with insufficient mapping count
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

	private static buildDeliveryDatesResult(
		mappedDate: string[],
		animalAnswers: string[],
		mappedDateCount: Record<string, number>,
		answerCount: Record<string, number>,
	): { delivery_date: string }[] {
		const resData: { delivery_date: string }[] = []
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
		} else {
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
			where: { user_id, animal_id, mother_animal_number: animal_number },
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
       AND aqa.animal_number = :animal_number`,
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
	): Promise<string[]> {
		// 1. Get all mapped calf numbers for this user/animal
		const mappedCalfRows = await db.AnimalMotherCalf.findAll({
			where: { user_id, animal_id },
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
       AND aqa.animal_number <> :animal_number`,
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
		return calfs.map((row) => row.animal_number)
	}

	static async getAnimalLactationStatus(
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
        WHERE cq.question_tag = 16
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
		user_id: number | undefined,
		data: {
			animal_id: number
			delivery_date: string
			mother_animal_number: string
			calf_animal_number: string
		},
	): Promise<{ status: number; message: string; data: [] }> {
		if (!user_id) {
			return { status: 401, message: 'User not found', data: [] }
		}
		const exists = await db.AnimalMotherCalf.findOne({
			where: {
				user_id,
				animal_id: data.animal_id,
				mother_animal_number: data.mother_animal_number,
				calf_animal_number: data.calf_animal_number,
				delivery_date: data.delivery_date,
			},
		})
		if (exists) {
			return {
				status: 206,
				message: 'This animal mother is already mapped with animal calf',
				data: [],
			}
		}
		await db.AnimalMotherCalf.create({
			user_id,
			animal_id: data.animal_id,
			delivery_date: new Date(data.delivery_date.slice(0, 10)),
			mother_animal_number: data.mother_animal_number,
			calf_animal_number: data.calf_animal_number,
		})
		return { status: 201, message: 'Success', data: [] }
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
	): Promise<Record<string, string>> {
		const rows = await db.sequelize.query<{
			answer: string
			answer_date: string
		}>(
			`SELECT aqa.answer, aqa.created_at as answer_date
     FROM common_questions cq
     JOIN animal_question_answers aqa ON aqa.question_id = cq.id
     WHERE cq.question_tag = :question_tag
       AND aqa.user_id = :user_id
       AND aqa.animal_id = :animal_id
       AND aqa.animal_number = :animal_number
       AND aqa.status != 1`,
			{
				replacements: { user_id, animal_id, animal_number, question_tag },
				type: QueryTypes.SELECT,
			},
		)
		const result: Record<string, string> = {}
		for (const row of rows) {
			result[row.answer_date] = row.answer
		}
		return result
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
			answer_date: string
		}[]
	> {
		// Fetch answers for each tag
		const [dateOfAI, noOfBull, semenCompanyName, bullMotherYield] =
			await Promise.all([
				this.fetchAIAnswers(user_id, animal_id, animal_number, 23),
				this.fetchAIAnswers(user_id, animal_id, animal_number, 35),
				this.fetchAIAnswers(user_id, animal_id, animal_number, 42),
				this.fetchAIAnswers(user_id, animal_id, animal_number, 14),
			])
		// Collect all unique answer_dates
		const allDates = new Set([
			...Object.keys(dateOfAI),
			...Object.keys(noOfBull),
			...Object.keys(semenCompanyName),
			...Object.keys(bullMotherYield),
		])
		// Merge results by date
		const res: {
			date_of_AI: string
			bull_no: string
			mother_yield: string
			semen_company: string
			answer_date: string
		}[] = []
		for (const answer_date of allDates) {
			res.push({
				date_of_AI: dateOfAI[answer_date] ?? '',
				bull_no: noOfBull[answer_date] ?? '',
				mother_yield: bullMotherYield[answer_date] ?? '',
				semen_company: semenCompanyName[answer_date] ?? '',
				answer_date,
			})
		}
		// Sort by answer_date descending
		res.sort((a, b) => b.answer_date.localeCompare(a.answer_date))
		return res
	}
}
