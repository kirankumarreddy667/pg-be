import db from '@/config/database'
import { Op, QueryTypes } from 'sequelize'
import type { User } from '@/types/index'

interface AnimalPregnancyInfo {
	animal_num: string
	date_of_pregnancy_detection?: string
	bull_no?: string
	expected_month_of_delevry?: string
	status_milking_dry?: string
	date_of_AI?: string
	Semen_company_name?: string
	pregnancy_cycle?: string
	date_of_last_AI?: string
	date_of_last_delivery?: string
}

type AnimalWithName = {
	animal_number: string
	animal_id: number
	'Animal.name': string
}

export class ReportsService {
	public static async getPregnantNonPregnantAnimalsCount(
		user: User,
	): Promise<
		Record<string, { pregnant_animal: number; non_pregnant_animal: number }>
	> {
		if (!user) throw new Error('User not found')
		const resData: Record<
			string,
			{ pregnant_animal: number; non_pregnant_animal: number }
		> = {}
		const animals = await db.AnimalQuestionAnswer.findAll({
			where: { user_id: user.id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
				'animal_id',
			],
			raw: true,
		})
		for (const animal of animals) {
			const animalNumbers = await db.sequelize.query<{
				animal_number: string
				animal_name: string
			}>(
				`SELECT DISTINCT aqa.animal_number, a.name as animal_name
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         JOIN animals a ON a.id = aqa.animal_id
         WHERE cq.question_tag = 15
           AND aqa.user_id = :user_id
           AND aqa.animal_id = :animal_id
           AND aqa.status <> 1`,
				{
					replacements: { user_id: user.id, animal_id: animal.animal_id },
					type: QueryTypes.SELECT,
				},
			)
			for (const value1 of animalNumbers) {
				let pregnantAnimal = 0
				let nonPregnantAnimal = 0
				const animalSex = await db.sequelize.query<{ answer: string }>(
					`SELECT aqa.answer
           FROM common_questions cq
           JOIN animal_question_answers aqa ON aqa.question_id = cq.id
           JOIN animals a ON a.id = aqa.animal_id
           WHERE cq.question_tag = 8
             AND aqa.user_id = :user_id
             AND aqa.animal_number = :animal_number
             AND aqa.status <> 1
           ORDER BY aqa.created_at DESC
           LIMIT 1`,
					{
						replacements: {
							user_id: user.id,
							animal_number: value1.animal_number,
						},
						type: QueryTypes.SELECT,
					},
				)
				if (
					animalSex[0]?.answer &&
					animalSex[0].answer.toLowerCase() !== 'male'
				) {
					const animalNo = await db.sequelize.query<{ answer: string }>(
						`SELECT aqa.answer
             FROM common_questions cq
             JOIN animal_question_answers aqa ON aqa.question_id = cq.id
             JOIN animals a ON a.id = aqa.animal_id
             WHERE cq.question_tag = 15
               AND aqa.user_id = :user_id
               AND aqa.animal_number = :animal_number
               AND aqa.status <> 1
             ORDER BY aqa.created_at DESC
             LIMIT 1`,
						{
							replacements: {
								user_id: user.id,
								animal_number: value1.animal_number,
							},
							type: QueryTypes.SELECT,
						},
					)
					const answer = animalNo[0]?.answer?.toLowerCase()
					if (answer === 'yes') pregnantAnimal++
					else nonPregnantAnimal++
					resData[value1.animal_name] = {
						pregnant_animal: pregnantAnimal,
						non_pregnant_animal: nonPregnantAnimal,
					}
				}
			}
		}
		return resData
	}

