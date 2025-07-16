import db from '@/config/database'
import type { Model } from 'sequelize'
import type { DailyRecordQuestionAttributes } from '@/models/daily_record_questions.model'
import type { DailyRecordQuestionLanguageAttributes } from '@/models/daily_record_question_language.model'

type QuestionInput = {
	question: string
	form_type_id: number
	validation_rule_id: number
	date?: boolean
	form_type_value?: string
	question_tag: number[]
	question_unit: number
	hint?: string
	sequence_number?: number
}

type CreateDailyRecordQuestionsInput = {
	category_id: number
	sub_category_id?: number
	language_id: number
	questions: QuestionInput[]
}

interface DailyRecordQuestionJoined {
	id: number
	question: string
	date: boolean
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number
	form_type_id: number
	form_type_value: string | null
	question_tag: number
	question_unit: number
	delete_status: boolean
	Category?: { name: string }
	Subcategory?: { name: string }
	ValidationRule?: { name: string; constant_value: number }
	FormType?: { name: string }
	QuestionTag?: { name: string }
	QuestionUnit?: { name: string }
	hint?: string | null
}

interface QuestionTagMappingWithTag {
	question_id: number
	QuestionTag?: { id: number; name: string }
}

export interface UpdateDailyRecordQuestionInput {
	category_id: number
	sub_category_id?: number | null
	question: string
	validation_rule_id: number
	form_type_id: number
	date: boolean
	form_type_value?: string | null
	question_tag_id: number[]
	question_unit_id: number
	hint?: string | null
}

// Define a type for the grouped question data returned by grouping functions
interface GroupedQuestion {
	question: string
	form_type: string | undefined
	validation_rule: string | undefined
	daily_record_question_id: number
	date: boolean
	category_id: number
	sub_category_id: number | null
	validation_rule_id: number
	form_type_id: number
	form_type_value: string | null
	question_tag: string | null
	question_unit: string | null
	constant_value: number | undefined
	question_tag_id: number
	question_unit_id: number
	delete_status: boolean
	hint?: string | null
	question_tags?: { id: number; name: string }[]
}

interface GroupedOtherLanguageQuestion {
	daily_record_question_id: number
	master_question: string
	question_in_other_language: string
	validation_rule: string | null
	form_type: string | null
	date: boolean
	form_type_value: string | null
	language_form_type_value: string | null | undefined
	question_tag: string | null
	question_unit: string | null
	constant_value: number | null
	daily_record_questions_language_id: number
	delete_status: boolean
	language_hint: string | null | undefined
	master_hint: string | null | undefined
	created_at: Date | string | undefined
}

export class DailyRecordQuestionService {
	static async create(
		data: CreateDailyRecordQuestionsInput,
	): Promise<Model<DailyRecordQuestionAttributes>[]> {
		const questions = data.questions.map((q) => this.buildQuestionData(data, q))
		const savedQuestions = await db.DailyRecordQuestion.bulkCreate(questions, {
			returning: true,
		})
		await Promise.all([
			this.createTagMappings(savedQuestions, data.questions),
			this.createLanguageMappings(savedQuestions, data),
		])
		return savedQuestions
	}

	private static buildQuestionData(
		data: CreateDailyRecordQuestionsInput,
		value: QuestionInput,
	): DailyRecordQuestionAttributes {
		return {
			category_id: data.category_id,
			sub_category_id: data.sub_category_id ?? null,
			question: value.question,
			form_type_id: value.form_type_id,
			validation_rule_id: value.validation_rule_id,
			date: value.date ?? false,
			form_type_value: value.form_type_value ?? null,
			question_tag: value.question_tag[0],
			question_unit: value.question_unit,
			hint: value.hint ?? null,
			sequence_number: value.sequence_number ?? 0,
		}
	}

	private static async createTagMappings(
		savedQuestions: Model<DailyRecordQuestionAttributes>[],
		questions: QuestionInput[],
	): Promise<void> {
		const tagMappings = savedQuestions.flatMap((q, i) =>
			questions[i].question_tag.map((tagId) => ({
				question_id: q.get('id') as number,
				question_tag_id: tagId,
			})),
		)
		await db.QuestionTagMapping.bulkCreate(tagMappings)
	}

