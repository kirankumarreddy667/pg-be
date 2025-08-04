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

// Helper to fetch the latest answer for a tag
async function getLatestAnswer(
	user_id: number,
	animal_number: string,
	animal_id: number | undefined,
	tag: number,
): Promise<string> {
	let query = `SELECT aqa.answer
    FROM common_questions cq
    JOIN animal_question_answers aqa ON aqa.question_id = cq.id
    WHERE cq.question_tag = :tag
      AND aqa.user_id = :user_id
      AND aqa.animal_number = :animal_number
      AND aqa.status <> 1`
	const replacements: Record<string, unknown> = { user_id, animal_number, tag }
	if (animal_id !== undefined && [9, 23, 35, 16].includes(tag)) {
		query += '\n      AND aqa.animal_id = :animal_id'
		replacements.animal_id = animal_id
	}
	query += '\n    ORDER BY aqa.created_at DESC\n    LIMIT 1'
	const result = await db.sequelize.query<{ answer: string }>(query, {
		replacements,
		type: QueryTypes.SELECT,
	})
	return result[0]?.answer || 'NA'
}

// Helper to get animal DOB
async function getAnimalDOB(
	user: User,
	animal_number: string,
	animal_id: number,
): Promise<string> {
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
	for (const value1 of motherNumbers as Array<{ answer: string; animal_id: number; animal_number: string }>) {
		if (value1.answer === animal_number) {
			return await getLatestAnswer(
				user.id,
				value1.animal_number,
				value1.animal_id,
				9,
			)
		}
	}
	return 'NA'
}

// Helper to build pregnancy info
function buildPregnancyInfo(params: {
	animal_number: string
	monthOfPregnancy: string
	BullNoForAIAnswer: string
	monthOfDelivery: string
	milkingStatusAnswer: string
	AIDateAnswer1: string
	SemenCompany: string
	pregnancyCycle: string
}): AnimalPregnancyInfo {
	return {
		animal_num: params.animal_number,
		date_of_pregnancy_detection: params.monthOfPregnancy,
		bull_no: params.BullNoForAIAnswer,
		expected_month_of_delevry: params.monthOfDelivery,
		status_milking_dry: params.milkingStatusAnswer,
		date_of_AI: params.AIDateAnswer1,
		Semen_company_name: params.SemenCompany,
		pregnancy_cycle: params.pregnancyCycle,
	}
}

function buildNonPregnancyInfo(params: {
	animal_number: string
	AIDateAnswer1: string
	BullNoForAIAnswer: string
	dateOfPregnancy: string
	animalDOB: string
	SemenCompany: string
	milkingStatusAnswer: string
	pregnancyCycle: string
}): AnimalPregnancyInfo {
	return {
		animal_num: params.animal_number,
		date_of_last_AI: params.AIDateAnswer1,
		bull_no: params.BullNoForAIAnswer,
		date_of_pregnancy_detection: params.dateOfPregnancy,
		date_of_last_delivery: params.animalDOB,
		Semen_company_name: params.SemenCompany,
		status_milking_dry: params.milkingStatusAnswer,
		pregnancy_cycle: params.pregnancyCycle,
	}
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
			const animalSex = await getLatestAnswer(
				user.id,
				animal_number,
				undefined,
				8,
			)
			if (animalSex !== 'female') continue
			const pregnancyStateAnswer = (
				await getLatestAnswer(user.id, animal_number, undefined, 15)
			).toLowerCase()
			if (!pregnancyStateAnswer) continue
			const SemenCompany = await getLatestAnswer(
				user.id,
				animal_number,
				undefined,
				42,
			)
			const pregnancyCycle = await getLatestAnswer(
				user.id,
				animal_number,
				undefined,
				59,
			)
			const animalDOB = await getAnimalDOB(user, animal_number, animal_id)
			const AIDateAnswer1 = await getLatestAnswer(
				user.id,
				animal_number,
				animal_id,
				23,
			)
			const BullNoForAIAnswer = await getLatestAnswer(
				user.id,
				animal_number,
				animal_id,
				35,
			)
			const milkingStatus = await getLatestAnswer(
				user.id,
				animal_number,
				animal_id,
				16,
			)
			let milkingStatusAnswer = 'NA'
			if (milkingStatus !== 'NA') {
				const status = milkingStatus.toLowerCase()
				milkingStatusAnswer = status === 'yes' ? 'Lactating' : 'Non-Lactating'
			}
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
			if (pregnancyStateAnswer === 'yes') {
				if (!pregnant[animal_name]) pregnant[animal_name] = []
				pregnant[animal_name].push(
					buildPregnancyInfo({
						animal_number,
						monthOfPregnancy,
						BullNoForAIAnswer,
						monthOfDelivery,
						milkingStatusAnswer,
						AIDateAnswer1,
						SemenCompany,
						pregnancyCycle,
					}),
				)
			} else {
				let dateOfPregnancy = 'NA'
				if (AIDateAnswer1 !== 'NA') {
					const aiDate = new Date(AIDateAnswer1)
					if (!isNaN(aiDate.getTime())) {
						aiDate.setMonth(aiDate.getMonth() + 3)
						dateOfPregnancy = aiDate.toISOString().slice(0, 10)
					}
				}
				if (!nonpregnant[animal_name]) nonpregnant[animal_name] = []
				nonpregnant[animal_name].push(
					buildNonPregnancyInfo({
						animal_number,
						AIDateAnswer1,
						BullNoForAIAnswer,
						dateOfPregnancy,
						animalDOB,
						SemenCompany,
						milkingStatusAnswer,
						pregnancyCycle,
					}),
				)
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
