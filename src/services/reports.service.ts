import db from '@/config/database'
import { User } from '@/models/user.model'
import { Op, QueryTypes } from 'sequelize'

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

interface AnimalData {
	animal_number: string
	animal_id: number
	animal_name: string
	animalSex: string
	pregnancyStateAnswer: string
	SemenCompany: string
	pregnancyCycle: string
	animalDOB: string
	AIDateAnswer1: string
	BullNoForAIAnswer: string
	milkingStatusAnswer: string
}

interface PregnancyCalculationData {
	monthOfPregnancy: string
	monthOfDelivery: string
}

interface NonPregnancyCalculationData {
	dateOfPregnancy: string
}

async function getLatestAnswer(
	user_id: number,
	animal_number: string,
	animal_id: number | undefined,
	tag: number,
): Promise<string> {
	const result = await db.sequelize.query<{ answer: string }>(
		`SELECT aqa.answer
     FROM common_questions cq
     JOIN animal_question_answers aqa ON aqa.question_id = cq.id
     WHERE cq.question_tag = :tag
       AND aqa.user_id = :user_id
       AND aqa.animal_number = :animal_number
       AND aqa.status <> 1
     ORDER BY aqa.created_at DESC
     LIMIT 1`,
		{
			replacements: { tag, user_id, animal_number },
			type: QueryTypes.SELECT,
		},
	)
	return result[0]?.answer || 'NA'
}