	private static async createLanguageMappings(
		savedQuestions: Model<DailyRecordQuestionAttributes>[],
		data: CreateDailyRecordQuestionsInput,
	): Promise<void> {
		const languageMappings = savedQuestions.map((q, i) => ({
			daily_record_question_id: q.get('id') as number,
			language_id: data.language_id,
			question: data.questions[i].question,
			form_type_value: data.questions[i].form_type_value ?? null,
			hint: data.questions[i].hint ?? null,
		}))
		await db.DailyRecordQuestionLanguage.bulkCreate(languageMappings)
	}

	static async listAll(): Promise<{
		message: string
		data: Record<string, Record<string, GroupedQuestion[]>>
	}> {
		const {
			DailyRecordQuestion,
			Category,
			Subcategory,
			ValidationRule,
			FormType,
			QuestionUnit,
			QuestionTag,
		} = db
		const questions = (await DailyRecordQuestion.findAll({
			where: { delete_status: false },
			include: [
				{ model: Category, attributes: ['name'], required: true },
				{ model: Subcategory, attributes: ['name'], required: false },
				{
					model: ValidationRule,
					attributes: ['name', 'constant_value'],
					required: false,
				},
				{ model: FormType, attributes: ['name'], required: false },
				{
					model: QuestionUnit,
					attributes: ['name'],
					required: false,
					as: 'QuestionUnit',
				},
				{
					model: QuestionTag,
					attributes: ['name'],
					required: false,
					as: 'QuestionTag',
				},
			],
			raw: true,
			nest: true,
		})) as DailyRecordQuestionJoined[]

		const resData: Record<string, Record<string, GroupedQuestion[]>> = {}
		questions.forEach((question) => {
			const category = question.Category?.name || 'Unknown'
			const subcategory = question.Subcategory?.name || 'Unknown'
			if (!resData[category]) resData[category] = {}
			if (!resData[category][subcategory]) resData[category][subcategory] = []
			resData[category][subcategory].push({
				question: question.question,
				form_type: question.FormType?.name,
				validation_rule: question.ValidationRule?.name,
				daily_record_question_id: question.id,
				date: question.date,
				category_id: question.category_id,
				sub_category_id: question.sub_category_id,
				validation_rule_id: question.validation_rule_id,
				form_type_id: question.form_type_id,
				form_type_value: question.form_type_value,
				question_tag: question.QuestionTag?.name ?? null,
				question_unit: question.QuestionUnit?.name ?? null,
				constant_value: question.ValidationRule?.constant_value,
				question_tag_id: question.question_tag,
				question_unit_id: question.question_unit,
				delete_status: question.delete_status,
			})
		})
		return { message: 'Success', data: resData }
	}

	static async listAllDailyRecordQuestions(): Promise<{
		message: string
		data: Record<string, Record<string, GroupedQuestion[]>>
	}> {
		const {
			DailyRecordQuestion,
			Category,
			Subcategory,
			ValidationRule,
			FormType,
			QuestionUnit,
			QuestionTagMapping,
			QuestionTag,
		} = db
		const questions = (await DailyRecordQuestion.findAll({
			where: { delete_status: false },
			include: [
				{ model: Category, attributes: ['name'], required: true },
				{ model: Subcategory, attributes: ['name'], required: false },
				{
					model: ValidationRule,
					attributes: ['name', 'constant_value'],
					required: false,
				},
				{ model: FormType, attributes: ['name'], required: false },
				{
					model: QuestionUnit,
					attributes: ['name'],
					required: false,
					as: 'QuestionUnit',
				},
			],
			raw: true,
			nest: true,
		})) as DailyRecordQuestionJoined[]

		const questionIds = questions.map((q) => q.id)
		const tagMappings = (await QuestionTagMapping.findAll({
			where: { question_id: questionIds },
			include: [
				{ model: QuestionTag, attributes: ['id', 'name'], as: 'QuestionTag' },
			],
			raw: true,
			nest: true,
		})) as QuestionTagMappingWithTag[]

		const tagsByQuestionId = groupTagsByQuestionId(tagMappings)
		const resData = groupQuestionsByCategory(questions, tagsByQuestionId)
		return { message: 'Success', data: resData }
	}

