import db from '@/config/database'
import { User } from '@/models/user.model'
import { Op, QueryTypes } from 'sequelize'

export interface AnimalHealthReportResult {
	total_cost_of_treatment: number
	total_animal: number
	[key: string]: unknown
}

interface AnswerData {
	question: string | null
	answer: string | null
	animal_number: string | null
	answered_at: string
}

export interface AnimalMilkProductionQuantityReportResult {
	morning: Record<string, MilkRecordEntry> | []
	evening: Record<string, MilkRecordEntry[]> | []
	morningTotal: string
	eveningTotal: string
	TotalLitresInMorning: string
	TotalLitresInEvening: string
}

export interface MilkRecordEntry {
	daily_record_question_id: number
	question: string
	answer: { price: number; amount: number }[]
	answer_date: string
}

export interface AnimalMilkProductionQualityReportResult {
	data: Record<string, Record<string, MilkQualityRecordEntry[]>> | []
	totalMorningFat: string
	totalMorningSNF: string
	totaleveningFat: string
	totaleveningSNF: string
}

export interface MilkQualityRecordEntry {
	daily_record_question_id: number
	question: string
	answer: { name: number }[]
	answer_date: string
}

export interface ManureRecordEntry {
	daily_record_question_id: number
	question: string
	answer: { price: number; amount: number }[]
	answer_date: string
}

export interface ManureProductionReportResult {
	data: Record<string, ManureRecordEntry[]> | []
	'Total manure production amount': string
	'Total manure production': string
}

export interface ProfitLossReportResult {
	totalIncomeWithSellingPrice: string
	totalExpenseWithPurchasePrice: string
	profitWithSellingAndPurchasePrice: string
	lossWithSellingAndPurchasePrice: string
	totalIncomeWithoutSellingPrice: string
	totalExpenseWithoutPurchasePrice: string
	profitWithoutSellingAndPurchasePrice: string
	lossWithoutSellingAndPurchasePrice: string
	totalbreedingExpense: number
}

export interface SummaryReportResult {
	Expense: string
	Income: string
	Profit: string
	GreenFeed: string
	CattleFeed: string
	DryFeed: string
	OtherExpense: string
	supplement: string
	breediingExpense: string
}

export interface FarmInvestmentReportResult {
	reportData: FarmInvestmentEntry[]
	total_investment: string
	number_of_investments: number
}

export interface FarmInvestmentEntry {
	id: number
	type_of_investment: string | null
	amount_in_rs: number
	date_of_installation_or_purchase: string
	age_in_year: string
}

export interface TotalExpenseAggregateAverageResult {
	aggregate: {
		greenFeedQty: string
		dryFeedQty: string
		cattleFeedQty: string
		supplementQty: string
		greenFeedCost: string
		dryFeedCost: string
		cattleFeedCost: string
		supplementCost: string
		totalExpense: string
		purchaseExpense: string
		medicalExpense: string
		breedingExpense: string
		otherExpense: string
	}
	average: {
		greenFeedQty: string
		dryFeedQty: string
		cattleFeedQty: string
		supplementQty: string
		greenFeedCost: string
		dryFeedCost: string
		cattleFeedCost: string
		supplementCost: string
		totalExpense: string
		purchaseExpense: string
		medicalExpense: string
		breedingExpense: string
		otherExpense: string
	}
}

export interface HealthReportDetailsEntry {
	date: string | null
	diseasName: string | null
	details_of_treatment: string | null
	milk_loss_in_litres: string | null
	animal_number: string
}

export interface HealthReportDetailsResult {
	animal_count: number
	total_cost_of_treatment: number
	data: HealthReportDetailsEntry[]
}

export interface LatestProfitLossReportResult {
	date: string
	profit_loss: string
	key: 'profit' | 'loss' | null
}

export interface AnimalMilkReportDetailsRow {
	date: string | null
	animalNumber: string
	morningFat: string | null
	morningSNF: string | null
	eveningFat: string | null
	eveningSNF: string | null
	bacterialCount: string | null
	somaticCellCount: string | null
}

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

export class ReportsService {
	// Get animal health report
	public static async animalHealthReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalHealthReportResult | []> {
		const [costResult, answersResult] = await Promise.all([
			// Get total cost of treatment
			db.sequelize.query(
				`
                SELECT COALESCE(SUM(JSON_EXTRACT(dqa.answer, '$[0].price')), 0) as total_cost
                FROM daily_record_questions drq
                JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id 
				    AND dqa.deleted_at IS NULL
                JOIN question_tag_mapping qtm ON qtm.question_id = drq.id 
				    AND qtm.deleted_at IS NULL
                WHERE DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
                AND dqa.user_id = :user_id
                AND qtm.question_tag_id = 37
				AND drq.delete_status <> 1
                `,
				{
					replacements: { start_date, end_date, user_id },
					type: QueryTypes.SELECT,
				},
			) as unknown as [{ total_cost: number }],

			// Get answers with all necessary data
			db.sequelize.query(
				`
                SELECT 
                   cq.question,
                   aqa.answer,
                   aqa.created_at,
                   aqa.animal_number
                FROM common_questions cq
                JOIN animal_question_answers aqa ON aqa.question_id = cq.id 
				    AND aqa.deleted_at IS NULL
                WHERE aqa.user_id = :user_id
                AND aqa.question_id IN (SELECT id FROM animal_questions WHERE question_tag = 5 AND deleted_at IS NULL)
                AND DATE(aqa.created_at) BETWEEN :start_date AND :end_date
				AND cq.deleted_at IS NULL
                `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as {
				question: string
				answer: string
				created_at: string
				animal_number: string
			}[],
		])

		const result = answersResult.reduce(
			(acc, value) => {
				// Track unique animals
				if (!acc.animals[value.animal_number]) {
					acc.animals[value.animal_number] = true
					acc.animalCount++
				}

				// Initialize nested structure
				if (!acc.resData[value.animal_number]) {
					acc.resData[value.animal_number] = {}
				}
				if (!acc.resData[value.animal_number][value.created_at]) {
					acc.resData[value.animal_number][value.created_at] = []
				}

				// Add answer data
				acc.resData[value.animal_number][value.created_at].push({
					question: value.question ?? null,
					answer: value.answer ?? null,
					animal_number: value.animal_number ?? null,
					answered_at: value.created_at,
				})

				return acc
			},
			{
				animals: {} as Record<string, boolean>,
				animalCount: 0,
				resData: {} as Record<string, Record<string, AnswerData[]>>,
			},
		)

		if (result.animalCount === 0) {
			return []
		}
		const resData: AnimalHealthReportResult = {
			total_cost_of_treatment: costResult[0]?.total_cost || 0,
			total_animal: result.animalCount,
			...result.resData,
		}

		return resData
	}

	// Get animal milk production report
	public static async animalMilkProductionQuantityReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalMilkProductionQuantityReportResult | []> {
		const [morningMilk, eveningMilk] = await Promise.all([
			// Morning milk query (question_tag_id = 26)
			db.sequelize.query(
				`
			    SELECT 
				    dqa.daily_record_question_id,
				    drq.question,
				    dqa.answer,
				    dqa.answer_date
			    FROM daily_record_questions drq
			    JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id
				    AND dqa.deleted_at IS NULL
			    JOIN question_tag_mapping qtm ON qtm.question_id = drq.id 
				    AND qtm.deleted_at IS NULL
			    WHERE dqa.user_id = :user_id
			    AND qtm.question_tag_id = 26
			    AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			    AND drq.delete_status <> 1
			    ORDER BY dqa.answer_date DESC
		    `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as Promise<
				{
					daily_record_question_id: number
					question: string
					answer: string
					answer_date: string
				}[]
			>,

			// Evening milk query (question_tag_id = 27)
			db.sequelize.query(
				`
			    SELECT 
				    dqa.daily_record_question_id,
				    drq.question,
				    dqa.answer,
				    dqa.answer_date
			    FROM daily_record_questions drq
			    JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			    JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			    WHERE dqa.user_id = :user_id
			    AND qtm.question_tag_id = 27
			    AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			    AND drq.delete_status <> 1
			    ORDER BY dqa.answer_date DESC
			`,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as Promise<
				{
					daily_record_question_id: number
					question: string
					answer: string
					answer_date: string
				}[]
			>,
		])

		const morningResult = morningMilk.reduce(
			(acc, value) => {
				const answer = JSON.parse(value.answer) as {
					price: number
					amount: number
				}[]

				acc.data[value.answer_date] = {
					daily_record_question_id: value.daily_record_question_id,
					question: value.question,
					answer: answer,
					answer_date: value.answer_date,
				}

				// Calculate totals (matching PHP logic)
				if (answer[0]) {
					const total = (answer[0].price || 0) * (answer[0].amount || 0)
					acc.morningTotal += total
					acc.TotalLitresInMorning += answer[0].amount || 0
				}
				return acc
			},
			{
				data: {} as Record<string, MilkRecordEntry>,
				morningTotal: 0,
				TotalLitresInMorning: 0,
			},
		)

		const eveningResult = eveningMilk.reduce(
			(acc, value) => {
				const answer = JSON.parse(value.answer) as {
					price: number
					amount: number
				}[]

				if (!acc.data[value.answer_date]) {
					acc.data[value.answer_date] = []
				}

				acc.data[value.answer_date].push({
					daily_record_question_id: value.daily_record_question_id,
					question: value.question,
					answer: answer,
					answer_date: value.answer_date,
				})

				if (answer[0]) {
					const total = (answer[0].price || 0) * (answer[0].amount || 0)
					acc.eveningTotal += total
					acc.TotalLitresInEvening += answer[0].amount || 0
				}
				return acc
			},
			{
				data: {} as Record<string, MilkRecordEntry[]>,
				eveningTotal: 0,
				TotalLitresInEvening: 0,
			},
		)

		const result: AnimalMilkProductionQuantityReportResult = {
			morning:
				Object.keys(morningResult.data).length === 0 ? [] : morningResult.data,
			evening:
				Object.keys(eveningResult.data).length === 0 ? [] : eveningResult.data,
			morningTotal: morningResult.morningTotal.toFixed(2),
			eveningTotal: eveningResult.eveningTotal.toFixed(2),
			TotalLitresInMorning: morningResult.TotalLitresInMorning.toFixed(2),
			TotalLitresInEvening: eveningResult.TotalLitresInEvening.toFixed(2),
		}

		return result
	}

	// Get animal milk production quality report
	public static async animalMilkProductionQualityReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalMilkProductionQualityReportResult | []> {
		const query = `
        SELECT 
            dqa.daily_record_question_id,
            drq.question,
            dqa.answer,
            dqa.answer_date,
            qt.name,
            qtm.question_tag_id
        FROM daily_record_questions drq
        INNER JOIN daily_record_question_answer dqa 
            ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        INNER JOIN question_tag_mapping qtm 
            ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        INNER JOIN question_tags qt 
            ON qt.id = qtm.question_tag_id AND qt.deleted_at IS NULL
        WHERE 
            dqa.user_id = :user_id 
            AND DATE(dqa.answer_date) >= :start_date
            AND DATE(dqa.answer_date) <= :end_date
            AND qtm.question_tag_id IN (17, 18, 19, 20)
			AND drq.delete_status <> 1
        ORDER BY dqa.answer_date DESC;
        `

		const data = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: {
				start_date,
				end_date,
				user_id,
			},
		})) as unknown as {
			daily_record_question_id: number
			answer: string
			answer_date: string
			question: string
			name: string
			question_tag_id: number
		}[]

		const totals = new Map([
			[17, { sum: 0, count: 0, name: 'morningFat' }],
			[18, { sum: 0, count: 0, name: 'morningSNF' }],
			[19, { sum: 0, count: 0, name: 'eveningFat' }],
			[20, { sum: 0, count: 0, name: 'eveningSNF' }],
		])

		const resData = data.reduce(
			(acc, record) => {
				const answerDate = record.answer_date
				const questionTagId = record.question_tag_id
				const tagName = record.name
				const question = record.question

				const parsedAnswer = JSON.parse(record.answer) as unknown as {
					name: number
				}[]

				if (!acc[answerDate]) {
					acc[answerDate] = {}
				}
				if (!acc[answerDate][tagName]) {
					acc[answerDate][tagName] = []
				}

				acc[answerDate][tagName].push({
					daily_record_question_id: record.daily_record_question_id,
					question: question,
					answer: parsedAnswer,
					answer_date: answerDate,
				})

				const answerValue = parsedAnswer?.[0]?.name || 0
				if (totals.has(questionTagId)) {
					const total = totals.get(questionTagId)!
					total.sum += answerValue
					total.count++
				}

				return acc
			},
			{} as Record<string, Record<string, MilkQualityRecordEntry[]>>,
		)

		const calculateAverage = (tagId: number): string => {
			const { sum, count } = totals.get(tagId)!
			return (sum / (count || 1)).toFixed(2)
		}

		const [morningFatAvg, morningSNFAvg, eveningFatAvg, eveningSNFAvg] = [
			17, 18, 19, 20,
		].map(calculateAverage)

		return {
			data: Object.keys(resData).length === 0 ? [] : resData,
			totalMorningFat: morningFatAvg,
			totalMorningSNF: morningSNFAvg,
			totaleveningFat: eveningFatAvg,
			totaleveningSNF: eveningSNFAvg,
		}
	}