async function getAnimalDOB(
	user: User,
	animal_number: string,
	animal_id: number,
): Promise<string> {
	const result = await db.sequelize.query<{ answer: string }>(
		`SELECT aqa.answer
     FROM common_questions cq
     JOIN animal_question_answers aqa ON aqa.question_id = cq.id
     WHERE cq.question_tag = 1
       AND aqa.user_id = :user_id
       AND aqa.animal_number = :animal_number
       AND aqa.animal_id = :animal_id
       AND aqa.status <> 1
     ORDER BY aqa.created_at DESC
     LIMIT 1`,
		{
			replacements: {
				user_id: user.id,
				animal_number,
				animal_id,
			},
			type: QueryTypes.SELECT,
		},
	)
	return result[0]?.answer || 'NA'
}

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

	private static async fetchAnimalsData(user: User): Promise<AnimalWithName[]> {
		return (await db.AnimalQuestionAnswer.findAll({
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
	}

	private static async collectAnimalData(
		user: User,
		animal: AnimalWithName,
	): Promise<AnimalData | null> {
		const { animal_number, animal_id } = animal
		const animal_name = animal['Animal.name'] || 'Unknown'

		const animalSex = await getLatestAnswer(
			user.id,
			animal_number,
			undefined,
			8,
		)
		if (animalSex !== 'female') return null

		const pregnancyStateAnswer = (
			await getLatestAnswer(user.id, animal_number, undefined, 15)
		).toLowerCase()
		if (!pregnancyStateAnswer) return null

		const [
			SemenCompany,
			pregnancyCycle,
			animalDOB,
			AIDateAnswer1,
			BullNoForAIAnswer,
			milkingStatus,
		] = await Promise.all([
			getLatestAnswer(user.id, animal_number, undefined, 42),
			getLatestAnswer(user.id, animal_number, undefined, 59),
			getAnimalDOB(user, animal_number, animal_id),
			getLatestAnswer(user.id, animal_number, animal_id, 23),
			getLatestAnswer(user.id, animal_number, animal_id, 35),
			getLatestAnswer(user.id, animal_number, animal_id, 16),
		])

		const milkingStatusAnswer = this.calculateMilkingStatus(milkingStatus)

		return {
			animal_number,
			animal_id,
			animal_name,
			animalSex,
			pregnancyStateAnswer,
			SemenCompany,
			pregnancyCycle,
			animalDOB,
			AIDateAnswer1,
			BullNoForAIAnswer,
			milkingStatusAnswer,
		}
	}

	private static calculateMilkingStatus(milkingStatus: string): string {
		if (milkingStatus === 'NA') return 'NA'
		const status = milkingStatus.toLowerCase()
		return status === 'yes' ? 'Lactating' : 'Non-Lactating'
	}

	private static calculatePregnancyDates(
		pregnancyStateAnswer: string,
		AIDateAnswer1: string,
		animal_name: string,
	): PregnancyCalculationData {
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

		return { monthOfPregnancy, monthOfDelivery }
	}

	private static calculateNonPregnancyDate(
		AIDateAnswer1: string,
	): NonPregnancyCalculationData {
		let dateOfPregnancy = 'NA'

		if (AIDateAnswer1 !== 'NA') {
			const aiDate = new Date(AIDateAnswer1)
			if (!isNaN(aiDate.getTime())) {
				aiDate.setMonth(aiDate.getMonth() + 3)
				dateOfPregnancy = aiDate.toISOString().slice(0, 10)
			}
		}

		return { dateOfPregnancy }
	}

	private static addToPregnantList(
		pregnant: Record<string, AnimalPregnancyInfo[]>,
		animalData: AnimalData,
		pregnancyData: PregnancyCalculationData,
	): void {
		const { animal_name } = animalData
		if (!pregnant[animal_name]) pregnant[animal_name] = []

		pregnant[animal_name].push(
			buildPregnancyInfo({
				animal_number: animalData.animal_number,
				monthOfPregnancy: pregnancyData.monthOfPregnancy,
				BullNoForAIAnswer: animalData.BullNoForAIAnswer,
				monthOfDelivery: pregnancyData.monthOfDelivery,
				milkingStatusAnswer: animalData.milkingStatusAnswer,
				AIDateAnswer1: animalData.AIDateAnswer1,
				SemenCompany: animalData.SemenCompany,
				pregnancyCycle: animalData.pregnancyCycle,
			}),
		)
	}

	private static addToNonPregnantList(
		nonpregnant: Record<string, AnimalPregnancyInfo[]>,
		animalData: AnimalData,
		nonPregnancyData: NonPregnancyCalculationData,
	): void {
		const { animal_name } = animalData
		if (!nonpregnant[animal_name]) nonpregnant[animal_name] = []

		nonpregnant[animal_name].push(
			buildNonPregnancyInfo({
				animal_number: animalData.animal_number,
				AIDateAnswer1: animalData.AIDateAnswer1,
				BullNoForAIAnswer: animalData.BullNoForAIAnswer,
				dateOfPregnancy: nonPregnancyData.dateOfPregnancy,
				animalDOB: animalData.animalDOB,
				SemenCompany: animalData.SemenCompany,
				milkingStatusAnswer: animalData.milkingStatusAnswer,
				pregnancyCycle: animalData.pregnancyCycle,
			}),
		)
	}

	public static async getPregnantNonPregnantAnimalsList(user: User): Promise<{
		pregnant: Record<string, AnimalPregnancyInfo[]>
		non_pregnant: Record<string, AnimalPregnancyInfo[]>
	}> {
		if (!user) throw new Error('User not found')

		const pregnant: Record<string, AnimalPregnancyInfo[]> = {}
		const nonpregnant: Record<string, AnimalPregnancyInfo[]> = {}

		const animals = await this.fetchAnimalsData(user)

		for (const animal of animals) {
			const animalData = await this.collectAnimalData(user, animal)
			if (!animalData) continue

			const { pregnancyStateAnswer, AIDateAnswer1, animal_name } = animalData

			if (pregnancyStateAnswer === 'yes') {
				const pregnancyData = this.calculatePregnancyDates(
					pregnancyStateAnswer,
					AIDateAnswer1,
					animal_name,
				)
				this.addToPregnantList(pregnant, animalData, pregnancyData)
			} else {
				const nonPregnancyData = this.calculateNonPregnancyDate(AIDateAnswer1)
				this.addToNonPregnantList(nonpregnant, animalData, nonPregnancyData)
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