	static async update(
		id: number,
		data: UpdateDailyRecordQuestionInput,
	): Promise<void> {
		const { DailyRecordQuestion, QuestionTagMapping } = db
		const question = await DailyRecordQuestion.findByPk(id)
		if (!question) throw new Error('Question not found')
		question.category_id = data.category_id
		question.sub_category_id = data.sub_category_id ?? null
		question.question = data.question
		question.validation_rule_id = data.validation_rule_id
		question.form_type_id = data.form_type_id
		question.date = data.date
		question.form_type_value = data.form_type_value ?? null
		question.question_tag = data.question_tag_id[0]
		question.question_unit = data.question_unit_id
		question.hint = data.hint ?? null
		await QuestionTagMapping.destroy({ where: { question_id: id } })
		const tagData = data.question_tag_id.map((tagId) => ({
			question_id: id,
			question_tag_id: tagId,
			created_at: new Date(),
			updated_at: new Date(),
		}))
		await QuestionTagMapping.bulkCreate(tagData)
		await question.save()
	}

	static async delete(id: number): Promise<boolean> {
		const { DailyRecordQuestion } = db
		const [affectedRows] = await DailyRecordQuestion.update(
			{ delete_status: true },
			{ where: { id } },
		)
		return affectedRows > 0
	}

	static async addDailyQuestionsInOtherLanguage(data: {
		daily_record_question_id: number
		language_id: number
		question: string
		form_type_value?: string | null
		hint?: string | null
	}): Promise<{ success: boolean; code: number; message: string }> {
		const { DailyRecordQuestionLanguage, Language, DailyRecordQuestion } = db
		const language = await Language.findByPk(data.language_id)
		if (!language) {
			return { success: false, code: 404, message: 'Language not found' }
		}
		const question = await DailyRecordQuestion.findByPk(
			data.daily_record_question_id,
		)
		if (!question) {
			return {
				success: false,
				code: 404,
				message: 'Daily record question not found',
			}
		}
		const exists = await DailyRecordQuestionLanguage.findOne({
			where: {
				daily_record_question_id: data.daily_record_question_id,
				language_id: data.language_id,
			},
		})
		if (exists) {
			return {
				success: false,
				code: 422,
				message: 'This question is already added in this language',
			}
		}
		await DailyRecordQuestionLanguage.create({
			daily_record_question_id: data.daily_record_question_id,
			language_id: data.language_id,
			question: data.question,
			form_type_value: data.form_type_value ?? null,
			hint: data.hint ?? null,
		})
		return { success: true, code: 200, message: 'Success' }
	}

	static async getDailyQuestionsInOtherLanguage(language_id: number): Promise<{
		message: string
		data: Record<string, Record<string, GroupedOtherLanguageQuestion[]>>
	}> {
		const {
			DailyRecordQuestion,
			DailyRecordQuestionLanguage,
			CategoryLanguage,
			SubCategoryLanguage,
			ValidationRule,
			FormType,
			QuestionUnit,
			QuestionTag,
		} = db

		// Fetch all translations for the language
		const translations = await DailyRecordQuestionLanguage.findAll({
			where: { language_id },
			raw: true,
		})
		if (!translations.length) return { message: 'Success', data: {} }

		// Fetch all related questions
		const questionIds = translations.map((t) => t.daily_record_question_id)
		const questions = await DailyRecordQuestion.findAll({
			where: { id: questionIds, delete_status: false },
			raw: true,
		})

		// Fetch all related category/subcategory/validation/form/unit/tag
		const categoryIds = [
			...new Set(
				questions
					.map((q) => q.category_id)
					.filter((id): id is number => id !== null && id !== undefined),
			),
		]
		const subCategoryIds = [
			...new Set(
				questions
					.map((q) => q.sub_category_id)
					.filter((id): id is number => id !== null && id !== undefined),
			),
		]
		const questionUnitIds = [...new Set(questions.map((q) => q.question_unit))]
		const questionTagIds = [...new Set(questions.map((q) => q.question_tag))]
		const validationRuleIds = [
			...new Set(questions.map((q) => q.validation_rule_id)),
		]
		const formTypeIds = [...new Set(questions.map((q) => q.form_type_id))]

		const [
			categoryLangs,
			subCategoryLangs,
			validationRules,
			formTypes,
			questionUnits,
			questionTags,
		] = await Promise.all([
			CategoryLanguage.findAll({
				where: { category_id: categoryIds, language_id },
				raw: true,
			}),
			SubCategoryLanguage.findAll({
				where: { sub_category_id: subCategoryIds, language_id },
				raw: true,
			}),
			ValidationRule.findAll({ where: { id: validationRuleIds }, raw: true }),
			FormType.findAll({ where: { id: formTypeIds }, raw: true }),
			QuestionUnit.findAll({ where: { id: questionUnitIds }, raw: true }),
			QuestionTag.findAll({ where: { id: questionTagIds }, raw: true }),
		])

		const categoryLangMap = Object.fromEntries(
			categoryLangs.map((c) => [c.category_id, c.category_language_name]),
		)
		const subCategoryLangMap = Object.fromEntries(
			subCategoryLangs.map((s) => [
				s.sub_category_id,
				s.sub_category_language_name,
			]),
		)
		const validationRuleMap: Record<
			number,
			{ name: string; constant_value: number }
		> = Object.fromEntries(
			validationRules.map(
				(v: { id: number; name: string; constant_value: number }) => [
					v.id,
					{ name: v.name, constant_value: v.constant_value },
				],
			),
		)
		const formTypeMap = Object.fromEntries(formTypes.map((f) => [f.id, f.name]))
		const questionUnitMap = Object.fromEntries(
			questionUnits.map((u) => [u.id, u.name]),
		)
		const questionTagMap = Object.fromEntries(
			questionTags.map((t) => [t.id, t.name]),
		)

		const maps: Maps = {
			categoryLangMap,
			subCategoryLangMap,
			validationRuleMap,
			formTypeMap,
			questionTagMap,
			questionUnitMap,
		}
		const grouped = groupByCategoryAndSubcategory(translations, questions, maps)
		return { message: 'Success', data: grouped }
	}

