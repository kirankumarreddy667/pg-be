import db from '@/config/database'
import { QueryTypes } from 'sequelize'

type ConstantValue = string | number | null

export interface BasicDetailsGroupedQuestion {
	animal_id?: number
	validation_rule: string | null
	master_question: string
	language_question: string | null
	question_id: number
	form_type: string | null
	date: boolean
	form_type_value: string | null
	question_language_id: number | null
	constant_value: ConstantValue
	question_unit?: string | null
	question_tag?: string | null
	language_form_type_value: string | null
	hint: string | null
	sequence_number?: number | null
	question_created_at?: Date | null
}

export class AnimalQuestionsBasedOnCategoryService {
	static async animalQuestionBasedOnBasicDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 1)
	}

	static async animalQuestionBasedOnBreedingDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 2)
	}

	static async animalQuestionBasedOnMilkDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 3)
	}

	static async animalQuestionBasedOnBirthDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 4)
	}

	static async animalQuestionBasedOnHealthDetailsCategory(
		animal_id: number,
		language_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		return this.animalQuestionBasedOnCategory(animal_id, language_id, 5)
	}

	static async animalQuestionBasedOnCategory(
		animal_id: number,
		language_id: number,
		category_id: number,
	): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		const results = await db.sequelize.query(
			`
	SELECT 
		aq.question_id,
		ql.question as language_question,
		cq.category_id,
		cq.sub_category_id,
		cq.validation_rule_id,
		cl.category_language_name,
		scl.sub_category_language_name,
		cq.question_tag,
		cq.question_unit,
		cq.form_type_id,
		cq.date,
		cq.question as master_question,
		aq.animal_id,
		vr.name as validation_rule,
		ft.name as form_type,
		cq.form_type_value,
		ql.id as question_language_id,
		vr.constant_value,
		ql.form_type_value as language_form_type_value,
		ql.hint,
		cq.sequence_number,
		qu.name as question_unit_name,
		qt.name as question_tag_name,
		cq.created_at
	FROM common_questions cq
	INNER JOIN animal_questions aq ON cq.id = aq.question_id
		AND aq.deleted_at IS NULL
	INNER JOIN question_language ql ON cq.id = ql.question_id
		AND ql.deleted_at IS NULL
	LEFT JOIN form_type ft ON ft.id = cq.form_type_id
		AND ft.deleted_at IS NULL
	INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id
		AND vr.deleted_at IS NULL
	INNER JOIN category_language cl ON cl.category_id = cq.category_id 
		AND cl.language_id = :language_id 
		AND cl.category_id = :category_id
		AND cl.deleted_at IS NULL
	LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id 
		AND scl.language_id = :language_id
		AND scl.deleted_at IS NULL
	LEFT JOIN question_units qu ON qu.id = cq.question_unit
		AND qu.deleted_at IS NULL
	LEFT JOIN question_tags qt ON qt.id = cq.question_tag
		AND qt.deleted_at IS NULL
	WHERE aq.animal_id = :animal_id 
		AND ql.language_id = :language_id
		AND cq.deleted_at IS NULL
	ORDER BY cq.created_at ASC
`,
			{
				replacements: { animal_id, language_id, category_id },
				type: QueryTypes.SELECT,
			},
		)
		if (!results || results.length === 0)
			return { message: 'Success', data: [] }

		const groupedData = (
			results as {
				category_language_name: string
				sub_category_language_name: string
				question_id: number
				master_question: string
				language_question: string
				animal_id: number
				validation_rule: string
				form_type: string
				form_type_value: string
				date: boolean
				question_language_id: number
				constant_value: string
				question_unit_name: string | null
				question_tag_name: string | null
				language_form_type_value: string | null
				hint: string | null
				sequence_number: number | null
				created_at: Date
			}[]
		).reduce(
			(acc, row) => {
				const categoryName = row.category_language_name || ''
				const subCategoryName = row.sub_category_language_name || ''

				if (!acc[categoryName]) acc[categoryName] = {}
				if (!acc[categoryName][subCategoryName])
					acc[categoryName][subCategoryName] = []

				const question: BasicDetailsGroupedQuestion = {
					animal_id: row.animal_id,
					validation_rule: row.validation_rule,
					master_question: row.master_question,
					language_question: row.language_question,
					question_id: row.question_id,
					form_type: row.form_type,
					date: row.date,
					form_type_value: row.form_type_value,
					question_language_id: row.question_language_id,
					constant_value: row.constant_value,
					question_unit: row.question_unit_name,
					question_tag: row.question_tag_name,
					language_form_type_value: row.language_form_type_value,
					hint: row.hint,
					sequence_number: row.sequence_number,
				}
				if (category_id === 1) question.question_created_at = row.created_at
				acc[categoryName][subCategoryName].push(question)

				return acc
			},
			{} as Record<string, Record<string, BasicDetailsGroupedQuestion[]>>,
		)

		return { message: 'Success', data: groupedData }
	}

	static async userAnimalDeleteQuestions(language_id: number): Promise<{
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		const query = `
		SELECT 
			cq.id as question_id,
			ql.question,
			cq.category_id,
			cq.sub_category_id,
			cq.validation_rule_id,
			cl.category_language_name,
			scl.sub_category_language_name,
			cq.question_tag,
			cq.question_unit,
			cq.form_type_id,
			cq.date,
			cq.question as master_question,
			vr.name as validation_rule,
			ft.name as form_type,
			cq.form_type_value,
			ql.id as question_language_id,
			vr.constant_value,
			ql.form_type_value as language_form_type_value,
			ql.hint,
			cq.sequence_number,
			qu.name as question_unit_name,
			qt.name as question_tag_name
		FROM common_questions cq
		INNER JOIN question_language ql ON cq.id = ql.question_id AND ql.deleted_at IS NULL
		LEFT JOIN form_type ft ON ft.id = cq.form_type_id AND ft.deleted_at IS NULL
		INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id AND vr.deleted_at IS NULL
		INNER JOIN category_language cl ON cl.category_id = cq.category_id 
			AND cl.language_id = :language_id 
			AND cl.category_id = 10
			AND cl.deleted_at IS NULL
		LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id 
			AND scl.language_id = :language_id
			AND scl.deleted_at IS NULL
		LEFT JOIN question_units qu ON qu.id = cq.question_unit
			AND qu.deleted_at IS NULL
		LEFT JOIN question_tags qt ON qt.id = cq.question_tag
			AND qt.deleted_at IS NULL
		WHERE ql.language_id = :language_id
			AND cq.question_tag IN (43, 44)
			AND cq.deleted_at IS NULL
		ORDER BY cq.sequence_number ASC
	`

		const results = (await db.sequelize.query(query, {
			replacements: { language_id },
			type: QueryTypes.SELECT,
		})) as unknown as {
			category_language_name: string
			sub_category_language_name: string
			question_id: number
			master_question: string
			language_question: string
			validation_rule: string
			form_type: string
			form_type_value: string
			date: boolean
			question_language_id: number
			constant_value: string
			question_unit_name: string | null
			question_tag_name: string | null
			language_form_type_value: string | null
			hint: string | null
			sequence_number: number | null
			question: string
		}[]
		if (!results.length) return { message: 'Success', data: [] }

		const resData = results.reduce(
			(acc, row) => {
				const categoryName = row.category_language_name || ''
				const subCategoryName = row.sub_category_language_name || ''

				if (!acc[categoryName]) acc[categoryName] = {}
				if (!acc[categoryName][subCategoryName])
					acc[categoryName][subCategoryName] = []

				acc[categoryName][subCategoryName].push({
					validation_rule: row.validation_rule,
					master_question: row.master_question,
					language_question: row.question,
					question_id: row.question_id,
					form_type: row.form_type,
					date: row.date,
					form_type_value: row.form_type_value,
					question_language_id: row.question_language_id,
					constant_value: row.constant_value,
					question_unit: row.question_unit_name,
					question_tag: row.question_tag_name,
					language_form_type_value: row.language_form_type_value,
					hint: row.hint,
					sequence_number: row.sequence_number,
				})

				return acc
			},
			{} as Record<string, Record<string, BasicDetailsGroupedQuestion[]>>,
		)

		return { message: 'Success', data: resData }
	}

	static async userAnimalDeleteQuestionsBasedOnOptions(
		language_id: number,
		option: string,
	): Promise<{
		success: boolean
		message: string
		data: Record<string, Record<string, BasicDetailsGroupedQuestion[]>> | []
	}> {
		let questionTag: number

		if (option === 'sold_off') {
			questionTag = 45
		} else if (option === 'animal_dead') {
			questionTag = 46
		} else {
			return { success: false, message: 'Invalid option', data: [] }
		}

		const query = `
		SELECT 
			cq.id as question_id,
			ql.question,
			cq.category_id,
			cq.sub_category_id,
			cq.validation_rule_id,
			cl.category_language_name,
			scl.sub_category_language_name,
			cq.question_tag,
			cq.question_unit,
			cq.form_type_id,
			cq.date,
			cq.question as master_question,
			vr.name as validation_rule,
			ft.name as form_type,
			cq.form_type_value,
			ql.id as question_language_id,
			vr.constant_value,
			ql.form_type_value as language_form_type_value,
			ql.hint,
			qu.name as question_unit_name,
			qt.name as question_tag_name
		FROM common_questions cq
		INNER JOIN question_language ql ON cq.id = ql.question_id
			AND ql.deleted_at IS NULL
		LEFT JOIN form_type ft ON ft.id = cq.form_type_id
			AND ft.deleted_at IS NULL
		INNER JOIN validation_rules vr ON vr.id = cq.validation_rule_id
			AND vr.deleted_at IS NULL
		INNER JOIN category_language cl ON cl.category_id = cq.category_id 
			AND cl.language_id = :language_id 
			AND cl.category_id = 10
			AND cl.deleted_at IS NULL
		LEFT JOIN sub_category_language scl ON scl.sub_category_id = cq.sub_category_id 
			AND scl.language_id = :language_id
			AND scl.deleted_at IS NULL
		LEFT JOIN question_units qu ON qu.id = cq.question_unit
			AND qu.deleted_at IS NULL
		LEFT JOIN question_tags qt ON qt.id = cq.question_tag
			AND qt.deleted_at IS NULL
		WHERE ql.language_id = :language_id
			AND cq.question_tag = :questionTag
			AND cq.deleted_at IS NULL
	`

		const results = (await db.sequelize.query(query, {
			replacements: { language_id, questionTag },
			type: QueryTypes.SELECT,
		})) as unknown as {
			category_language_name: string
			sub_category_language_name: string
			question_id: number
			master_question: string
			language_question: string
			validation_rule: string
			form_type: string
			form_type_value: string
			date: boolean
			question_language_id: number
			constant_value: string
			question_unit_name: string | null
			question_tag_name: string | null
			language_form_type_value: string | null
			hint: string | null
			question: string
		}[]

		if (!results.length) return { success: true, message: 'Success', data: [] }
		const resData = results.reduce(
			(acc, row) => {
				const categoryName = row.category_language_name || ''
				const subCategoryName = row.sub_category_language_name || ''

				if (!acc[categoryName]) acc[categoryName] = {}
				if (!acc[categoryName][subCategoryName])
					acc[categoryName][subCategoryName] = []

				acc[categoryName][subCategoryName].push({
					validation_rule: row.validation_rule,
					master_question: row.master_question,
					language_question: row.question,
					question_id: row.question_id,
					form_type: row.form_type,
					date: row.date,
					form_type_value: row.form_type_value,
					question_language_id: row.question_language_id,
					constant_value: row.constant_value,
					question_unit: row.question_unit_name,
					question_tag: row.question_tag_name,
					language_form_type_value: row.language_form_type_value,
					hint: row.hint,
				})

				return acc
			},
			{} as Record<string, Record<string, BasicDetailsGroupedQuestion[]>>,
		)

		return { success: true, message: 'Success', data: resData }
	}

	static async farmAnimalCount(
		user_id: number,
	): Promise<{ [animal_name: string]: number }[]> {
		const resData: { [animal_name: string]: number }[] = []

		const basicAnimalsQuery = `
            SELECT 
                a.id,
                a.name,
                COUNT(DISTINCT aqa.animal_number) as count
            FROM animals a
            LEFT JOIN animal_question_answers aqa ON a.id = aqa.animal_id 
                AND aqa.user_id = :user_id 
                AND aqa.status != 1
				AND aqa.deleted_at IS NULL
			WHERE a.deleted_at IS NULL
            GROUP BY a.id, a.name
            ORDER BY a.id
        `

		const basicAnimals = (await db.sequelize.query(basicAnimalsQuery, {
			replacements: { user_id },
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as { id: number; name: string; count: number }[]

		basicAnimals.forEach((animal) => {
			resData.push({
				[animal.name]: animal.count,
			})
		})

		const genderQuery = `
            SELECT 
                aqa.animal_id,
                LOWER(aqa.answer) as gender,
                COUNT(DISTINCT aqa.animal_number) as count
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag = 8
                AND aqa.animal_id IN (1, 2)  -- 1=cow, 2=buffalo
                AND aqa.status != 1
                AND aqa.user_id = :user_id
				AND aqa.deleted_at IS NULL
				AND cq.deleted_at IS NULL
            GROUP BY aqa.animal_id, LOWER(aqa.answer)
        `

		const genderResults = (await db.sequelize.query(genderQuery, {
			replacements: { user_id },
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as { animal_id: number; gender: string; count: number }[]

		// Process gender results into counts
		let cowMaleCount = 0
		let cowFemaleCount = 0
		let buffaloMaleCount = 0
		let buffaloFemaleCount = 0

		genderResults.forEach((result) => {
			if (result.animal_id === 1) {
				// Cow
				if (result.gender === 'male') {
					cowMaleCount = result.count
				} else if (result.gender === 'female') {
					cowFemaleCount = result.count
				}
			} else if (result.animal_id === 2) {
				// Buffalo
				if (result.gender === 'male') {
					buffaloMaleCount = result.count
				} else if (result.gender === 'female') {
					buffaloFemaleCount = result.count
				}
			}
		})

		resData.push({ bull: cowMaleCount + buffaloMaleCount })
		resData.push({ female_cow: cowFemaleCount })
		resData.push({ male_cow: cowMaleCount })
		resData.push({ buffalo_male: buffaloMaleCount })
		resData.push({ buffalo_female: buffaloFemaleCount })

		return resData
	}
}