	// Get manure production report
	public static async manureProductionReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ManureProductionReportResult> {
		const query = `
        SELECT 
            dqa.daily_record_question_id,
            drq.question,
            dqa.answer,
            dqa.answer_date,
            qt.name,
            qtm.question_tag_id
        FROM daily_record_questions drq
        INNER JOIN daily_record_question_answer dqa 
            ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        INNER JOIN question_tag_mapping qtm 
            ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        INNER JOIN question_tags qt 
            ON qt.id = qtm.question_tag_id AND qt.deleted_at IS NULL
        WHERE 
            DATE(dqa.answer_date) >= ?
            AND DATE(dqa.answer_date) <= ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 29
            AND drq.delete_status <> 1
        ORDER BY dqa.answer_date DESC
        `

		const data = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: [start_date, end_date, user_id],
		})) as unknown as {
			daily_record_question_id: number
			question: string
			answer: string
			answer_date: string
			name: string
			question_tag_id: number
		}[]

		let totalmanureProductionPrice = 0
		let totalmanureProduction = 0

		const resData = data.reduce(
			(acc, record) => {
				const answerDate = record.answer_date

				const parsedAnswer = JSON.parse(record.answer) as {
					price: number
					amount: number
				}[]

				const amount = parsedAnswer?.[0]?.amount ?? 0
				const price = parsedAnswer?.[0]?.price ?? 0
				const totalPrice = price * amount

				totalmanureProduction += amount
				totalmanureProductionPrice += totalPrice

				if (!acc[answerDate]) {
					acc[answerDate] = []
				}

				acc[answerDate].push({
					daily_record_question_id: record.daily_record_question_id,
					question: record.question,
					answer: parsedAnswer,
					answer_date: answerDate,
				})

				return acc
			},
			{} as Record<string, ManureRecordEntry[]>,
		)

		return {
			data: Object.keys(resData).length === 0 ? [] : resData,
			'Total manure production amount': totalmanureProductionPrice.toFixed(2),
			'Total manure production': totalmanureProduction.toFixed(2),
		}
	}

	// Get profit loss report
	private static async fetchIncomeWithSellingPrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ answer: string }[]> {
		const query = `
        SELECT DISTINCT(dqa.daily_record_question_id), 
               drq.question, 
               dqa.answer, 
               dqa.answer_date
        FROM daily_record_questions drq
        INNER JOIN daily_record_question_answer dqa 
            ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        INNER JOIN question_tag_mapping qtm 
            ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        WHERE 
            DATE(dqa.answer_date) >= ?
            AND DATE(dqa.answer_date) <= ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id IN (28, 2)
            AND drq.delete_status <> 1
        ORDER BY dqa.answer_date DESC
    `

		return (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: [start_date, end_date, user_id],
		})) as unknown as { answer: string }[]
	}
	private static async fetchIncome(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ answer: string }[]> {
		const query = `
        SELECT DISTINCT(dqa.daily_record_question_id), 
               drq.question, 
               dqa.answer, 
               dqa.answer_date
        FROM daily_record_questions drq
        INNER JOIN daily_record_question_answer dqa 
            ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        INNER JOIN question_tag_mapping qtm 
            ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        WHERE 
            DATE(dqa.answer_date) >= ?
            AND DATE(dqa.answer_date) <= ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 2
            AND drq.delete_status <> 1
        ORDER BY dqa.answer_date DESC
    `

		return (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: [start_date, end_date, user_id],
		})) as unknown as { answer: string }[]
	}
	private static async fetchBreedingExpense(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ answer: string }[]> {
		const query = `
        SELECT DISTINCT(aqa.question_id), 
               cq.question, 
               aqa.answer, 
               aqa.created_at
        FROM animal_question_answers aqa
        INNER JOIN common_questions cq 
            ON cq.id = aqa.question_id AND cq.deleted_at IS NULL
        WHERE 
            DATE(aqa.created_at) >= ?
            AND DATE(aqa.created_at) <= ?
            AND aqa.user_id = ?
            AND cq.question_tag IN (36)
			AND aqa.deleted_at IS NULL
        ORDER BY aqa.created_at DESC
    `

		return (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: [start_date, end_date, user_id],
		})) as unknown as { answer: string }[]
	}
	private static async fetchExpenseWithPurchasePrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ answer: string }[]> {
		const query = `
        SELECT DISTINCT(dqa.daily_record_question_id), 
               drq.question, 
               dqa.answer, 
               dqa.answer_date
        FROM daily_record_questions drq
        INNER JOIN daily_record_question_answer dqa 
            ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        INNER JOIN question_tag_mapping qtm 
            ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        WHERE 
            DATE(dqa.answer_date) >= ?
            AND DATE(dqa.answer_date) <= ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id IN (1, 22)
            AND drq.delete_status <> 1
        ORDER BY dqa.answer_date DESC
    `

		return (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: [start_date, end_date, user_id],
		})) as unknown as { answer: string }[]
	}
	private static async fetchExpense(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ answer: string }[]> {
		const query = `
        SELECT DISTINCT(dqa.daily_record_question_id), 
               drq.question, 
               dqa.answer, 
               dqa.answer_date
        FROM daily_record_questions drq
        INNER JOIN daily_record_question_answer dqa 
            ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        INNER JOIN question_tag_mapping qtm 
            ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        WHERE 
            DATE(dqa.answer_date) >= ?
            AND DATE(dqa.answer_date) <= ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 1
            AND drq.delete_status <> 1
        ORDER BY dqa.answer_date DESC
    `

		return (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: [start_date, end_date, user_id],
		})) as unknown as { answer: string }[]
	}
	private static calculateProfitLossTotals(data: {
		incomeWithSellingPrice: { answer: string }[]
		income: { answer: string }[]
		breedingExpense: { answer: string }[]
		expenseWithPurchasePrice: { answer: string }[]
		expense: { answer: string }[]
	}): {
		totalIncome: number
		totalExpense: number
		profit: number
		loss: number
		totalIncomeWithoutSellingPrice: number
		totalExpenseWithoutPurchasePrice: number
		profitWithoutSellingAndPurchasePrice: number
		lossWithoutSellingAndPurchasePrice: number
		breedingTotal: number
	} {
		const totalIncomeWithoutSellingPrice = data.income.reduce(
			(total, record) => {
				try {
					const answers = JSON.parse(record.answer) as {
						price: number
						amount?: number
					}[]
					return (
						total +
						answers.reduce((sum, item) => {
							const amount = item.amount || 1
							return sum + item.price * amount
						}, 0)
					)
				} catch {
					return total
				}
			},
			0,
		)

		const totalIncome = data.incomeWithSellingPrice.reduce((total, record) => {
			try {
				const answers = JSON.parse(record.answer) as {
					price: number
					amount?: number
				}[]
				return (
					total +
					answers.reduce((sum, item) => {
						const amount = item.amount || 1
						return sum + item.price * amount
					}, 0)
				)
			} catch {
				return total
			}
		}, 0)

		const breedingTotal = data.breedingExpense.reduce((total, record) => {
			const value = Number.parseFloat(record.answer)
			return total + (Number.isNaN(value) ? 0 : value)
		}, 0)

		const totalExpenseWithoutPurchasePrice = data.expense.reduce(
			(total, record) => {
				try {
					const answers = JSON.parse(record.answer) as {
						price: number
						amount?: number
					}[]
					return (
						total +
						answers.reduce((sum, item) => {
							const amount = item.amount || 1
							return sum + item.price * amount
						}, 0)
					)
				} catch {
					return total
				}
			},
			0,
		)

		const totalExpense = data.expenseWithPurchasePrice.reduce(
			(total, record) => {
				try {
					const answers = JSON.parse(record.answer) as {
						price: number
						amount?: number
					}[]
					return (
						total +
						answers.reduce((sum, item) => {
							const amount = item.amount || 1
							return sum + item.price * amount
						}, 0)
					)
				} catch {
					return total
				}
			},
			0,
		)

		const total = totalIncome - (totalExpense + breedingTotal)
		const totalWithoutSellingAndPurchasePrice =
			totalIncomeWithoutSellingPrice -
			(totalExpenseWithoutPurchasePrice + breedingTotal)

		const profit = Math.max(total, 0)
		const loss = Math.max(-total, 0)
		const profitWithoutSellingAndPurchasePrice = Math.max(
			totalWithoutSellingAndPurchasePrice,
			0,
		)
		const lossWithoutSellingAndPurchasePrice = Math.max(
			-totalWithoutSellingAndPurchasePrice,
			0,
		)

		return {
			totalIncome,
			totalExpense,
			profit,
			loss,
			totalIncomeWithoutSellingPrice,
			totalExpenseWithoutPurchasePrice,
			profitWithoutSellingAndPurchasePrice,
			lossWithoutSellingAndPurchasePrice,
			breedingTotal,
		}
	}
	private static buildProfitLossReportResult(calculations: {
		totalIncome: number
		totalExpense: number
		profit: number
		loss: number
		totalIncomeWithoutSellingPrice: number
		totalExpenseWithoutPurchasePrice: number
		profitWithoutSellingAndPurchasePrice: number
		lossWithoutSellingAndPurchasePrice: number
		breedingTotal: number
	}): ProfitLossReportResult {
		return {
			totalIncomeWithSellingPrice: calculations.totalIncome.toFixed(2),
			totalExpenseWithPurchasePrice: calculations.totalExpense.toFixed(2),
			profitWithSellingAndPurchasePrice: calculations.profit.toFixed(2),
			lossWithSellingAndPurchasePrice: calculations.loss.toFixed(2),
			totalIncomeWithoutSellingPrice:
				calculations.totalIncomeWithoutSellingPrice.toFixed(2),
			totalExpenseWithoutPurchasePrice:
				calculations.totalExpenseWithoutPurchasePrice.toFixed(2),
			profitWithoutSellingAndPurchasePrice:
				calculations.profitWithoutSellingAndPurchasePrice.toFixed(2),
			lossWithoutSellingAndPurchasePrice:
				calculations.lossWithoutSellingAndPurchasePrice.toFixed(2),
			totalbreedingExpense: calculations.breedingTotal,
		}
	}

	public static async profitLossReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossReportResult> {
		const [
			incomeWithSellingPrice,
			income,
			breedingExpense,
			expenseWithPurchasePrice,
			expense,
		] = await Promise.all([
			this.fetchIncomeWithSellingPrice(user_id, start_date, end_date),
			this.fetchIncome(user_id, start_date, end_date),
			this.fetchBreedingExpense(user_id, start_date, end_date),
			this.fetchExpenseWithPurchasePrice(user_id, start_date, end_date),
			this.fetchExpense(user_id, start_date, end_date),
		])

		const calculations = this.calculateProfitLossTotals({
			incomeWithSellingPrice,
			income,
			breedingExpense,
			expenseWithPurchasePrice,
			expense,
		})

		return this.buildProfitLossReportResult(calculations)
	}

	// Summary Report
	private static processAnswers(records: { answer: string }[]): number {
		return records.reduce((total, record) => {
			try {
				const answer = JSON.parse(record.answer) as {
					price: number
					amount?: number
				}[]
				return (
					total +
					answer.reduce(
						(
							subtotal: number,
							item: {
								price: number
								amount?: number | string
							},
						) => {
							const amount =
								!item.amount || item.amount === '' ? 1 : Number(item.amount)
							const price = Number(item.price) * amount
							return subtotal + price
						},
						0,
					)
				)
			} catch {
				return total
			}
		}, 0)
	}
	public static async summaryReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<SummaryReportResult> {
		const expenseRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
			FROM daily_record_questions drq
			JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			  AND qtm.question_tag_id IN (1)
			  AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			  AND drq.delete_status <> 1
			ORDER BY dqa.answer_date DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const incomeRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
			FROM daily_record_questions drq
			JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			  AND qtm.question_tag_id = 2
			  AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			  AND drq.delete_status <> 1
			ORDER BY dqa.answer_date DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const greenFeedRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
			FROM daily_record_questions drq
			JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			  AND qtm.question_tag_id = 30
			  AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			  AND drq.delete_status <> 1
			ORDER BY dqa.answer_date DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const cattleFeedRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
			FROM daily_record_questions drq
			JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			  AND qtm.question_tag_id = 31
			  AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			  AND drq.delete_status <> 1
			ORDER BY dqa.answer_date DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const dryFeedRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
			FROM daily_record_questions drq
			JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			  AND qtm.question_tag_id = 32
			  AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			  AND drq.delete_status <> 1
			ORDER BY dqa.answer_date DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const supplementRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
			FROM daily_record_questions drq
			JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			  AND qtm.question_tag_id = 33
			  AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			  AND drq.delete_status <> 1
			ORDER BY dqa.answer_date DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const breedingRecords = (await db.sequelize.query(
			`
			SELECT DISTINCT(aqa.question_id), cq.question, aqa.answer, aqa.created_at
			FROM animal_question_answers aqa
			JOIN common_questions cq ON cq.id = aqa.question_id AND cq.deleted_at IS NULL
			WHERE aqa.user_id = :user_id
			  AND cq.question_tag IN (36)
			  AND DATE(aqa.created_at) BETWEEN :start_date AND :end_date
			  AND aqa.deleted_at IS NULL
			ORDER BY aqa.created_at DESC
			`,
			{
				replacements: { user_id, start_date, end_date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]

		const totalExpense = ReportsService.processAnswers(expenseRecords)
		const totalIncome = ReportsService.processAnswers(incomeRecords)
		const totalGreenFeed = ReportsService.processAnswers(greenFeedRecords)
		const totalCattleFeed = ReportsService.processAnswers(cattleFeedRecords)
		const totalDryFeed = ReportsService.processAnswers(dryFeedRecords)
		const totalSupplement = ReportsService.processAnswers(supplementRecords)

		let totalBreedingExpense = 0
		for (const breeding of breedingRecords) {
			const answer = Number(breeding.answer)
			totalBreedingExpense += answer
		}

		const profit = totalIncome - totalExpense
		const otherExpense =
			totalExpense -
			(totalGreenFeed +
				totalCattleFeed +
				totalDryFeed +
				totalSupplement +
				totalBreedingExpense)

		return {
			Expense: totalExpense.toFixed(2),
			Income: totalIncome.toFixed(2),
			Profit: profit.toFixed(2),
			GreenFeed: totalGreenFeed.toFixed(2),
			CattleFeed: totalCattleFeed.toFixed(2),
			DryFeed: totalDryFeed.toFixed(2),
			OtherExpense: otherExpense.toFixed(2),
			supplement: totalSupplement.toFixed(2),
			breediingExpense: totalBreedingExpense.toFixed(2),
		}
	}

	// Farm Investment Report
	public static async farmInvestmentReport(
		user_id: number,
		language_id: number,
	): Promise<FarmInvestmentReportResult> {
		const fixedInvestments = (await db.FixedInvestmentDetails.findAll({
			where: { user_id, deleted_at: null },
			raw: true,
		})) as unknown as {
			id: number
			type_of_investment: number
			amount_in_rs: number
			date_of_installation_or_purchase: string | Date
		}[]

		if (!fixedInvestments.length) {
			return {
				reportData: [],
				total_investment: '0.00',
				number_of_investments: 0,
			}
		}

		const typeIds = [
			...new Set(fixedInvestments.map((f) => f.type_of_investment)),
		]

		const investmentTypes = (await db.InvestmentTypesLanguage.findAll({
			where: {
				investment_type_id: { [Op.in]: typeIds },
				language_id,
			},
			raw: true,
		})) as { investment_type_id: number; investment_type: string }[]

		const typeMap = new Map<number, string>()
		investmentTypes.forEach((t) => {
			typeMap.set(t.investment_type_id, t.investment_type)
		})

		const currentDate = new Date()
		currentDate.setHours(0, 0, 0, 0)

		let total = 0
		const reportData: FarmInvestmentEntry[] = fixedInvestments.map((value) => {
			const type_of_investment = typeMap.get(value.type_of_investment) ?? null

			let purchaseDateStr: string
			if (typeof value.date_of_installation_or_purchase === 'string') {
				purchaseDateStr = value.date_of_installation_or_purchase.split('T')[0]
			} else {
				purchaseDateStr = value.date_of_installation_or_purchase
					.toISOString()
					.split('T')[0]
			}

			const purchaseDate = new Date(purchaseDateStr)
			purchaseDate.setHours(0, 0, 0, 0)

			const diffTime = Math.abs(currentDate.getTime() - purchaseDate.getTime())
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
			const age_in_year = (diffDays / 365).toFixed(1)
			total += Number(value.amount_in_rs)

			return {
				id: value.id,
				type_of_investment,
				amount_in_rs: value.amount_in_rs,
				date_of_installation_or_purchase: purchaseDateStr,
				age_in_year,
			}
		})

		return {
			reportData,
			total_investment: total.toFixed(2),
			number_of_investments: reportData.length,
		}
	}

	// Total Expense Aggregate and Average Report
	public static async totalExpenseAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<TotalExpenseAggregateAverageResult> {
		const data = await this.fetchTotalExpenseData(user_id, start_date, end_date)
		const totals = this.calculateTotalExpenseTotals(data)
		return this.buildTotalExpenseResult(totals, data.daysCount)
	}

	private static async fetchTotalExpenseData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{
		expense: { answer: string; answer_date: string }[]
		greenFeed: { answer: string; answer_date: string }[]
		cattleFeed: { answer: string; answer_date: string }[]
		dryFeed: { answer: string; answer_date: string }[]
		supplement: { answer: string; answer_date: string }[]
		purchasePrice: { answer: string; answer_date: string }[]
		medicalExpense: { answer: string; answer_date: string }[]
		breedingExpense: { question: string; answer: string }[]
		daysCount: number
	}> {
		const [
			expense,
			greenFeed,
			cattleFeed,
			dryFeed,
			supplement,
			purchasePrice,
			medicalExpense,
			breedingExpense,
			daysCount,
		] = await Promise.all([
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 1),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 30),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 31),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 32),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 33),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 22),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 37),
			this.fetchBreedingTotalExpense(user_id, start_date, end_date),
			this.fetchDaysCount(user_id, start_date, end_date),
		])

		return {
			expense,
			greenFeed,
			cattleFeed,
			dryFeed,
			supplement,
			purchasePrice,
			medicalExpense,
			breedingExpense,
			daysCount,
		}
	}

	private static async fetchSummaryDataByTag(
		user_id: number,
		start_date: string,
		end_date: string,
		question_tag_id: number,
	): Promise<
		{
			answer: string
			answer_date: string
		}[]
	> {
		const query = `
		SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
		FROM daily_record_questions drq
		JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
		JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
		WHERE DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
		AND dqa.user_id = :user_id
		AND qtm.question_tag_id = :question_tag_id
		AND drq.delete_status <> 1
		ORDER BY dqa.answer_date DESC
	    `

		return (await db.sequelize.query(query, {
			replacements: {
				start_date,
				end_date,
				user_id,
				question_tag_id,
			},
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as {
			answer: string
			answer_date: string
		}[]
	}
	private static async fetchBreedingTotalExpense(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ question: string; answer: string }[]> {
		const query = `
		SELECT cq.question, aqa.answer, aqa.created_at, aqa.animal_number, aqa.created_at
		FROM common_questions cq
		JOIN animal_question_answers aqa ON aqa.question_id = cq.id AND aqa.deleted_at IS NULL
		WHERE DATE(aqa.created_at) BETWEEN :start_date AND :end_date
		AND aqa.user_id = :user_id
		AND cq.question_tag = 36
		AND cq.deleted_at IS NULL
	`

		return (await db.sequelize.query(query, {
			replacements: {
				start_date,
				end_date,
				user_id,
			},
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as {
			question: string
			answer: string
		}[]
	}
	private static async fetchDaysCount(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<number> {
		const query = `
		SELECT DISTINCT(answer_date) as answer_date
		FROM daily_record_question_answer
		WHERE user_id = :user_id
		AND DATE(answer_date) BETWEEN :start_date AND :end_date
		AND deleted_at IS NULL
	`

		const result = (await db.sequelize.query(query, {
			replacements: {
				start_date,
				end_date,
				user_id,
			},
			type: QueryTypes.SELECT,
			raw: true,
		})) as unknown as { answer_date: string }[]

		return result.length > 0 ? result.length : 1
	}
	private static calculateTotalExpenseTotals(data: {
		expense: { answer: string; answer_date: string }[]
		greenFeed: { answer: string; answer_date: string }[]
		cattleFeed: { answer: string; answer_date: string }[]
		dryFeed: { answer: string; answer_date: string }[]
		supplement: { answer: string; answer_date: string }[]
		purchasePrice: { answer: string; answer_date: string }[]
		medicalExpense: { answer: string; answer_date: string }[]
		breedingExpense: { question: string; answer: string }[]
	}): {
		totalExpense: number
		totalGreenFeed: number
		totalCattleFeed: number
		totalDryFeed: number
		totalSupplement: number
		greenFeedQty: number
		dryFeedQty: number
		cattleFeedQty: number
		supplementQty: number
		totalpurchasePrice: number
		totalcostOfTreatment: number
		totalbreedingExpense: number
		otherExpense: number
	} {
		const totalExpense = this.calculateTotalFromArray(data.expense)
		const totalGreenFeed = this.calculateTotalWithQuantity(data.greenFeed)
		const totalCattleFeed = this.calculateTotalWithQuantity(data.cattleFeed)
		const totalDryFeed = this.calculateTotalWithQuantity(data.dryFeed)
		const totalSupplement = this.calculateTotalWithQuantity(data.supplement)
		const totalpurchasePrice = this.calculateTotalFromArray(data.purchasePrice)
		const totalcostOfTreatment = this.calculateMedicalExpense(
			data.medicalExpense,
		)
		const totalbreedingExpense = this.calculateBreedingTotal(
			data.breedingExpense,
		)

		const otherExpense =
			totalExpense +
			totalpurchasePrice +
			totalbreedingExpense -
			(totalGreenFeed.total +
				totalCattleFeed.total +
				totalDryFeed.total +
				totalSupplement.total +
				totalcostOfTreatment +
				totalbreedingExpense +
				totalpurchasePrice)

		return {
			totalExpense,
			totalGreenFeed: totalGreenFeed.total,
			totalCattleFeed: totalCattleFeed.total,
			totalDryFeed: totalDryFeed.total,
			totalSupplement: totalSupplement.total,
			greenFeedQty: totalGreenFeed.quantity,
			dryFeedQty: totalDryFeed.quantity,
			cattleFeedQty: totalCattleFeed.quantity,
			supplementQty: totalSupplement.quantity,
			totalpurchasePrice,
			totalcostOfTreatment,
			totalbreedingExpense,
			otherExpense,
		}
	}
	private static calculateBreedingTotal(data: { answer: string }[]): number {
		let total = 0
		for (const value of data) {
			const val = Number.parseFloat(value.answer)
			if (!Number.isNaN(val)) total += val
		}
		return total
	}
	private static calculateTotalWithQuantity(data: { answer: string }[]): {
		total: number
		quantity: number
	} {
		let total = 0
		let quantity = 0
		for (const value of data as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				total += price
				quantity += amount
			}
		}
		return { total, quantity }
	}
	private static calculateTotalFromArray(data: { answer: string }[]): number {
		let total = 0
		for (const value of data) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				total += price
			}
		}
		return total
	}
	private static calculateMedicalExpense(data: { answer: string }[]): number {
		let total = 0
		for (const value of data as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { price: number }[]
			total += arr[0]?.price ?? 0
		}
		return total
	}
	private static buildTotalExpenseResult(
		totals: {
			totalExpense: number
			totalGreenFeed: number
			totalCattleFeed: number
			totalDryFeed: number
			totalSupplement: number
			greenFeedQty: number
			dryFeedQty: number
			cattleFeedQty: number
			supplementQty: number
			totalpurchasePrice: number
			totalcostOfTreatment: number
			totalbreedingExpense: number
			otherExpense: number
		},
		daysCount: number,
	): TotalExpenseAggregateAverageResult {
		const noOfDays = daysCount || 1
		const aggregate = {
			greenFeedQty: totals.greenFeedQty.toFixed(2),
			dryFeedQty: totals.dryFeedQty.toFixed(2),
			cattleFeedQty: totals.cattleFeedQty.toFixed(2),
			supplementQty: totals.supplementQty.toFixed(2),
			greenFeedCost: totals.totalGreenFeed.toFixed(2),
			dryFeedCost: totals.totalDryFeed.toFixed(2),
			cattleFeedCost: totals.totalCattleFeed.toFixed(2),
			supplementCost: totals.totalSupplement.toFixed(2),
			totalExpense: (
				totals.totalExpense +
				totals.totalpurchasePrice +
				totals.totalbreedingExpense
			).toFixed(2),
			purchaseExpense: totals.totalpurchasePrice.toFixed(2),
			medicalExpense: totals.totalcostOfTreatment.toFixed(2),
			breedingExpense: totals.totalbreedingExpense.toFixed(2),
			otherExpense: totals.otherExpense.toFixed(2),
		}
		const average = {
			greenFeedQty: (totals.greenFeedQty / noOfDays).toFixed(2),
			dryFeedQty: (totals.dryFeedQty / noOfDays).toFixed(2),
			cattleFeedQty: (totals.cattleFeedQty / noOfDays).toFixed(2),
			supplementQty: (totals.supplementQty / noOfDays).toFixed(2),
			greenFeedCost: (totals.totalGreenFeed / noOfDays).toFixed(2),
			dryFeedCost: (totals.totalDryFeed / noOfDays).toFixed(2),
			cattleFeedCost: (totals.totalCattleFeed / noOfDays).toFixed(2),
			supplementCost: (totals.totalSupplement / noOfDays).toFixed(2),
			totalExpense: (
				(totals.totalExpense +
					totals.totalpurchasePrice +
					totals.totalbreedingExpense) /
				noOfDays
			).toFixed(2),
			purchaseExpense: (totals.totalpurchasePrice / noOfDays).toFixed(2),
			medicalExpense: (totals.totalcostOfTreatment / noOfDays).toFixed(2),
			breedingExpense: (totals.totalbreedingExpense / noOfDays).toFixed(2),
			otherExpense: (totals.otherExpense / noOfDays).toFixed(2),
		}
		return { aggregate, average }
	}

	// Health Report
	public static async healthReportDetails(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<HealthReportDetailsResult> {
		//Step:1  Generate date range first
		const dates = this.generateDateRange(start_date, end_date)

		// Step:2 Fetch user animals and daily record questions
		const [userAnimals, dailyRecordQuestions, allAnimalAnswers] =
			await Promise.all([
				this.fetchUserAnimals(user_id),
				this.fetchDailyRecordQuestionsByDateRange(
					user_id,
					start_date,
					end_date,
				),
				this.fetchAllAnimalAnswers(user_id, start_date, end_date),
			])
		// Step:3 Calculate treatment cost
		const totalcostOfTreatment =
			this.calculateTreatmentCostFromRecords(dailyRecordQuestions)

		// Step:4 Process health report data
		const resData = this.processHealthReportDetailsFromPrefetchedData(
			userAnimals,
			dates,
			allAnimalAnswers,
		)

		// Step:5 Extract unique animals
		const animals = this.extractUniqueAnimals(resData)

		return {
			animal_count: animals.length,
			total_cost_of_treatment: totalcostOfTreatment,
			data: resData,
		}
	}
	private static generateDateRange(
		start_date: string,
		end_date: string,
	): string[] {
		const dateFrom = Math.floor(new Date(start_date).getTime() / 1000)
		const dateTo = Math.floor(new Date(end_date).getTime() / 1000)

		const dates: string[] = []

		for (let i = dateFrom; i <= dateTo; i += 86400) {
			const dateStr = new Date(i * 1000).toISOString().split('T')[0] // Y-m-d format
			dates.push(dateStr)
		}

		return dates
	}
	private static async fetchUserAnimals(
		user_id: number,
	): Promise<{ animal_number: string }[]> {
		return (await db.AnimalQuestionAnswer.findAll({
			where: { user_id, deleted_at: null },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
			],
			raw: true,
		})) as unknown as { animal_number: string }[]
	}
	private static async fetchDailyRecordQuestionsByDateRange(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{ answer: string }[]> {
		return (await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: { [Op.between]: [start_date, end_date] },
				deleted_at: null,
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					required: true,
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 37, deleted_at: null },
							required: true,
						},
					],
					where: { delete_status: 0 },
				},
			],
			raw: true,
		})) as unknown as { answer: string }[]
	}
	private static async fetchAllAnimalAnswers(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<
		{
			animal_number: string
			answer: string
			created_at: string
			'CommonQuestion.question_tag': number
		}[]
	> {
		return (await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id,
				created_at: {
					[Op.between]: [`${start_date} 00:00:00`, `${end_date} 23:59:59`],
				},
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: {
						question_tag: { [Op.in]: [38, 39, 40, 41] },
						deleted_at: null,
					},
					required: false,
				},
			],
			raw: true,
			order: [['created_at', 'DESC']],
		})) as unknown as {
			answer: string
			animal_number: string
			created_at: string
			'CommonQuestion.question_tag': number
		}[]
	}
	private static calculateTreatmentCostFromRecords(
		dailyRecordQuestions: { answer: string }[],
	): number {
		return dailyRecordQuestions.reduce((total, record) => {
			try {
				const answers = JSON.parse(record.answer) as { price: number }[]
				return total + (answers[0]?.price || 0)
			} catch {
				return total
			}
		}, 0)
	}
	private static processHealthReportDetailsFromPrefetchedData(
		userAnimals: { animal_number: string }[],
		dates: string[],
		allAnimalAnswers: {
			animal_number: string
			created_at: string
			answer: string
			'CommonQuestion.question_tag': number
		}[],
	): HealthReportDetailsEntry[] {
		const resData: HealthReportDetailsEntry[] = []

		// Group answers by animal number and date for faster lookup
		const answersByAnimalAndDate: Record<
			string,
			Record<string, Record<number, string>>
		> = {}

		allAnimalAnswers.forEach((answer) => {
			const animalNumber = answer.animal_number
			const date = answer.created_at.split(' ')[0] // Extract date part
			const questionTag = answer['CommonQuestion.question_tag']
			const answerValue = answer.answer

			if (!answersByAnimalAndDate[animalNumber]) {
				answersByAnimalAndDate[animalNumber] = {}
			}

			if (!answersByAnimalAndDate[animalNumber][date]) {
				answersByAnimalAndDate[animalNumber][date] = {}
			}

			answersByAnimalAndDate[animalNumber][date][questionTag] = answerValue
		})

		// Process each animal and date combination
		userAnimals.forEach((animal) => {
			const animalNumber = animal.animal_number
			const animalAnswers = answersByAnimalAndDate[animalNumber] || {}

			dates.forEach((date) => {
				const dateAnswers = animalAnswers[date] || {}

				const healthData: HealthReportDetailsEntry = {
					date: dateAnswers[38] || null,
					diseasName: dateAnswers[39] || null,
					details_of_treatment: dateAnswers[40] || null,
					milk_loss_in_litres: dateAnswers[41] || null,
					animal_number: animalNumber,
				}

				if (healthData.date) {
					resData.push(healthData)
				}
			})
		})

		return resData
	}
	private static extractUniqueAnimals(
		resData: HealthReportDetailsEntry[],
	): string[] {
		const animals = new Set<string>()
		resData.forEach((entry) => {
			if (entry.date) {
				animals.add(entry.animal_number)
			}
		})
		return Array.from(animals)
	}

	// Profit Loss Report
	public static async latestProfitLossReport(
		user_id: number,
	): Promise<LatestProfitLossReportResult> {
		// Get the latest date from both sources
		const latestDate = await this.getLatestDate(user_id)
		const date1 = latestDate.split('T')[0]

		// Fetch all required data in parallel
		const [incomeRecords, breedingRecords, expenseRecords] = await Promise.all([
			this.fetchIncomeRecords(user_id, date1),
			this.fetchBreedingRecords(user_id, date1),
			this.fetchExpenseRecords(user_id, date1),
		])

		// Calculate totals
		const totalIncomeWithoutSellingPrice =
			this.calculateIncomeTotal(incomeRecords)
		const breedingTotal = this.calculateBreeding(breedingRecords)
		const totalExpenseWithoutPurchasePrice =
			this.calculateExpenseTotal(expenseRecords)

		const totalWithoutSellingAndPurchasePrice =
			totalIncomeWithoutSellingPrice -
			(totalExpenseWithoutPurchasePrice + breedingTotal)

		const key = this.determineProfitLossKey(totalWithoutSellingAndPurchasePrice)

		return {
			date: latestDate,
			profit_loss: totalWithoutSellingAndPurchasePrice.toFixed(2),
			key,
		}
	}

	private static async getLatestDate(user_id: number): Promise<string> {
		const [animalDateResult, dailyRecordResult] = await Promise.all([
			db.sequelize.query(
				`
                SELECT DISTINCT(aqa.question_id), cq.question, aqa.answer, aqa.created_at
                FROM animal_question_answers as aqa
                INNER JOIN common_questions as cq ON cq.id = aqa.question_id 
					AND cq.deleted_at IS NULL
                WHERE aqa.user_id = :user_id
                	AND cq.question_tag IN (36)
					AND aqa.created_at IS NOT NULL
					AND aqa.deleted_at IS NULL
                ORDER BY aqa.created_at DESC
                LIMIT 1
                `,
				{
					replacements: { user_id },
					type: QueryTypes.SELECT,
				},
			),
			db.sequelize.query(
				`
                SELECT DISTINCT(dqa.daily_record_question_id), dqa.answer_date
                FROM daily_record_question_answer as dqa
                INNER JOIN question_tag_mapping as qtm ON qtm.question_id = dqa.daily_record_question_id 
					AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id IN (1, 2)
				AND dqa.deleted_at IS NULL
                ORDER BY dqa.answer_date DESC
                LIMIT 1
                `,
				{
					replacements: { user_id },
					type: QueryTypes.SELECT,
				},
			),
		])

		const date2 = animalDateResult[0] as { created_at?: string }
		const date = dailyRecordResult[0] as { answer_date?: string }

		if (date?.answer_date && !date2?.created_at) {
			return date.answer_date
		} else if (!date?.answer_date && date2?.created_at) {
			return date2.created_at
		} else if (date?.answer_date && date2?.created_at) {
			const latestDate1 = new Date(date.answer_date).getTime()
			const latestDate2 = new Date(date2.created_at).getTime()
			return latestDate1 > latestDate2 ? date.answer_date : date2.created_at
		} else {
			return new Date().toISOString().split('T')[0]
		}
	}

	private static async fetchIncomeRecords(
		user_id: number,
		date: string,
	): Promise<{ answer: string }[]> {
		return (await db.sequelize.query(
			`
            SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
            FROM daily_record_questions as drq
            INNER JOIN daily_record_question_answer as dqa ON dqa.daily_record_question_id = drq.id 
			 	AND dqa.deleted_at IS NULL
            INNER JOIN question_tag_mapping as qtm ON qtm.question_id = drq.id 
				AND qtm.deleted_at IS NULL
            WHERE dqa.user_id = :user_id
            AND qtm.question_tag_id = 2
            AND DATE(dqa.answer_date) = :date
			AND drq.delete_status <>1
            ORDER BY dqa.answer_date DESC
            `,
			{
				replacements: { user_id, date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]
	}

	private static async fetchBreedingRecords(
		user_id: number,
		date: string,
	): Promise<{ answer: string }[]> {
		return (await db.sequelize.query(
			`
        	SELECT DISTINCT(aqa.question_id), cq.question, aqa.answer, aqa.created_at
        	FROM animal_question_answers as aqa
        	INNER JOIN common_questions as cq ON cq.id = aqa.question_id 
			 	AND cq.deleted_at IS NULL
        	WHERE aqa.user_id = :user_id
        	AND DATE(aqa.created_at) = :date
        	AND cq.question_tag IN (36)
			AND aqa.deleted_at IS NULL
        	ORDER BY aqa.created_at DESC
    		`,
			{
				replacements: { user_id, date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as { answer: string }[]
	}

	private static async fetchExpenseRecords(
		user_id: number,
		date: string,
	): Promise<
		{
			question: string
			answer: string
			answer_date: string
			daily_record_question_id: number
		}[]
	> {
		return (await db.sequelize.query(
			`
        	SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
        	FROM daily_record_questions as drq
        	INNER JOIN daily_record_question_answer as dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        	INNER JOIN question_tag_mapping as qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        	WHERE dqa.user_id = :user_id
        	AND qtm.question_tag_id = 1
        	AND DATE(dqa.answer_date) = :date
			AND drq.delete_status <>1
        	ORDER BY dqa.answer_date DESC
    		`,
			{
				replacements: { user_id, date },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			question: string
			answer: string
			answer_date: string
			daily_record_question_id: number
		}[]
	}

	private static calculateIncomeTotal(
		incomeRecords: { answer: string }[],
	): number {
		return incomeRecords.reduce((total, record) => {
			try {
				const answers = JSON.parse(record.answer) as {
					price: number
					amount?: number
				}[]
				return answers.reduce((subTotal, item) => {
					const amount = item.amount || 1
					return subTotal + item.price * amount
				}, total)
			} catch {
				return total
			}
		}, 0)
	}

	private static calculateBreeding(
		breedingRecords: { answer: string }[],
	): number {
		return breedingRecords.reduce((total, record) => {
			try {
				return total + Number.parseFloat(record.answer)
			} catch {
				return total
			}
		}, 0)
	}

	private static calculateExpenseTotal(
		expenseRecords: { answer: string }[],
	): number {
		return expenseRecords.reduce((total, record) => {
			try {
				const answers = JSON.parse(record.answer) as {
					price: number
					amount?: number
				}[]
				return answers.reduce((subTotal, item) => {
					const amount = item.amount || 1
					return subTotal + item.price * amount
				}, total)
			} catch {
				return total
			}
		}, 0)
	}

	private static determineProfitLossKey(
		amount: number,
	): 'profit' | 'loss' | null {
		if (amount > 0) return 'profit'
		if (amount < 0) return 'loss'
		return null
	}

	// Get milk report details
	public static async animalMilkReportDetails(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalMilkReportDetailsRow[]> {
		const [userAnimals, allAnswers] = await Promise.all([
			// Get all user animals
			db.sequelize.query(
				`
                SELECT DISTINCT(animal_number), animal_id
                FROM animal_question_answers 
                WHERE user_id = :user_id
                AND deleted_at IS NULL
            `,
				{
					replacements: { user_id },
					type: QueryTypes.SELECT,
				},
			) as unknown as Promise<{ animal_number: string; animal_id: number }[]>,

			// Fetch all relevant answers
			db.sequelize.query(
				`
                SELECT aqa.animal_number, aqa.animal_id, cq.question_tag, aqa.answer, DATE(aqa.created_at) as created_date
                FROM animal_question_answers as aqa
                INNER JOIN common_questions as cq ON cq.id = aqa.question_id
                WHERE aqa.user_id = :user_id
                AND DATE(aqa.created_at) BETWEEN :start_date AND :end_date
                AND cq.question_tag IN (17, 18, 19, 20, 53, 54, 56)
                AND cq.deleted_at IS NULL
                AND aqa.deleted_at IS NULL
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as Promise<
				{
					animal_number: string
					animal_id: number
					question_tag: number
					answer: string
					created_date: string
				}[]
			>,
		])

		// Generate date range
		const dates = this.generateDateRange(start_date, end_date)

		// Build a map for efficient lookup using reduce
		const answerMap = allAnswers.reduce((map, ans) => {
			const key = `${ans.animal_number}|${ans.animal_id}|${ans.created_date}|${ans.question_tag}`
			map.set(key, ans.answer)
			return map
		}, new Map<string, string>())

		// Use reduce to build the result array
		const resData = userAnimals.reduce((result, animal) => {
			dates.forEach((date) => {
				const milkReportDate = answerMap.get(
					`${animal.animal_number}|${animal.animal_id}|${date}|56`,
				)

				if (milkReportDate) {
					result.push({
						date: milkReportDate,
						animalNumber: animal.animal_number,
						morningFat:
							answerMap.get(
								`${animal.animal_number}|${animal.animal_id}|${date}|17`,
							) || null,
						morningSNF:
							answerMap.get(
								`${animal.animal_number}|${animal.animal_id}|${date}|18`,
							) || null,
						eveningFat:
							answerMap.get(
								`${animal.animal_number}|${animal.animal_id}|${date}|19`,
							) || null,
						eveningSNF:
							answerMap.get(
								`${animal.animal_number}|${animal.animal_id}|${date}|20`,
							) || null,
						bacterialCount:
							answerMap.get(
								`${animal.animal_number}|${animal.animal_id}|${date}|54`,
							) || null,
						somaticCellCount:
							answerMap.get(
								`${animal.animal_number}|${animal.animal_id}|${date}|53`,
							) || null,
					})
				}
			})
			return result
		}, [] as AnimalMilkReportDetailsRow[])

		return resData
	}

	// Get pregnant and non pregnant animals
	public static async getPregnantNonPregnantAnimalsCount(
		user: User,
	): Promise<
		| Record<string, { pregnant_animal: number; non_pregnant_animal: number }>
		| []
	> {
		const user_id = user.id
		const resData: Record<
			string,
			{ pregnant_animal: number; non_pregnant_animal: number }
		> = {}

		const animals = (await db.sequelize.query(
			`
        SELECT DISTINCT animal_number, animal_id
        FROM animal_question_answers 
        WHERE user_id = :user_id 
        AND status != 1
        AND deleted_at IS NULL
        `,
			{
				replacements: { user_id },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			animal_number: string
			animal_id: number
		}[]

		if (animals.length === 0) {
			return []
		}

		const allData = (await db.sequelize.query(
			`
        WITH animal_pregnancy_info AS (
            -- Get animals with pregnancy questions (question_tag = 15)
            SELECT DISTINCT 
                aqa.animal_number,
                aqa.animal_id,
                a.name as animal_name
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            JOIN animals a ON a.id = aqa.animal_id AND a.deleted_at IS NULL
            WHERE cq.question_tag = 15
            AND aqa.user_id = :user_id
            AND aqa.status != 1
            AND aqa.deleted_at IS NULL
			AND cq.deleted_at IS NULL
        ),
        latest_sex_answers AS (
            -- Get latest sex answers (question_tag = 8)
            SELECT 
                aqa.animal_number,
                aqa.answer as sex_answer,
                ROW_NUMBER() OVER (PARTITION BY aqa.animal_number ORDER BY aqa.created_at DESC) as rn
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag = 8
            AND aqa.user_id = :user_id
            AND aqa.status != 1
            AND aqa.deleted_at IS NULL
			AND cq.deleted_at IS NULL
        ),
        latest_pregnancy_answers AS (
            -- Get latest pregnancy answers (question_tag = 15)
            SELECT 
                aqa.animal_number,
                aqa.answer as pregnancy_answer,
                ROW_NUMBER() OVER (PARTITION BY aqa.animal_number ORDER BY aqa.created_at DESC) as rn
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag = 15
            AND aqa.user_id = :user_id
            AND aqa.status != 1
            AND aqa.deleted_at IS NULL
			AND cq.deleted_at IS NULL
        )
        SELECT 
            api.animal_id,
            api.animal_number,
            api.animal_name,
            lsa.sex_answer,
            lpa.pregnancy_answer
        FROM animal_pregnancy_info api
        LEFT JOIN latest_sex_answers lsa ON lsa.animal_number = api.animal_number AND lsa.rn = 1
        LEFT JOIN latest_pregnancy_answers lpa ON lpa.animal_number = api.animal_number AND lpa.rn = 1
        ORDER BY api.animal_id, api.animal_number
        `,
			{
				replacements: { user_id },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			animal_id: number
			animal_number: string
			animal_name: string
			sex_answer: string | null
			pregnancy_answer: string | null
		}[]

		const animalGroups = new Map<number, typeof allData>()

		allData.forEach((row) => {
			if (!animalGroups.has(row.animal_id)) {
				animalGroups.set(row.animal_id, [])
			}
			animalGroups.get(row.animal_id)!.push(row)
		})

		animalGroups.forEach((animalNumbers) => {
			let pregnantAnimal = 0
			let nonPregnantAnimal = 0

			animalNumbers.forEach((row) => {
				if (row.sex_answer && row.sex_answer.toLowerCase() !== 'male') {
					if (row.pregnancy_answer) {
						const answer = row.pregnancy_answer.toLowerCase()

						if (answer === 'yes') {
							pregnantAnimal = pregnantAnimal + 1
						} else {
							nonPregnantAnimal = nonPregnantAnimal + 1
						}

						resData[row.animal_name] = {
							pregnant_animal: pregnantAnimal,
							non_pregnant_animal: nonPregnantAnimal,
						}
					}
				}
			})
		})

		return Object.keys(resData).length === 0 ? [] : resData
	}

	// Get pregnant and non pregnant animals
	// public static async getPregnantAnimalsDetails(user: User): Promise<
	// 	| {
	// 			pregnant: Record<string, AnimalPregnancyInfo[]>
	// 			non_pregnant: Record<string, AnimalPregnancyInfo[]>
	// 	  }
	// 	| []
	// > {
	// 	const user_id = user.id

	// 	const results = (await db.sequelize.query(
	// 		`
	//     WITH latest_answers AS (
	//         -- Get latest answer for each animal_number + question_tag combination
	//         SELECT
	//             aqa.animal_number,
	//             aqa.animal_id,
	//             cq.question_tag,
	//             aqa.answer,
	//             a.name as animal_name,
	//             ROW_NUMBER() OVER (
	//                 PARTITION BY aqa.animal_number, cq.question_tag
	//                 ORDER BY aqa.created_at DESC
	//             ) as rn
	//         FROM animal_question_answers aqa
	//         JOIN common_questions cq ON cq.id = aqa.question_id
	//         JOIN animals a ON a.id = aqa.animal_id AND a.deleted_at IS NULL
	//         WHERE aqa.user_id = :user_id
	//         AND aqa.status != 1
	//         AND aqa.deleted_at IS NULL
	// 		AND cq.deleted_at IS NULL
	//         AND cq.question_tag IN (8, 9, 11, 15, 16, 23, 35, 42, 59)
	//     ),
	//     animal_data AS (
	//         -- Pivot the data to get all answers per animal in one row
	//         SELECT
	//             animal_number,
	//             animal_id,
	//             animal_name,
	//             MAX(CASE WHEN question_tag = 8 THEN answer END) as sex_answer,
	//             MAX(CASE WHEN question_tag = 9 THEN answer END) as dob_answer,
	//             MAX(CASE WHEN question_tag = 11 THEN answer END) as mother_answer,
	//             MAX(CASE WHEN question_tag = 15 THEN answer END) as pregnancy_answer,
	//             MAX(CASE WHEN question_tag = 16 THEN answer END) as milking_answer,
	//             MAX(CASE WHEN question_tag = 23 THEN answer END) as ai_date_answer,
	//             MAX(CASE WHEN question_tag = 35 THEN answer END) as bull_answer,
	//             MAX(CASE WHEN question_tag = 42 THEN answer END) as semen_company_answer,
	//             MAX(CASE WHEN question_tag = 59 THEN answer END) as pregnancy_cycle_answer
	//         FROM latest_answers
	//         WHERE rn = 1
	//         GROUP BY animal_number, animal_id, animal_name
	//     ),
	//     mother_child_dob AS (
	//         -- Find DOB for children where current animal is mother
	//         SELECT DISTINCT
	//             mother.animal_number as mother_animal_number,
	//             child.dob_answer as child_dob
	//         FROM animal_data mother
	//         JOIN animal_data child ON child.mother_answer = mother.animal_number
	//         WHERE child.dob_answer IS NOT NULL
	//     ),
	//     processed_animals AS (
	//         SELECT
	//             ad.animal_name,
	//             ad.animal_number,
	//             ad.pregnancy_answer,
	//             ad.ai_date_answer,
	//             COALESCE(ad.bull_answer, 'NA') as bull_no,
	//             COALESCE(ad.semen_company_answer, 'NA') as semen_company_name,
	//             COALESCE(ad.pregnancy_cycle_answer, 'NA') as pregnancy_cycle,
	//             CASE
	//                 WHEN ad.milking_answer IS NULL THEN 'NA'
	//                 WHEN LOWER(ad.milking_answer) = 'yes' THEN 'Lactating'
	//                 ELSE 'Non-Lactating'
	//             END as status_milking_dry,
	//             COALESCE(mcd.child_dob, 'NA') as animal_dob,
	//             -- Date calculations using SQL functions
	//             CASE
	//                 WHEN ad.ai_date_answer IS NOT NULL THEN
	//                     DATE_FORMAT(DATE_ADD(STR_TO_DATE(ad.ai_date_answer, '%Y-%m-%d'), INTERVAL 3 MONTH), '%Y-%m-%d')
	//                 ELSE 'NA'
	//             END as pregnancy_detection_date,
	//             CASE
	//                 WHEN ad.ai_date_answer IS NOT NULL AND LOWER(ad.pregnancy_answer) = 'yes' THEN
	//                     MONTHNAME(DATE_ADD(STR_TO_DATE(ad.ai_date_answer, '%Y-%m-%d'),
	//                         INTERVAL (CASE WHEN LOWER(ad.animal_name) = 'buffalo' THEN 10 ELSE 9 END) MONTH))
	//                 ELSE 'NA'
	//             END as expected_delivery_month
	//         FROM animal_data ad
	//         LEFT JOIN mother_child_dob mcd ON mcd.mother_animal_number = ad.animal_number
	//         WHERE LOWER(COALESCE(ad.sex_answer, '')) = 'female'
	//         AND ad.pregnancy_answer IS NOT NULL
	//     ),
	//     pregnant_animals AS (
	//         -- Format pregnant animals data
	//         SELECT
	//             animal_name,
	//             JSON_OBJECT(
	//                 'animal_num', animal_number,
	//                 'date_of_pregnancy_detection', pregnancy_detection_date,
	//                 'bull_no', bull_no,
	//                 'expected_month_of_delevry', expected_delivery_month,
	//                 'status_milking_dry', status_milking_dry,
	//                 'date_of_AI', COALESCE(ai_date_answer, 'NA'),
	//                 'Semen_company_name', semen_company_name,
	//                 'pregnancy_cycle', pregnancy_cycle
	//             ) as animal_data
	//         FROM processed_animals
	//         WHERE LOWER(pregnancy_answer) = 'yes'
	//     ),
	//     non_pregnant_animals AS (
	//         -- Format non-pregnant animals data
	//         SELECT
	//             animal_name,
	//             JSON_OBJECT(
	//                 'animal_num', animal_number,
	//                 'date_of_last_AI', COALESCE(ai_date_answer, 'NA'),
	//                 'bull_no', bull_no,
	//                 'date_of_pregnancy_detection', pregnancy_detection_date,
	//                 'date_of_last_delivery', animal_dob,
	//                 'Semen_company_name', semen_company_name,
	//                 'status_milking_dry', status_milking_dry,
	//                 'pregnancy_cycle', pregnancy_cycle
	//             ) as animal_data
	//         FROM processed_animals
	//         WHERE LOWER(pregnancy_answer) != 'yes'
	//     )
	//     -- Final result combining both pregnant and non-pregnant
	//     SELECT
	//         'pregnant' as category,
	//         animal_name,
	//         JSON_ARRAYAGG(animal_data) as animals_data
	//     FROM pregnant_animals
	//     GROUP BY animal_name

	//     UNION ALL

	//     SELECT
	//         'non_pregnant' as category,
	//         animal_name,
	//         JSON_ARRAYAGG(animal_data) as animals_data
	//     FROM non_pregnant_animals
	//     GROUP BY animal_name
	//     `,
	// 		{
	// 			replacements: { user_id },
	// 			type: QueryTypes.SELECT,
	// 		},
	// 	)) as unknown as {
	// 		category: 'pregnant' | 'non_pregnant'
	// 		animal_name: string
	// 		animals_data: string
	// 	}[]

	// 	if (results.length === 0) {
	// 		return []
	// 	}

	// 	const pregnant: Record<string, AnimalPregnancyInfo[]> = {}
	// 	const non_pregnant: Record<string, AnimalPregnancyInfo[]> = {}

	// 	results.forEach((row) => {
	// 		const animalsData = JSON.parse(row.animals_data) as AnimalPregnancyInfo[]

	// 		if (row.category === 'pregnant') {
	// 			pregnant[row.animal_name] = animalsData
	// 		} else {
	// 			non_pregnant[row.animal_name] = animalsData
	// 		}
	// 	})

	// 	return { pregnant, non_pregnant }
	// }

	public static async getPregnantAnimalsDetails(user: User): Promise<
		| {
				pregnant: Record<string, AnimalPregnancyInfo[]>
				non_pregnant: Record<string, AnimalPregnancyInfo[]>
		  }
		| []
	> {
		const user_id = user.id

		const results = (await db.sequelize.query(
			`
        WITH latest_answers AS (
            -- Get latest answer for each animal_number + question_tag combination
            SELECT 
                aqa.animal_number,
                aqa.animal_id,
                cq.question_tag,
                aqa.answer,
                a.name as animal_name,
                ROW_NUMBER() OVER (
                    PARTITION BY aqa.animal_number, cq.question_tag 
                    ORDER BY aqa.created_at DESC
                ) as rn
            FROM animal_question_answers aqa
            JOIN common_questions cq ON cq.id = aqa.question_id
            JOIN animals a ON a.id = aqa.animal_id AND a.deleted_at IS NULL
            WHERE aqa.user_id = :user_id
            AND aqa.status != 1
            AND aqa.deleted_at IS NULL
			AND cq.deleted_at IS NULL
            AND cq.question_tag IN (8, 9, 11, 15, 16, 23, 35, 42, 59)
        ),
        animal_data AS (
            -- Pivot the data to get all answers per animal in one row
            SELECT 
                animal_number,
                animal_id,
                animal_name,
                MAX(CASE WHEN question_tag = 8 THEN answer END) as sex_answer,
                MAX(CASE WHEN question_tag = 9 THEN answer END) as dob_answer,
                MAX(CASE WHEN question_tag = 11 THEN answer END) as mother_answer,
                MAX(CASE WHEN question_tag = 15 THEN answer END) as pregnancy_answer,
                MAX(CASE WHEN question_tag = 16 THEN answer END) as milking_answer,
                MAX(CASE WHEN question_tag = 23 THEN answer END) as ai_date_answer,
                MAX(CASE WHEN question_tag = 35 THEN answer END) as bull_answer,
                MAX(CASE WHEN question_tag = 42 THEN answer END) as semen_company_answer,
                MAX(CASE WHEN question_tag = 59 THEN answer END) as pregnancy_cycle_answer
            FROM latest_answers
            WHERE rn = 1
            GROUP BY animal_number, animal_id, animal_name
        ),
        mother_child_dob AS (
            -- Find DOB for children where current animal is mother
            SELECT DISTINCT
                mother.animal_number as mother_animal_number,
                child.dob_answer as child_dob
            FROM animal_data mother
            JOIN animal_data child ON child.mother_answer = mother.animal_number
            WHERE child.dob_answer IS NOT NULL
        ),
        processed_animals AS (
            SELECT 
                ad.animal_name,
                ad.animal_number,
                ad.pregnancy_answer,
                ad.ai_date_answer,
                COALESCE(ad.bull_answer, 'NA') as bull_no,
                COALESCE(ad.semen_company_answer, 'NA') as semen_company_name,
                COALESCE(ad.pregnancy_cycle_answer, 'NA') as pregnancy_cycle,
                CASE 
                    WHEN ad.milking_answer IS NULL THEN 'NA'
                    WHEN LOWER(ad.milking_answer) = 'yes' THEN 'Lactating'
                    ELSE 'Non-Lactating'
                END as status_milking_dry,
                COALESCE(mcd.child_dob, 'NA') as animal_dob,
                -- Date calculations using SQL functions
                CASE 
                    WHEN ad.ai_date_answer IS NOT NULL THEN
                        DATE_FORMAT(DATE_ADD(STR_TO_DATE(ad.ai_date_answer, '%Y-%m-%d'), INTERVAL 3 MONTH), '%Y-%m-%d')
                    ELSE 'NA'
                END as pregnancy_detection_date,
                CASE 
                    WHEN ad.ai_date_answer IS NOT NULL AND LOWER(ad.pregnancy_answer) = 'yes' THEN
                        MONTHNAME(DATE_ADD(STR_TO_DATE(ad.ai_date_answer, '%Y-%m-%d'), 
                            INTERVAL (CASE WHEN LOWER(ad.animal_name) = 'buffalo' THEN 10 ELSE 9 END) MONTH))
                    ELSE 'NA'
                END as expected_delivery_month
            FROM animal_data ad
            LEFT JOIN mother_child_dob mcd ON mcd.mother_animal_number = ad.animal_number
            WHERE LOWER(COALESCE(ad.sex_answer, '')) = 'female'
            AND ad.pregnancy_answer IS NOT NULL
        )
        -- Final result: return raw data instead of JSON aggregation
        SELECT 
            'pregnant' as category,
            animal_name,
            animal_number,
            pregnancy_detection_date,
            bull_no,
            expected_delivery_month,
            status_milking_dry,
            ai_date_answer as date_of_AI,
            semen_company_name,
            pregnancy_cycle,
            NULL as date_of_last_delivery -- Only for non-pregnant
        FROM processed_animals
        WHERE LOWER(pregnancy_answer) = 'yes'
        
        UNION ALL
        
        SELECT 
            'non_pregnant' as category,
            animal_name,
            animal_number,
            pregnancy_detection_date,
            bull_no,
            NULL as expected_delivery_month, -- Only for pregnant
            status_milking_dry,
            ai_date_answer as date_of_AI,
            semen_company_name,
            pregnancy_cycle,
            animal_dob as date_of_last_delivery
        FROM processed_animals
        WHERE LOWER(pregnancy_answer) != 'yes'
        `,
			{
				replacements: { user_id },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			category: 'pregnant' | 'non_pregnant'
			animal_name: string
			animal_number: string
			pregnancy_detection_date: string
			bull_no: string
			expected_delivery_month?: string
			status_milking_dry: string
			date_of_AI: string
			semen_company_name: string
			pregnancy_cycle: string
			date_of_last_delivery?: string
		}[]

		if (results.length === 0) {
			return []
		}

		const pregnant: Record<string, AnimalPregnancyInfo[]> = {}
		const non_pregnant: Record<string, AnimalPregnancyInfo[]> = {}

		results.forEach((row) => {
			const animalInfo: AnimalPregnancyInfo = {
				animal_num: row.animal_number,
				date_of_pregnancy_detection: row.pregnancy_detection_date || 'NA',
				bull_no: row.bull_no,
				status_milking_dry: row.status_milking_dry,
				date_of_AI: row.date_of_AI || 'NA',
				Semen_company_name: row.semen_company_name,
				pregnancy_cycle: row.pregnancy_cycle,
			}

			if (row.category === 'pregnant') {
				animalInfo.expected_month_of_delevry =
					row.expected_delivery_month || 'NA'

				if (!pregnant[row.animal_name]) {
					pregnant[row.animal_name] = []
				}
				pregnant[row.animal_name].push(animalInfo)
			} else {
				animalInfo.date_of_last_delivery = row.date_of_last_delivery || 'NA'
				animalInfo.date_of_last_AI = row.date_of_AI || 'NA'

				if (!non_pregnant[row.animal_name]) {
					non_pregnant[row.animal_name] = []
				}
				non_pregnant[row.animal_name].push(animalInfo)
			}
		})

		return { pregnant, non_pregnant }
	}

	public static async getLactatingNonLactatingAnimalsCount(
		user: User,
	): Promise<
		| Record<string, { lactating_animal: number; non_lactating_Animal: number }>
		| []
	> {
		const resData: Record<
			string,
			{ lactating_animal: number; non_lactating_Animal: number }
		> = {}
		const optimizedQuery = `
                SELECT 
                    a.name as animal_name,
                    SUM(CASE 
                        WHEN lactation_data.answer = 'yes' AND sex_data.answer != 'male' 
                        THEN 1 
                        ELSE 0 
                    END) as lactating_animal,
                    SUM(CASE 
                        WHEN lactation_data.answer != 'yes' AND lactation_data.answer IS NOT NULL AND sex_data.answer != 'male' 
                        THEN 1 
                        ELSE 0 
                    END) as non_lactating_animal
                FROM (
                    SELECT DISTINCT aqa.animal_id, aqa.animal_number
                    FROM animal_question_answers aqa
                    WHERE aqa.user_id = ? AND aqa.status != 1 AND aqa.deleted_at IS NULL
                ) distinct_animals
                JOIN animals a ON a.id = distinct_animals.animal_id AND a.deleted_at IS NULL
                LEFT JOIN (
                    SELECT aqa.animal_id, aqa.animal_number, aqa.answer, aqa.created_at,
                           ROW_NUMBER() OVER (PARTITION BY aqa.animal_id, aqa.animal_number ORDER BY aqa.created_at DESC) as rn
                    FROM animal_question_answers aqa
                    JOIN common_questions cq ON cq.id = aqa.question_id AND cq.deleted_at IS NULL
                    WHERE aqa.user_id = ? AND cq.question_tag = 16 AND aqa.status != 1 AND aqa.deleted_at IS NULL
                ) lactation_data ON lactation_data.animal_id = distinct_animals.animal_id 
                                 AND lactation_data.animal_number = distinct_animals.animal_number 
                                 AND lactation_data.rn = 1
                LEFT JOIN (
                    SELECT aqa.animal_id, aqa.animal_number, aqa.answer, aqa.created_at,
                           ROW_NUMBER() OVER (PARTITION BY aqa.animal_id, aqa.animal_number ORDER BY aqa.created_at DESC) as rn
                    FROM animal_question_answers aqa
                    JOIN common_questions cq ON cq.id = aqa.question_id AND cq.deleted_at IS NULL
                    WHERE aqa.user_id = ? AND cq.question_tag = 8 AND aqa.status != 1 AND aqa.deleted_at IS NULL
                ) sex_data ON sex_data.animal_id = distinct_animals.animal_id 
                            AND sex_data.animal_number = distinct_animals.animal_number 
                            AND sex_data.rn = 1
                WHERE lactation_data.answer IS NOT NULL AND sex_data.answer IS NOT NULL
                GROUP BY a.id, a.name
                HAVING lactating_animal > 0 OR non_lactating_animal > 0
            `

		const result = (await db.sequelize.query(optimizedQuery, {
			replacements: [user.id, user.id, user.id],
			type: QueryTypes.SELECT,
		})) as unknown as {
			animal_name: string
			lactating_animal: string
			non_lactating_animal: string
		}[]

		if (result.length === 0) {
			return []
		}
		for (const row of result) {
			resData[row.animal_name] = {
				lactating_animal: Number.parseInt(row.lactating_animal),
				non_lactating_Animal: Number.parseInt(row.non_lactating_animal),
			}
		}
		return resData
	}
}