	static async updateDailyRecordQuestionInOtherLanguage(
		id: number,
		data: {
			daily_record_question_id: number
			language_id: number
			question: string
			form_type_value?: string | null
			hint?: string | null
		},
	): Promise<{ success: boolean; code: number; message: string }> {
		const { DailyRecordQuestionLanguage } = db
		const questionDetails = await DailyRecordQuestionLanguage.findByPk(id)
		if (!questionDetails) {
			return { success: false, code: 404, message: 'Translation not found' }
		}
		questionDetails.daily_record_question_id = data.daily_record_question_id
		questionDetails.language_id = data.language_id
		questionDetails.question = data.question
		questionDetails.form_type_value = data.form_type_value ?? null
		questionDetails.hint = data.hint ?? null
		await questionDetails.save()
		return { success: true, code: 200, message: 'Updated successfully.' }
	}
}

// Helper to group tags by question_id
function groupTagsByQuestionId(
	tagMappings: QuestionTagMappingWithTag[],
): Record<number, { id: number; name: string }[]> {
	const tagsByQuestionId: Record<number, { id: number; name: string }[]> = {}
	tagMappings.forEach((tagmap) => {
		if (!tagsByQuestionId[tagmap.question_id])
			tagsByQuestionId[tagmap.question_id] = []
		if (tagmap.QuestionTag)
			tagsByQuestionId[tagmap.question_id].push({
				id: tagmap.QuestionTag.id,
				name: tagmap.QuestionTag.name,
			})
	})
	return tagsByQuestionId
}

// Helper to group questions by category/subcategory
function groupQuestionsByCategory(
	questions: DailyRecordQuestionJoined[],
	tagsByQuestionId: Record<number, { id: number; name: string }[]>,
): Record<string, Record<string, GroupedQuestion[]>> {
	const resData: Record<string, Record<string, GroupedQuestion[]>> = {}
	questions.forEach((question) => {
		const category = question.Category?.name || 'Unknown'
		const subcategory = question.Subcategory?.name || 'Unknown'
		if (!resData[category]) resData[category] = {}
		if (!resData[category][subcategory]) resData[category][subcategory] = []
		resData[category][subcategory].push({
			question: question.question,
			form_type: question.FormType?.name,
			validation_rule: question.ValidationRule?.name,
			daily_record_question_id: question.id,
			date: question.date ?? false,
			category_id: question.category_id,
			sub_category_id: question.sub_category_id ?? null,
			validation_rule_id: question.validation_rule_id,
			form_type_id: question.form_type_id,
			form_type_value: question.form_type_value ?? null,
			question_tag: question.QuestionTag?.name ?? null,
			question_unit: question.QuestionUnit?.name ?? null,
			constant_value: question.ValidationRule?.constant_value,
			question_tag_id:
				typeof question.question_tag === 'number' ? question.question_tag : 0,
			question_unit_id:
				typeof question.question_unit === 'number' ? question.question_unit : 0,
			delete_status: question.delete_status ?? false,
			hint: question.hint ?? null,
			question_tags: tagsByQuestionId[question.id] || [],
		})
	})
	return resData
}

