import db from '@/config/database'
import type { AnimalQuestions } from '@/models/animal_questions.model'
import { CommonQuestions } from '@/models/common_questions.model'
import { QuestionLanguage } from '@/models/question_language.model'

type ConstantValue = string | number | null

export interface BasicDetailsGroupedQuestion {
	animal_id: number
	validation_rule: string | null
	master_question: string
	language_question: string | null
	question_id: number
	form_type: string | null
	date: boolean
	form_type_value: string | null
	question_language_id: number | null
	constant_value: ConstantValue
	question_unit: string | null
	question_tag: string | null
	language_form_type_value: string | null
	hint: string | null
	sequence_number: number | null
	question_created_at: Date
}

export class AnimalQuestionsBasedOnCategoryService {
	static async animalQuestionBasedOnBasicDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 1 },
					include: [
						{
							model: db.QuestionLanguage,
							as: 'QuestionLanguages',
							where: { language_id },
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
							where: { language_id, category_id: 1 },
							required: true,
							attributes: ['category_language_name'],
						},
						{
							model: db.SubCategoryLanguage,
							as: 'SubCategoryLanguage',
							where: { language_id },
							required: false,
							attributes: ['sub_category_language_name'],
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
			],
			order: [
				[
					{ model: db.CommonQuestions, as: 'CommonQuestion' },
					'created_at',
					'ASC',
				],
			],
		})
		const resData: Record<
			string,
			Record<string, BasicDetailsGroupedQuestion[]>
		> = {}
		for (const aq of questions as Array<
			AnimalQuestions & { CommonQuestion?: unknown }
		>) {
			const cq = (aq as { CommonQuestion?: unknown }).CommonQuestion as
				| {
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
						sequence_number: number | null
						created_at: Date
						hint: string | null
				  }
				| undefined
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			const subCategoryName =
				cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []
			resData[categoryName][subCategoryName].push({
				animal_id,
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql?.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				form_type_value: cq.form_type_value,
				question_language_id: ql?.id ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? null,
				question_unit: cq.QuestionUnit?.name ?? null,
				question_tag: cq.QuestionTag?.name ?? null,
				language_form_type_value: ql?.form_type_value ?? null,
				hint: ql?.hint ?? null,
				sequence_number: cq.sequence_number ?? null,
				question_created_at: cq.created_at,
			})
		}
		return { message: 'Success', data: resData }
	}

	static async animalQuestionBasedOnBreedingDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id: 2 },
					include: [
						{
							model: db.QuestionLanguage,
							as: 'QuestionLanguages',
							where: { language_id },
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
							where: { language_id, category_id: 2 },
							required: true,
							attributes: ['category_language_name'],
						},
						{
							model: db.SubCategoryLanguage,
							as: 'SubCategoryLanguage',
							where: { language_id },
							required: false,
							attributes: ['sub_category_language_name'],
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
			],
			// Uncomment the next line if you want to order by sequence_number
			// order: [[{ model: db.CommonQuestions, as: 'CommonQuestion' }, 'sequence_number', 'ASC']],
		})
		const resData: Record<
			string,
			Record<string, BasicDetailsGroupedQuestion[]>
		> = {}
		for (const aq of questions as Array<
			AnimalQuestions & { CommonQuestion?: unknown }
		>) {
			const cq = (aq as { CommonQuestion?: unknown }).CommonQuestion as
				| {
						id: number
						question: string
						date: boolean
						form_type_value: string | null
						FormType?: { name: string } | null
						ValidationRule?: {
							name: string
							constant_value: string | number | null
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
						sequence_number: number | null
						created_at: Date
						hint: string | null
				  }
				| undefined
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			const subCategoryName =
				cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []
			resData[categoryName][subCategoryName].push({
				animal_id,
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql?.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				form_type_value: cq.form_type_value,
				question_language_id: ql?.id ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? null,
				question_unit: cq.QuestionUnit?.name ?? null,
				question_tag: cq.QuestionTag?.name ?? null,
				language_form_type_value: ql?.form_type_value ?? null,
				hint: ql?.hint ?? null,
				sequence_number: cq.sequence_number ?? null,
				question_created_at: cq.created_at,
			})
		}
		return { message: 'Success', data: resData }
	}

	static async animalQuestionBasedOnMilkDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 3)
	}

	static async animalQuestionBasedOnBirthDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 4)
	}

	static async animalQuestionBasedOnHealthDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 5)
	}

	private static async animalQuestionBasedOnCategory(
		animal_id: number,
		language_id: number,
		category_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		const questions = await db.AnimalQuestions.findAll({
			where: { animal_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { category_id },
					include: [
						{
							model: db.QuestionLanguage,
							as: 'QuestionLanguages',
							where: { language_id },
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
							where: { language_id, category_id },
							required: true,
							attributes: ['category_language_name'],
						},
						{
							model: db.SubCategoryLanguage,
							as: 'SubCategoryLanguage',
							where: { language_id },
							required: false,
							attributes: ['sub_category_language_name'],
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
			],
			// Uncomment the next line if you want to order by sequence_number
			// order: [[{ model: db.CommonQuestions, as: 'CommonQuestion' }, 'sequence_number', 'ASC']],
		})
		const resData: Record<
			string,
			Record<string, BasicDetailsGroupedQuestion[]>
		> = {}
		for (const aq of questions as Array<
			AnimalQuestions & { CommonQuestion?: unknown }
		>) {
			const cq = (aq as { CommonQuestion?: unknown }).CommonQuestion as
				| {
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
						sequence_number: number | null
						created_at: Date
						hint: string | null
				  }
				| undefined
			if (!cq) continue
			const ql = cq.QuestionLanguages?.[0]
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			const subCategoryName =
				cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []
			resData[categoryName][subCategoryName].push({
				animal_id,
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql?.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				form_type_value: cq.form_type_value,
				question_language_id: ql?.id ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? null,
				question_unit: cq.QuestionUnit?.name ?? null,
				question_tag: cq.QuestionTag?.name ?? null,
				language_form_type_value: ql?.form_type_value ?? null,
				hint: ql?.hint ?? null,
				sequence_number: cq.sequence_number ?? null,
				question_created_at: cq.created_at,
			})
		}
		return { message: 'Success', data: resData }
	}

	static async userAnimalDeleteQuestions(language_id: number): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		return this.userAnimalDeleteQuestionsByTags(language_id, [43, 44])
	}

	static async userAnimalDeleteQuestionsBasedOnOptions(
		language_id: number,
		option: string,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		if (option === 'sold_off') {
			return this.userAnimalDeleteQuestionsByTags(language_id, [45])
		} else if (option === 'animal_dead') {
			return this.userAnimalDeleteQuestionsByTags(language_id, [46])
		} else {
			return { message: 'Invalid option', data: {} }
		}
	}

	private static async userAnimalDeleteQuestionsByTags(
		language_id: number,
		tags: number[],
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>>
	}> {
		const questions = await db.CommonQuestions.findAll({
			where: { category_id: 10, question_tag: tags },
			include: [
				{
					model: db.QuestionLanguage,
					as: 'QuestionLanguages',
					where: { language_id },
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
					where: { language_id, category_id: 10 },
					required: true,
					attributes: ['category_language_name'],
				},
				{
					model: db.SubCategoryLanguage,
					as: 'SubCategoryLanguage',
					where: { language_id },
					required: false,
					attributes: ['sub_category_language_name'],
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
		})
		const resData: Record<
			string,
			Record<string, BasicDetailsGroupedQuestion[]>
		> = {}
		for (const cq of questions as Array<
			CommonQuestions & {
				QuestionLanguages?: QuestionLanguage[]
				FormType?: { name: string } | null
				ValidationRule?: {
					name: string
					constant_value: ConstantValue
				} | null
				CategoryLanguage?: { category_language_name: string } | null
				SubCategoryLanguage?: { sub_category_language_name: string } | null
				QuestionUnit?: { name: string } | null
				QuestionTag?: { name: string } | null
				sequence_number: number | null
				created_at: Date
				hint: string | null
			}
		>) {
			const ql = cq.QuestionLanguages?.[0]
			const categoryName =
				cq.CategoryLanguage?.category_language_name || 'Uncategorized'
			const subCategoryName =
				cq.SubCategoryLanguage?.sub_category_language_name || 'Uncategorized'
			if (!resData[categoryName]) resData[categoryName] = {}
			if (!resData[categoryName][subCategoryName])
				resData[categoryName][subCategoryName] = []
			resData[categoryName][subCategoryName].push({
				animal_id: 0,
				validation_rule: cq.ValidationRule?.name ?? null,
				master_question: cq.question,
				language_question: ql?.question ?? null,
				question_id: cq.id,
				form_type: cq.FormType?.name ?? null,
				date: cq.date,
				form_type_value: cq.form_type_value,
				question_language_id: ql?.id ?? null,
				constant_value: cq.ValidationRule?.constant_value ?? null,
				question_unit: cq.QuestionUnit?.name ?? null,
				question_tag: cq.QuestionTag?.name ?? null,
				language_form_type_value: ql?.form_type_value ?? null,
				hint: ql?.hint ?? null,
				sequence_number: cq.sequence_number ?? null,
				question_created_at: cq.created_at,
			})
		}
		return { message: 'Success', data: resData }
	}
}