	public static async getPregnantNonPregnantAnimalsList(user: User): Promise<{
		pregnant: Record<string, AnimalPregnancyInfo[]>
		non_pregnant: Record<string, AnimalPregnancyInfo[]>
	}> {
		if (!user) throw new Error('User not found')
		const pregnant: Record<string, AnimalPregnancyInfo[]> = {}
		const nonpregnant: Record<string, AnimalPregnancyInfo[]> = {}
		const animals = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id: user.id, status: { [Op.ne]: 1 } },
			include: [{ model: db.Animal, as: 'Animal', attributes: ['name'] }],
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
				'animal_id',
				[db.Sequelize.col('Animal.name'), 'Animal.name'],
			],
			raw: true,
		})) as unknown as AnimalWithName[]
		for (const value of animals) {
			const animal_number = value.animal_number
			const animal_id = value.animal_id
			const animal_name = value['Animal.name'] || 'Unknown'
			// Get latest sex
			const animalSex = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 8
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number },
					type: QueryTypes.SELECT,
				},
			)
			if (
				!animalSex[0]?.answer ||
				animalSex[0].answer.toLowerCase() !== 'female'
			)
				continue
			// Get latest pregnancy state
			const pregnancyState = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 15
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number },
					type: QueryTypes.SELECT,
				},
			)
			if (!pregnancyState[0]?.answer) continue
			const pregnancyStateAnswer = pregnancyState[0].answer.toLowerCase()
			// Get latest semen company
			const semenCompanyName = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 42
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number },
					type: QueryTypes.SELECT,
				},
			)
			const SemenCompany = semenCompanyName[0]?.answer || 'NA'
			// Get latest pregnancy cycle
			const pregnancyCycleData = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 59
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number },
					type: QueryTypes.SELECT,
				},
			)
			const pregnancyCycle = pregnancyCycleData[0]?.answer || 'NA'
			// Get latest mother number
			const motherNumbers = await db.sequelize.query<{
				answer: string
				animal_id: number
				animal_number: string
			}>(
				`SELECT aqa.answer, aqa.animal_id, aqa.animal_number
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 11
           AND aqa.user_id = :user_id
           AND aqa.animal_id = :animal_id
           AND aqa.status <> 1`,
				{
					replacements: { user_id: user.id, animal_id },
					type: QueryTypes.SELECT,
				},
			)
			let animalDOB = 'NA'
			for (const value1 of motherNumbers) {
				if (value1.answer === animal_number) {
					const DOB = await db.sequelize.query<{ answer: string }>(
						`SELECT aqa.answer
             FROM common_questions cq
             JOIN animal_question_answers aqa ON aqa.question_id = cq.id
             WHERE cq.question_tag = 9
               AND aqa.user_id = :user_id
               AND aqa.animal_number = :animal_number
               AND aqa.animal_id = :animal_id
               AND aqa.status <> 1
             ORDER BY aqa.created_at DESC
             LIMIT 1`,
						{
							replacements: {
								user_id: user.id,
								animal_number: value1.animal_number,
								animal_id: value1.animal_id,
							},
							type: QueryTypes.SELECT,
						},
					)
					animalDOB = DOB[0]?.answer || 'NA'
				}
			}
			// Get latest AI date
			const AIDate = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 23
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.animal_id = :animal_id
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number, animal_id },
					type: QueryTypes.SELECT,
				},
			)
			const AIDateAnswer1 = AIDate[0]?.answer || 'NA'
			// Get latest bull no for AI
			const BullNoForAI = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 35
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.animal_id = :animal_id
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number, animal_id },
					type: QueryTypes.SELECT,
				},
			)
			const BullNoForAIAnswer = BullNoForAI[0]?.answer || 'NA'
			// Get latest milking status
			const milkingStatus = await db.sequelize.query<{ answer: string }>(
				`SELECT aqa.answer
         FROM common_questions cq
         JOIN animal_question_answers aqa ON aqa.question_id = cq.id
         WHERE cq.question_tag = 16
           AND aqa.user_id = :user_id
           AND aqa.animal_number = :animal_number
           AND aqa.animal_id = :animal_id
           AND aqa.status <> 1
         ORDER BY aqa.created_at DESC
         LIMIT 1`,
				{
					replacements: { user_id: user.id, animal_number, animal_id },
					type: QueryTypes.SELECT,
				},
			)
			let milkingStatusAnswer = 'NA'
			if (milkingStatus[0]?.answer) {
				const status = milkingStatus[0].answer.toLowerCase()
				milkingStatusAnswer = status === 'yes' ? 'Lactating' : 'Non-Lactating'
			}
			// Calculate pregnancy/delivery months
			let monthOfPregnancy = 'NA'
			let monthOfDelivery = 'NA'
			if (pregnancyStateAnswer === 'yes' && AIDateAnswer1 !== 'NA') {
				const aiDate = new Date(AIDateAnswer1)
				if (!isNaN(aiDate.getTime())) {
					const deliveryDate = new Date(aiDate)
					const monthsToAdd = animal_name.toLowerCase() === 'buffalo' ? 10 : 9
					deliveryDate.setMonth(deliveryDate.getMonth() + monthsToAdd)
					monthOfPregnancy = new Date(aiDate.setMonth(aiDate.getMonth() + 3))
						.toISOString()
						.slice(0, 7)
					monthOfDelivery = deliveryDate.toLocaleString('default', {
						month: 'long',
					})
				}
			}
			// Pregnant
			if (pregnancyStateAnswer === 'yes') {
				if (!pregnant[animal_name]) pregnant[animal_name] = []
				pregnant[animal_name].push({
					animal_num: animal_number,
					date_of_pregnancy_detection: monthOfPregnancy,
					bull_no: BullNoForAIAnswer,
					expected_month_of_delevry: monthOfDelivery,
					status_milking_dry: milkingStatusAnswer,
					date_of_AI: AIDateAnswer1,
					Semen_company_name: SemenCompany,
					pregnancy_cycle: pregnancyCycle,
				})
			} else {
				// Non-pregnant
				let dateOfPregnancy = 'NA'
				if (AIDateAnswer1 !== 'NA') {
					const aiDate = new Date(AIDateAnswer1)
					if (!isNaN(aiDate.getTime())) {
						aiDate.setMonth(aiDate.getMonth() + 3)
						dateOfPregnancy = aiDate.toISOString().slice(0, 10)
					}
				}
				if (!nonpregnant[animal_name]) nonpregnant[animal_name] = []
				nonpregnant[animal_name].push({
					animal_num: animal_number,
					date_of_last_AI: AIDateAnswer1,
					bull_no: BullNoForAIAnswer,
					date_of_pregnancy_detection: dateOfPregnancy,
					date_of_last_delivery: animalDOB,
					Semen_company_name: SemenCompany,
					status_milking_dry: milkingStatusAnswer,
					pregnancy_cycle: pregnancyCycle,
				})
			}
		}
		return { pregnant, non_pregnant: nonpregnant }
	}

	public static async getLactatingNonLactatingAnimalsCount(
		user: User,
	): Promise<
		Record<string, { lactating_animal: number; non_lactating_animal: number }>
	> {
		if (!user) throw new Error('User not found')
		const resData: Record<
			string,
			{ lactating_animal: number; non_lactating_animal: number }
		> = {}
		const animals = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id: user.id },
			include: [{ model: db.Animal, as: 'Animal', attributes: ['name'] }],
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_id')),
					'animal_id',
				],
				[db.Sequelize.col('Animal.name'), 'Animal.name'],
			],
			raw: true,
		})) as unknown as AnimalWithName[]
		for (const animal of animals) {
			const animal_id = animal.animal_id
			const animal_name = animal['Animal.name'] || 'Unknown'
			const animalNumbers = await db.AnimalQuestionAnswer.findAll({
				where: { user_id: user.id, animal_id, status: { [Op.ne]: 1 } },
				attributes: [
					[
						db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
						'animal_number',
					],
				],
				raw: true,
			})
			let lactatingAnimal = 0
			let nonlactatingAnimal = 0
			for (const value1 of animalNumbers) {
				const answers = await db.sequelize.query<{ answer: string }>(
					`SELECT aqa.answer
           FROM common_questions cq
           JOIN animal_question_answers aqa ON aqa.question_id = cq.id
           WHERE cq.question_tag = 16
             AND aqa.user_id = :user_id
             AND aqa.animal_number = :animal_number
             AND aqa.status <> 1
           ORDER BY aqa.created_at DESC
           LIMIT 1`,
					{
						replacements: {
							user_id: user.id,
							animal_number: value1.animal_number,
						},
						type: QueryTypes.SELECT,
					},
				)
				if (!answers[0]) continue
				const animalSex = await db.sequelize.query<{ answer: string }>(
					`SELECT aqa.answer
           FROM common_questions cq
           JOIN animal_question_answers aqa ON aqa.question_id = cq.id
           WHERE cq.question_tag = 8
             AND aqa.user_id = :user_id
             AND aqa.animal_number = :animal_number
             AND aqa.status <> 1
           ORDER BY aqa.created_at DESC
           LIMIT 1`,
					{
						replacements: {
							user_id: user.id,
							animal_number: value1.animal_number,
						},
						type: QueryTypes.SELECT,
					},
				)
				if (
					!animalSex[0]?.answer ||
					animalSex[0].answer.toLowerCase() === 'male'
				)
					continue
				const answer = answers[0].answer.toLowerCase()
				if (answer === 'yes') lactatingAnimal++
				else nonlactatingAnimal++
			}
			resData[animal_name] = {
				lactating_animal: lactatingAnimal,
				non_lactating_animal: nonlactatingAnimal,
			}
		}
		return resData
	}
}