type Maps = {
	categoryLangMap: Record<number, string>
	subCategoryLangMap: Record<number, string>
	validationRuleMap: Record<number, { name: string; constant_value: number }>
	formTypeMap: Record<number, string>
	questionTagMap: Record<number, string>
	questionUnitMap: Record<number, string>
}

function resolveCategoryName(
	q: DailyRecordQuestionAttributes,
	maps: Maps,
): string {
	const { categoryLangMap } = maps
	if (
		q.category_id !== null &&
		typeof q.category_id === 'number' &&
		categoryLangMap[q.category_id]
	) {
		return categoryLangMap[q.category_id]
	}
	if (typeof q.category_id !== 'number') {
		return categoryLangMap[0] ?? 'Unknown'
	}
	return 'Unknown'
}

function resolveSubCategoryName(
	q: DailyRecordQuestionAttributes,
	maps: Maps,
): string {
	const { subCategoryLangMap } = maps
	if (
		q.sub_category_id !== null &&
		typeof q.sub_category_id === 'number' &&
		subCategoryLangMap[q.sub_category_id]
	) {
		return subCategoryLangMap[q.sub_category_id]
	}
	if (typeof q.sub_category_id !== 'number') {
		return subCategoryLangMap[0] ?? 'Unknown'
	}
	return 'Unknown'
}

function buildGroupedOtherLanguageQuestion(
	t: DailyRecordQuestionLanguageAttributes,
	q: DailyRecordQuestionAttributes,
	maps: Maps,
): GroupedOtherLanguageQuestion {
	const { validationRuleMap, formTypeMap, questionTagMap, questionUnitMap } =
		maps
	return {
		daily_record_question_id: t.daily_record_question_id,
		master_question: q.question,
		question_in_other_language: t.question,
		validation_rule:
			validationRuleMap[
				typeof q.validation_rule_id === 'number' ? q.validation_rule_id : 0
			]?.name ?? null,
		form_type:
			formTypeMap[typeof q.form_type_id === 'number' ? q.form_type_id : 0] ??
			null,
		date: q.date ?? false,
		form_type_value: q.form_type_value ?? null,
		language_form_type_value: t.form_type_value ?? null,
		question_tag:
			questionTagMap[typeof q.question_tag === 'number' ? q.question_tag : 0] ??
			null,
		question_unit:
			questionUnitMap[
				typeof q.question_unit === 'number' ? q.question_unit : 0
			] ?? null,
		constant_value:
			validationRuleMap[
				typeof q.validation_rule_id === 'number' ? q.validation_rule_id : 0
			]?.constant_value ?? null,
		daily_record_questions_language_id: typeof t.id === 'number' ? t.id : 0,
		delete_status: q.delete_status ?? false,
		language_hint: t.hint ?? null,
		master_hint: q.hint ?? null,
		created_at: t.created_at,
	}
}

function groupByCategoryAndSubcategory(
	translations: DailyRecordQuestionLanguageAttributes[],
	questions: DailyRecordQuestionAttributes[],
	maps: Maps,
): Record<string, Record<string, GroupedOtherLanguageQuestion[]>> {
	const grouped: Record<
		string,
		Record<string, GroupedOtherLanguageQuestion[]>
	> = {}
	for (const t of translations) {
		const q = questions.find((q) => q.id === t.daily_record_question_id)
		if (!q) continue
		const catName = resolveCategoryName(q, maps)
		const subCatName = resolveSubCategoryName(q, maps)
		if (!grouped[catName]) grouped[catName] = {}
		if (!grouped[catName][subCatName]) grouped[catName][subCatName] = []
		grouped[catName][subCatName].push(
			buildGroupedOtherLanguageQuestion(t, q, maps),
		)
	}
	return grouped
}
