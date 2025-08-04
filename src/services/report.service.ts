import { Op, Sequelize } from 'sequelize'
import db from '../config/database'
import puppeteer from 'puppeteer'
import ejs from 'ejs'
import path from 'path'
import { addToEmailQueue } from '../queues/email.queue'
import fs from 'fs/promises'

type MilkValue = string | number | null

interface AnimalNumber {
	animal_id: number
	animal_number: string
}

export interface MilkReportRow {
	record_date: Date
	animal_id: number
	animal_number: string
	morning_milk_in_litres: number
	evening_milk_in_litres: number
	total_milk_in_litres: number
}
interface HealthReportRow {
	date: string
	diseasName: string
	details_of_treatment: string
	milk_loss_in_litres: string
	animal_number: string
	font: string
}
interface HealthReportData {
	total_cost_of_treatment: number
	data: HealthReportRow[]
}
interface ManureProductionRow {
	total_manure_production_in_KG: number
	rate_per_kg: number
	total_in_rupees: number
	answer_date: string
}
export interface MilkProductionQuantityRow {
	date: string
	milk_production_quantity_morning_in_lit: number
	milk_production_quantity_morning_in_ruppe: string
	milk_production_quantity_evening_in_lit: number
	milk_production_quantity_evening_in_ruppe: string
}
export interface ProfitLossGraphRow {
	date: string
	profit: string
	loss: string
}
export interface ProfitLossRow {
	date: string
	profitWithoutSellingAndPurchasePrice: string
	lossWithoutSellingAndPurchasePrice: string
}
export interface IncomeExpenseRow {
	Date: string
	Expense: string
	Income: string
	Profit: string
	GreenFeed: string
	CattleFeed: string
	DryFeed: string
	OtherExpense: string
	Supplement: string
}
export interface IncomeExpenseResult {
	expenseData: IncomeExpenseRow[]
	totalExpenseData: {
		totalExpense: string
		totalIncome: string
		totalProfit: string
		totalGreenFeed: string
		totalCattleFeed: string
		totalDryFeed: string
		totalOtherExpense: string
		totalSupplement: string
	}
}
interface VaccinationDetailWithUserTypes {
	UserVaccinationTypes?: { VaccinationType?: { type?: string } }[]
	date?: string | Date
}
interface VaccinationListItem {
	type: string
	date: string
}
interface AnimalQuestionAnswerIncluded {
	created_at: string | Date
	answer?: string
}
interface CommonQuestionsIncluded {
	question_tag: number
	AnimalQuestionAnswers?: AnimalQuestionAnswerIncluded[]
}
export interface AnimalBreedingHistoryResult {
	animal_number: string
	aiHistory: AIHistoryItem[]
	deliveryHistory: DeliveryHistoryItem[]
	heatHistory: { heatDate: string }[]
}
// --- Update generatePdf to use union for template data ---
type ReportTemplateData =
	| { animalHealthData: HealthReportData }
	| { manureProductionData: ManureProductionRow[] }

// --- Add generic to REPORT_CONFIGS and config.fetchData ---
interface ReportConfig<T> {
	fetchData: (...args: unknown[]) => Promise<T>
	viewName: string
	emailTemplate: string
	emailSubject: string
	emailDataKey: string
}

interface MilkAggregate {
	animal_id: number
	morning_milk: number
	evening_milk: number
	total: number
	record_date?: string | Date
}

interface AIHistoryItem {
	dateOfAI?: string
	bullNumber?: string
	motherYield?: string
	semenCompanyName?: string
}
interface DeliveryHistoryItem {
	dateOfDelvery?: string
	calfNumber?: string | null
	typeOfDelivery?: string
}

export interface AllAnimalBreedingHistoryResult {
	pregnant: Record<string, AnimalBreedingHistoryResult>
	no_pregnant: Record<string, AnimalBreedingHistoryResult>
}

export interface ProfitLossRowWithBreedingExpense {
	date: string
	profitWithoutSellingAndPurchasePrice: string
	lossWithoutSellingAndPurchasePrice: string
	breedingExpense: string
}

export interface MilkProductionQuantityGraphRow {
	date: string
	milkProdMorning: string
	milkProdEvening: string
}

export interface FatPercentageGraphRow {
	date: string
	totalMorningFat: string
	totaleveningFat: string
}

export interface SnfPercentageGraphRow {
	date: string
	totalMorningSNF: string
	totaleveningSNF: string
}

export interface ProfitLossWithSellingRow {
	date: string
	profitWithSellingAndPurchasePrice: string
	lossWithSellingAndPurchasePrice: string
}

export interface MilkAggregateAverage {
	aggregate: {
		milkProdQtyMorning: string
		milkProdQtyEvening: string
		milkProdQtyTotal: string
		milkProdCostMorning: string
		milkProdCostEvening: string
		milkProdCostTotal: string
	}
	average: {
		milkProdQtyMorning: string
		milkProdQtyEvening: string
		milkProdQtyTotal: string
		milkProdCostMorning: string
		milkProdCostEvening: string
		milkProdCostTotal: string
	}
}

export interface ExpenseAggregateAverage {
	aggregate: {
		greenFeedQty: string
		dryFeedQty: string
		cattleFeedQty: string
		supplementQty: string
		greenFeedCost: string
		dryFeedCost: string
		cattleFeedCost: string
		supplementCost: string
		otherExpense: string
		totalExpense: string
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
		otherExpense: string
		totalExpense: string
	}
}

export interface IncomeExpenseOnSalePurchaseAnimal {
	income_for_sale_animals: string
	expense_for_purchase_animals: string
}

export interface MilkAverageAggregateRecord {
	aggregate: {
		morning: string
		evening: string
		total: string
	}
	average: {
		morning: string
		evening: string
		total: string
	}
	total: {
		cow_total: string
		buffalo_total: string
		total: string
	}
}

export interface AnimalHealthReportResult {
	total_cost_of_treatment: string
	total_animal: number
	[animal_number: string]:
		| number
		| string
		| {
				[date: string]: {
					question: string | null
					answer: string | null
					animal_number: string | null
					answered_at: string
				}[]
		  }
}

export interface MilkRecordEntry {
	daily_record_question_id: number
	question: string
	answer: { price: number; amount: number }[]
	answer_date: string
}

export interface AnimalMilkProductionQuantityReportResult {
	morning: Record<string, MilkRecordEntry>
	evening: Record<string, MilkRecordEntry[]>
	morningTotal: string
	eveningTotal: string
	TotalLitresInMorning: string
	TotalLitresInEvening: string
}

export interface MilkQualityRecordEntry {
	daily_record_question_id: number
	question: string
	answer: { name: number }[]
	answer_date: string
}

export interface AnimalMilkProductionQualityReportResult {
	data: Record<string, Record<string, MilkQualityRecordEntry[]>>
	totalMorningFat: string
	totalMorningSNF: string
	totaleveningFat: string
	totaleveningSNF: string
}

export interface ManureRecordEntry {
	daily_record_question_id: number
	question: string
	answer: { price: number; amount: number }[]
	answer_date: string
}

export interface ManureProductionReportResult {
	data: Record<string, ManureRecordEntry[]>
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

export interface FarmInvestmentEntry {
	id: number
	type_of_investment: string | null
	amount_in_rs: number
	date_of_installation_or_purchase: string
	age_in_year: string
}

export interface FarmInvestmentReportResult {
	reportData: FarmInvestmentEntry[]
	total_investment: string
	number_of_investments: number
}

export interface IncomeAggregateAverageResult {
	aggregate: {
		milkProdQtyMorning: string
		milkProdQtyEvening: string
		milkProdQtyTotal: string
		milkProdCostMorning: string
		milkProdCostEvening: string
		milkProdCostTotal: string
		manureProductionQuantity: string
		manureProductionAmount: string
		sellingPriceAmount: string
		OtherIncomeAmount: string
	}
	average: {
		milkProdQtyMorning: string
		milkProdQtyEvening: string
		milkProdQtyTotal: string
		milkProdCostMorning: string
		milkProdCostEvening: string
		milkProdCostTotal: string
		manureProductionQuantity: string
		manureProductionAmount: string
		sellingPriceAmount: string
		OtherIncomeAmount: string
	}
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

export class ReportService {
	public static async generatePdf(
		user_id: number,
		data: {
			report_type: string
			email: string
			start_date?: string
			end_date?: string
			animal_id?: number
			animal_number?: string
		},
	): Promise<void> {
		const user = await db.User.findByPk(user_id)
		if (!user) throw new Error('User not found')

		const config = REPORT_CONFIGS[data.report_type] as ReportConfig<unknown>
		if (!config) throw new Error('Invalid report type')

		// Use the correct type for pdfData based on report_type
		let pdfData: unknown
		switch (data.report_type) {
			case 'health_report':
				pdfData = await (
					config.fetchData as (
						user_id: number,
						start_date: string,
						end_date: string,
					) => Promise<HealthReportData>
				)(user_id, data.start_date!, data.end_date!)
				break
			case 'manure_production':
				pdfData = await (
					config.fetchData as (
						user_id: number,
						start_date: string,
						end_date: string,
					) => Promise<ManureProductionRow[]>
				)(user_id, data.start_date!, data.end_date!)
				break
			default:
				pdfData = await (
					config.fetchData as (...args: unknown[]) => Promise<unknown>
				)(user_id, data.start_date!, data.end_date!)
		}

		// Render EJS
		const templatePath = path.resolve(
			__dirname,
			`../views/reports/${config.viewName}.ejs`,
		)
		const template = await ejs.renderFile(templatePath, {
			[config.emailDataKey]: pdfData,
		})

		// Generate PDF
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.setContent(template)
		const pdfBuffer = await page.pdf({ format: 'A4' })
		await browser.close()

		// Save PDF
		const reportDir = path.resolve(__dirname, '../../storage/reports')
		await fs.mkdir(reportDir, { recursive: true })
		const tempFilename = `${config.emailSubject.replace(/ /g, '_')}-${user_id}-${Date.now()}.pdf`
		const filePath = path.join(reportDir, tempFilename)
		await fs.writeFile(filePath, pdfBuffer)

		// Queue Email
		addToEmailQueue({
			to: data.email,
			subject: config.emailSubject,
			template:
				config.emailTemplate as keyof import('../utils/emailTemplates').EmailTemplateMap,
			data: { [config.emailDataKey]: pdfData } as ReportTemplateData,
			attachments: [
				{
					filename: `${config.emailSubject}.pdf`,
					path: filePath,
				},
			],
		})
	}

	public static async healthReportPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<HealthReportData> {
		const userAnimals = await this.getUserAnimals(user_id)
		const dates = this.generateDateRange(start_date, end_date)
		const totalcostOfTreatment = await this.calculateTreatmentCost(
			user_id,
			start_date,
			end_date,
		)
		const resData = await this.processHealthData(user_id, userAnimals, dates)

		return {
			total_cost_of_treatment: totalcostOfTreatment,
			data: resData,
		}
	}

	private static async getUserAnimals(
		user_id: number,
	): Promise<AnimalNumber[]> {
		return (await db.AnimalQuestionAnswer.findAll({
			where: { user_id },
			attributes: [
				[
					Sequelize.fn('DISTINCT', Sequelize.col('animal_number')),
					'animal_number',
				],
			],
		})) as AnimalNumber[]
	}

	private static generateDateRange(
		start_date: string,
		end_date: string,
	): string[] {
		const dates: string[] = []
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)

		for (let i = date_from; i <= date_to; i.setDate(i.getDate() + 1)) {
			dates.push(new Date(i).toISOString().split('T')[0])
		}

		return dates
	}

	private static async calculateTreatmentCost(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<number> {
		const dailyRecordQuestions = await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: {
					[Op.between]: [start_date, end_date],
				},
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: {
								question_tag_id: 37,
							},
						},
					],
				},
			],
		})

		return dailyRecordQuestions.reduce((total, value) => {
			const answer = JSON.parse(value.answer) as Array<{
				price: number
			}>
			return total + answer[0].price
		}, 0)
	}

	private static async processHealthData(
		user_id: number,
		userAnimals: AnimalNumber[],
		dates: string[],
	): Promise<HealthReportRow[]> {
		const resData: HealthReportRow[] = []

		for (const animal of userAnimals) {
			for (const date of dates) {
				const healthData = await this.getHealthDataForDate(
					user_id,
					animal.animal_number,
					date,
				)
				if (healthData !== null) {
					resData.push(healthData)
				}
			}
		}

		return resData
	}

	private static async getHealthDataForDate(
		user_id: number,
		animal_number: string,
		date: string,
	): Promise<HealthReportRow | null> {
		const [answer1, answer2, answer3, answer4] = await Promise.all([
			this.getAnswerForQuestionTag(user_id, animal_number, date, 38),
			this.getAnswerForQuestionTag(user_id, animal_number, date, 39),
			this.getAnswerForQuestionTag(user_id, animal_number, date, 40),
			this.getAnswerForQuestionTag(user_id, animal_number, date, 41),
		])

		if (!answer1) {
			return null
		}

		return {
			date: answer1,
			diseasName: answer2 ?? '',
			details_of_treatment: answer3 ?? '',
			milk_loss_in_litres: answer4 ?? '',
			animal_number,
			font: 'Noto Sans',
		}
	}

	private static async getAnswerForQuestionTag(
		user_id: number,
		animal_number: string,
		date: string,
		question_tag: number,
	): Promise<string | null> {
		const questions = await db.CommonQuestions.findAll({
			include: [
				{
					model: db.AnimalQuestionAnswer,
					as: 'AnimalQuestionAnswers',
					where: {
						animal_number,
						user_id,
						created_at: {
							[Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
						},
						status: {
							[Op.ne]: 1,
						},
					},
				},
			],
			where: { question_tag },
		})

		for (const value of questions) {
			const aqa = (
				value as unknown as { AnimalQuestionAnswers: { answer: string }[] }
			).AnimalQuestionAnswers
			if (aqa?.[0]) {
				const answer = aqa[0].answer
				return question_tag === 38
					? new Date(answer).toLocaleDateString('en-GB', {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						})
					: answer
			}
		}

		return null
	}

	public static async manureProductionReportPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ManureProductionRow[]> {
		const data = await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: {
					[Op.between]: [start_date, end_date],
				},
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: {
								question_tag_id: 29,
							},
						},
					],
				},
			],
			order: [['answer_date', 'DESC']],
		})

		const resData: Record<string, ManureProductionRow[]> = {}
		let totalManureProductionPrice = 0
		let totalManureProduction = 0
		let price = 0

		for (const item of data) {
			const answer = JSON.parse(item.answer) as Array<{
				amount: number
				price: number
			}>
			for (const value1 of answer) {
				totalManureProduction = value1.amount
				totalManureProductionPrice = value1.price
				price = value1.price * value1.amount

				const dateKey = item.answer_date.toString()
				if (!resData[dateKey]) {
					resData[dateKey] = []
				}

				resData[dateKey].push({
					total_manure_production_in_KG: totalManureProduction,
					rate_per_kg: totalManureProductionPrice,
					total_in_rupees: price,
					answer_date: item.answer_date.toISOString(),
				})
			}
		}

		const abc: ManureProductionRow[] = []
		Object.keys(resData).forEach((key) => {
			resData[key].forEach((value2) => {
				const newDate = new Date(value2.answer_date).toLocaleDateString(
					'en-GB',
					{
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					},
				)
				abc.push({
					total_manure_production_in_KG: value2.total_manure_production_in_KG,
					rate_per_kg: value2.rate_per_kg,
					total_in_rupees: value2.total_in_rupees,
					answer_date: newDate,
				})
			})
		})

		return abc
	}

	public static async animalMilkProductionQuantityPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkProductionQuantityRow[]> {
		const resData: MilkProductionQuantityRow[] = []
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		for (const date of dates) {
			const newDate = new Date(date).toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			})
			let morningTotal = 0
			let morningTotalAmt = 0
			let eveningTotal = 0
			let eveningTotalAmt = 0
			// Morning milk
			const morningMilk = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 26 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value of morningMilk as { answer: string }[]) {
				const answer = JSON.parse(value.answer) as Array<{
					price: number
					amount: number
				}>
				const total = answer[0].price * answer[0].amount
				morningTotal += total
				morningTotalAmt += answer[0].amount
			}
			// Evening milk
			const eveningMilk = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 27 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value1 of eveningMilk as { answer: string }[]) {
				const answer = JSON.parse(value1.answer) as Array<{
					price: number
					amount: number
				}>
				const total = answer[0].price * answer[0].amount
				eveningTotal += total
				eveningTotalAmt += answer[0].amount
			}
			const abc: MilkProductionQuantityRow = {
				date: newDate,
				milk_production_quantity_morning_in_lit: morningTotalAmt,
				milk_production_quantity_morning_in_ruppe: morningTotal.toFixed(2),
				milk_production_quantity_evening_in_lit: eveningTotalAmt,
				milk_production_quantity_evening_in_ruppe: eveningTotal.toFixed(2),
			}
			if (
				abc.milk_production_quantity_morning_in_ruppe !== '0.00' ||
				abc.milk_production_quantity_evening_in_ruppe !== '0.00'
			) {
				resData.push(abc)
			}
		}
		return resData
	}

	public static async profitLossGraphWithSellingAndPurcahsePricePDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossGraphRow[]> {
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		const resData: ProfitLossGraphRow[] = []
		for (const date of dates) {
			const newDate = new Date(date).toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			})
			let profit = 0
			let loss = 0
			let totalWithSellingAndPurchasePrice = 0
			let totalIncomeWithSellingPrice = 0
			let totalExpenseWithPurchasePrice = 0
			// Income (question_tag_id 2,28)
			const income = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: { [Op.in]: [2, 28] } },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value1 of income as { answer: string }[]) {
				const answer = JSON.parse(value1.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuew of answer) {
					const amount = valuew.amount || 1
					const price = valuew.price * amount
					totalIncomeWithSellingPrice += price
				}
			}
			// Expense (question_tag_id 1,22)
			const expense = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: { [Op.in]: [1, 22] } },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value3 of expense as { answer: string }[]) {
				const answer = JSON.parse(value3.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuea of answer) {
					const amount = valuea.amount || 1
					const price = valuea.price * amount
					totalExpenseWithPurchasePrice += price
				}
			}
			totalWithSellingAndPurchasePrice =
				totalIncomeWithSellingPrice - totalExpenseWithPurchasePrice
			if (totalWithSellingAndPurchasePrice > 0) {
				profit = totalWithSellingAndPurchasePrice
			} else {
				loss = Math.abs(totalWithSellingAndPurchasePrice)
			}
			const abc: ProfitLossGraphRow = {
				date: newDate,
				profit: profit.toFixed(2),
				loss: loss.toFixed(2),
			}
			if (abc.profit !== '0.00' || abc.loss !== '0.00') {
				resData.push(abc)
			}
		}
		return resData
	}

	public static async profitLossPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossRow[]> {
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		const resData: ProfitLossRow[] = []
		for (const date of dates) {
			const newDate = new Date(date).toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			})
			let profit = 0
			let loss = 0
			let totalWithoutSellingAndPurchasePrice = 0
			let totalIncomeWithoutSellingPrice = 0
			let totalExpenseWithoutPurchasePrice = 0
			// Income (question_tag_id 2)
			const income = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 2 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value1 of income as { answer: string }[]) {
				const answer = JSON.parse(value1.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuew of answer) {
					const amount = valuew.amount || 1
					const price = valuew.price * amount
					totalIncomeWithoutSellingPrice += price
				}
			}
			// Expense (question_tag_id 1)
			const expense = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 1 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value3 of expense as { answer: string }[]) {
				const answer = JSON.parse(value3.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuea of answer) {
					const amount = valuea.amount || 1
					const price = valuea.price * amount
					totalExpenseWithoutPurchasePrice += price
				}
			}
			totalWithoutSellingAndPurchasePrice =
				totalIncomeWithoutSellingPrice - totalExpenseWithoutPurchasePrice
			if (totalWithoutSellingAndPurchasePrice > 0) {
				profit = totalWithoutSellingAndPurchasePrice
			} else {
				loss = Math.abs(totalWithoutSellingAndPurchasePrice)
			}
			const abc: ProfitLossRow = {
				date: newDate,
				profitWithoutSellingAndPurchasePrice: profit.toFixed(2),
				lossWithoutSellingAndPurchasePrice: loss.toFixed(2),
			}
			if (
				abc.profitWithoutSellingAndPurchasePrice !== '0.00' ||
				abc.lossWithoutSellingAndPurchasePrice !== '0.00'
			) {
				resData.push(abc)
			}
		}
		return resData
	}

	public static async incomeExpensePDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseResult> {
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		let t_expense = 0
		let t_income = 0
		let t_profit = 0
		let t_greenFeed = 0
		let t_cattleFeed = 0
		let t_dryFeed = 0
		let t_otherExpense = 0
		let t_supplement = 0
		const data: IncomeExpenseRow[] = []
		for (const date of dates) {
			const newDate = new Date(date).toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			})
			let totalExpense = 0
			let totalIncome = 0
			let profit = 0
			let totalGreenFeed = 0
			let totalCattleFeed = 0
			let totalDryFeed = 0
			let otherExpense = 0
			let totalSupplement = 0
			// Expense (question_tag_id 1)
			const expense = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 1 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value3 of expense as { answer: string }[]) {
				const answer = JSON.parse(value3.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuea of answer) {
					const amount = valuea.amount || 1
					const price = valuea.price * amount
					totalExpense += price
				}
			}
			// Income (question_tag_id 2)
			const income = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 2 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value1 of income as { answer: string }[]) {
				const answer = JSON.parse(value1.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuew of answer) {
					const amount = valuew.amount || 1
					const price = valuew.price * amount
					totalIncome += price
				}
			}
			profit = totalIncome - totalExpense
			// Green Feed (question_tag_id 30)
			const greenFeed = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 30 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const value of greenFeed as { answer: string }[]) {
				const answer = JSON.parse(value.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valueg of answer) {
					const amount = valueg.amount || 1
					const price = valueg.price * amount
					totalGreenFeed += price
				}
			}
			// Cattle Feed (question_tag_id 31)
			const cattleFeed = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 31 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const valuec of cattleFeed as { answer: string }[]) {
				const answer = JSON.parse(valuec.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuecf of answer) {
					const amount = valuecf.amount || 1
					const price = valuecf.price * amount
					totalCattleFeed += price
				}
			}
			// Dry Feed (question_tag_id 32)
			const dryFeed = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 32 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const valued of dryFeed as { answer: string }[]) {
				const answer = JSON.parse(valued.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuecdf of answer) {
					const amount = valuecdf.amount || 1
					const price = valuecdf.price * amount
					totalDryFeed += price
				}
			}
			// Supplements (question_tag_id 33)
			const supplements = await db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: date,
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 33 },
							},
						],
					},
				],
				order: [['answer_date', 'DESC']],
			})
			for (const values of supplements as { answer: string }[]) {
				const answer = JSON.parse(values.answer) as Array<{
					price: number
					amount: number
				}>
				for (const valuesup of answer) {
					const amount = valuesup.amount || 1
					const price = valuesup.price * amount
					totalSupplement += price
				}
			}
			otherExpense =
				totalExpense -
				(totalGreenFeed + totalCattleFeed + totalDryFeed + totalSupplement)
			t_expense += totalExpense
			t_income += totalIncome
			t_profit += profit
			t_greenFeed += totalGreenFeed
			t_cattleFeed += totalCattleFeed
			t_dryFeed += totalDryFeed
			t_otherExpense += otherExpense
			t_supplement += totalSupplement
			const abc: IncomeExpenseRow = {
				Date: newDate,
				Expense: totalExpense.toFixed(2),
				Income: totalIncome.toFixed(2),
				Profit: profit.toFixed(2),
				GreenFeed: totalGreenFeed.toFixed(2),
				CattleFeed: totalCattleFeed.toFixed(2),
				DryFeed: totalDryFeed.toFixed(2),
				OtherExpense: otherExpense.toFixed(2),
				Supplement: totalSupplement.toFixed(2),
			}
			if (
				abc.Expense !== '0.00' ||
				abc.Income !== '0.00' ||
				abc.GreenFeed !== '0.00' ||
				abc.DryFeed !== '0.00' ||
				abc.Supplement !== '0.00' ||
				abc.CattleFeed !== '0.00'
			) {
				data.push(abc)
			}
		}
		return {
			expenseData: data,
			totalExpenseData: {
				totalExpense: t_expense.toFixed(2),
				totalIncome: t_income.toFixed(2),
				totalProfit: t_profit.toFixed(2),
				totalGreenFeed: t_greenFeed.toFixed(2),
				totalCattleFeed: t_cattleFeed.toFixed(2),
				totalDryFeed: t_dryFeed.toFixed(2),
				totalOtherExpense: t_otherExpense.toFixed(2),
				totalSupplement: t_supplement.toFixed(2),
			},
		}
	}

	public static async milkReportPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
		animal_number?: string,
	): Promise<{
		animal_number: string | null
		cow_daily_milk: MilkReportRow[]
		buffalo_daily_milk: MilkReportRow[]
		relevent_total: Record<string, unknown>
		daywise_sub_total: Record<string, unknown>
	}> {
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		let cows: MilkReportRow[] = []
		let buffalos: MilkReportRow[] = []
		let relevent_cow: Record<string, unknown> = {}
		let relevent_buffalo: Record<string, unknown> = {}
		let releventTotal = 0
		const cow_daywise: Record<string, unknown> = {}
		const buffalo_daywise: Record<string, unknown> = {}
		let daywise_sub_total: MilkAggregate[] = []
		let cows_data = []
		let buffalos_data = []
		let relevent_total: MilkAggregate[] = []
		if (dates.length > 0 && dates[0] !== '1970-01-01' && animal_number) {
			cows_data = await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_id: 1,
					animal_number,
					record_date: { [Op.in]: dates },
				},
				order: [['created_at', 'DESC']],
			})
			buffalos_data = await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_id: 2,
					animal_number,
					record_date: { [Op.in]: dates },
				},
				order: [['created_at', 'DESC']],
			})
			relevent_total = (await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_number,
					record_date: { [Op.in]: dates },
				},
				attributes: [
					[
						db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
						'morning_milk',
					],
					[
						db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
						'evening_milk',
					],
					[
						db.Sequelize.literal(
							'sum(morning_milk_in_litres) + sum(evening_milk_in_litres)',
						),
						'total',
					],
					'animal_id',
				],
				group: ['animal_id'],
			})) as unknown as MilkAggregate[]
			daywise_sub_total = (await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_number,
					record_date: { [Op.in]: dates },
				},
				attributes: [
					[
						db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
						'morning_milk',
					],
					[
						db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
						'evening_milk',
					],
					[
						db.Sequelize.literal(
							'sum(morning_milk_in_litres) + sum(evening_milk_in_litres)',
						),
						'total',
					],
					'record_date',
					'animal_id',
				],
				group: ['record_date', 'animal_id'],
			})) as unknown as MilkAggregate[]
		} else if (dates.length > 0 && dates[0] !== '1970-01-01') {
			cows_data = await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_id: 1,
					record_date: { [Op.in]: dates },
				},
				order: [['created_at', 'DESC']],
			})
			buffalos_data = await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_id: 2,
					record_date: { [Op.in]: dates },
				},
				order: [['created_at', 'DESC']],
			})
			relevent_total = (await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					record_date: { [Op.in]: dates },
				},
				attributes: [
					[
						db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
						'morning_milk',
					],
					[
						db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
						'evening_milk',
					],
					[
						db.Sequelize.literal(
							'sum(morning_milk_in_litres) + sum(evening_milk_in_litres)',
						),
						'total',
					],
					'animal_id',
				],
				group: ['animal_id'],
			})) as unknown as MilkAggregate[]
			daywise_sub_total = (await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					record_date: { [Op.in]: dates },
				},
				attributes: [
					[
						db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
						'morning_milk',
					],
					[
						db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
						'evening_milk',
					],
					[
						db.Sequelize.literal(
							'sum(morning_milk_in_litres) + sum(evening_milk_in_litres)',
						),
						'total',
					],
					'record_date',
					'animal_id',
				],
				group: ['record_date', 'animal_id'],
			})) as unknown as MilkAggregate[]
		} else {
			cows_data = await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_id: 1,
				},
				order: [['created_at', 'DESC']],
			})
			buffalos_data = await db.DailyMilkRecord.findAll({
				where: {
					user_id,
					animal_id: 2,
				},
				order: [['created_at', 'DESC']],
			})
			relevent_total = (await db.DailyMilkRecord.findAll({
				where: {
					user_id,
				},
				attributes: [
					[
						db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
						'morning_milk',
					],
					[
						db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
						'evening_milk',
					],
					[
						db.Sequelize.literal(
							'sum(morning_milk_in_litres) + sum(evening_milk_in_litres)',
						),
						'total',
					],
					'animal_id',
				],
				group: ['animal_id'],
			})) as unknown as MilkAggregate[]
			daywise_sub_total = (await db.DailyMilkRecord.findAll({
				where: {
					user_id,
				},
				attributes: [
					[
						db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
						'morning_milk',
					],
					[
						db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
						'evening_milk',
					],
					[
						db.Sequelize.literal(
							'sum(morning_milk_in_litres) + sum(evening_milk_in_litres)',
						),
						'total',
					],
					'record_date',
					'animal_id',
				],
				group: ['record_date', 'animal_id'],
			})) as unknown as MilkAggregate[]
		}
		cows = cows_data.map((cow) => ({
			record_date: cow.record_date,
			animal_id: cow.animal_id,
			animal_number: cow.animal_number,
			morning_milk_in_litres: cow.morning_milk_in_litres,
			evening_milk_in_litres: cow.evening_milk_in_litres,
			total_milk_in_litres:
				Number(cow.morning_milk_in_litres) + Number(cow.evening_milk_in_litres),
		}))
		buffalos = buffalos_data.map((buffalo) => ({
			record_date: buffalo.record_date,
			animal_id: buffalo.animal_id,
			animal_number: buffalo.animal_number,
			morning_milk_in_litres: buffalo.morning_milk_in_litres,
			evening_milk_in_litres: buffalo.evening_milk_in_litres,
			total_milk_in_litres:
				Number(buffalo.morning_milk_in_litres) +
				Number(buffalo.evening_milk_in_litres),
		}))
		for (const value of relevent_total) {
			if (value.animal_id == 1) {
				releventTotal += Number(value.total ?? 0)
				relevent_cow = {
					total_cow_morning_milk: Number(value.morning_milk ?? 0),
					total_cow_evening_milk: Number(value.evening_milk ?? 0),
				}
			} else if (value.animal_id == 2) {
				releventTotal += Number(value.total ?? 0)
				relevent_buffalo = {
					total_buffalo_morning_milk: Number(value.morning_milk ?? 0),
					total_buffalo_evening_milk: Number(value.evening_milk ?? 0),
				}
			}
		}
		for (const value of daywise_sub_total) {
			if (value.animal_id == 1) {
				cow_daywise[String(value.record_date)] = {
					cow_morning_milk: Number(value.morning_milk ?? 0),
					cow_evening_milk: Number(value.evening_milk ?? 0),
					cow_total: Number(value.total ?? 0),
				}
			} else if (value.animal_id == 2) {
				buffalo_daywise[String(value.record_date)] = {
					buffalo_morning_milk: Number(value.morning_milk ?? 0),
					buffalo_evening_milk: Number(value.evening_milk ?? 0),
					buffalo_total: Number(value.total ?? 0),
				}
			}
		}
		return {
			animal_number: animal_number || null,
			cow_daily_milk: cows,
			buffalo_daily_milk: buffalos,
			relevent_total: {
				...relevent_cow,
				...relevent_buffalo,
				total_milk: releventTotal,
				record_period: `${new Date(start_date).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })} - ${new Date(end_date).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })}`,
			},
			daywise_sub_total: { ...cow_daywise, ...buffalo_daywise },
		}
	}

	public static async getProfileData(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{
		profile_img: { image: string }
		general: Record<string, unknown>
		breeding_details: Record<string, unknown>
		milk_details: Record<string, unknown>
		vaccination_details: { type: string; date: string }[]
		pedigree: Record<string, unknown>
	}> {
		// General info
		const animalType = await db.AnimalQuestionAnswer.findOne({
			where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
			include: [{ model: db.Animal, as: 'Animal' }],
		})
		// Helper to get last answer by tag
		async function getLastQuestionAnswerByQuestionTag(
			animal_id: number,
			animal_number: string,
			tag: number,
		): Promise<{ answer?: string } | null> {
			return await db.AnimalQuestionAnswer.findOne({
				where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: tag },
					},
				],
				order: [['created_at', 'DESC']],
			})
		}
		// General
		const dateOfBirth = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			9,
		)
		const weight = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			12,
		)
		let breed = ''
		if (animal_id == 1) {
			const breeding = await getLastQuestionAnswerByQuestionTag(
				animal_id,
				animal_number,
				62,
			)
			breed = breeding ? (breeding.answer ?? '') : ''
		} else if (animal_id == 2) {
			const breeding = await getLastQuestionAnswerByQuestionTag(
				animal_id,
				animal_number,
				63,
			)
			breed = breeding ? (breeding.answer ?? '') : ''
		}
		const pregnancyCycle = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			59,
		)
		// Age
		let age = 0
		if (dateOfBirth?.answer) {
			const bday = new Date(dateOfBirth.answer)
			const today = new Date()
			age = today.getFullYear() - bday.getFullYear()
		}
		// Pregnancy status
		const pregnantStatus = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			15,
		)
		// Lactating status
		const milkingStatus = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			16,
		)
		// Last delivery
		const lastDeliveryDate = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			66,
		)
		// Bull no for AI
		const BullNoForAI = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			35,
		)
		// Fat/SNF
		const morning_fat = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			17,
		)
		const evening_fat = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			19,
		)
		const m_fat = morning_fat ? (morning_fat.answer ?? '') : ''
		const e_fat = evening_fat ? (evening_fat.answer ?? '') : ''
		const last_known_fat =
			(parseFloat(m_fat ?? '') || 0) + (parseFloat(e_fat ?? '') || 0)
		const morning_snf = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			18,
		)
		const evening_snf = await getLastQuestionAnswerByQuestionTag(
			animal_id,
			animal_number,
			20,
		)
		const m_snf = morning_snf?.answer ?? ''
		const e_snf = evening_snf?.answer ?? ''
		const last_known_snf =
			(parseFloat(m_snf ?? '') || 0) + (parseFloat(e_snf ?? '') || 0)
		// Animal image
		const animalImage = await db.AnimalImage.findOne({
			where: { user_id, animal_id, animal_number },
		})
		// Vaccinations
		const vaccinations = await db.VaccinationDetail.findAll({
			where: { user_id },
			include: [
				{
					model: db.AnimalVaccination,
					as: 'AnimalVaccinations',
					where: { animal_number },
					required: false,
				},
				{
					model: db.UserVaccinationType,
					as: 'UserVaccinationTypes',
					required: false,
					include: [{ model: db.VaccinationType, as: 'VaccinationType' }],
				},
			],
		})

		const vaccination_list: VaccinationListItem[] = vaccinations.map(
			(v: VaccinationDetailWithUserTypes) => ({
				type: v.UserVaccinationTypes?.[0]?.VaccinationType?.type ?? '',
				date: String(v.date ?? ''),
			}),
		)
		// Mother info
		const motherNo = await db.AnimalMotherCalf.findOne({
			where: { user_id, animal_id, calf_animal_number: animal_number },
		})
		let mother_milk_yield = 0
		const motherBullNoUsedForAI = ''
		const semen_co_name = ''
		const sire_dam_yield = ''
		if (motherNo) {
			mother_milk_yield =
				(await db.DailyMilkRecord.sum('morning_milk_in_litres', {
					where: {
						user_id,
						animal_id,
						animal_number: motherNo.mother_animal_number || '',
					},
				})) +
				(await db.DailyMilkRecord.sum('evening_milk_in_litres', {
					where: {
						user_id,
						animal_id,
						animal_number: motherNo.mother_animal_number || '',
					},
				}))
			// BullNoForAI, semenCoName, bullMotherYield can be fetched similarly if needed
		}
		// General
		const general = {
			animal_type: animalType
				? (animalType.get('Animal') as { name?: string })?.name || ''
				: '',
			birth: dateOfBirth ? dateOfBirth.answer : '',
			weight: weight ? weight.answer : '',
			age,
			breed,
			lactation_number: pregnancyCycle ? pregnancyCycle.answer : '',
			animal_number,
		}
		// Breeding details
		const breeding_details = {
			pregnant_status: pregnantStatus ? pregnantStatus.answer : '',
			lactating_status: milkingStatus ? milkingStatus.answer : '',
			last_delivery_date: lastDeliveryDate ? lastDeliveryDate.answer : '',
			days_in_milk: 0, // Not calculated here
			last_breeding_bull_no: BullNoForAI ? BullNoForAI.answer : '',
		}
		// Milk details
		const milk_details = {
			average_daily_milk: '', // Not calculated here
			current_lactation_milk_yield: '', // Not calculated here
			last_lactation_milk_yield: '', // Not calculated here
			last_known_snf: (last_known_snf / 2).toFixed(2),
			last_known_fat: (last_known_fat / 2).toFixed(2),
		}
		// Pedigree
		const pedigree = {
			mother: {
				tag_no: motherNo ? motherNo.mother_animal_number : '',
				milk_yield: mother_milk_yield ? mother_milk_yield.toFixed(1) : '',
			},
			father: {
				tag_no: motherBullNoUsedForAI,
				semen_co_name: semen_co_name,
				sire_dam_yield: sire_dam_yield ? Number(sire_dam_yield).toFixed(1) : '',
				daughter_yield: '',
			},
		}
		return {
			profile_img: {
				image: animalImage?.image
					? `profile_img/thumb/${animalImage.image}`
					: '',
			},
			general,
			breeding_details,
			milk_details,
			vaccination_details: vaccination_list,
			pedigree,
		}
	}

	static async animalBreedingHistoryData(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<AnimalBreedingHistoryResult> {
		// AI History
		const AI = (await db.CommonQuestions.findAll({
			where: { question_tag: { [Op.in]: [23, 35, 42, 14] } },
			include: [
				{
					model: db.AnimalQuestionAnswer,
					as: 'AnimalQuestionAnswers',
					where: {
						user_id,
						animal_id,
						animal_number,
						status: { [Op.ne]: 1 },
					},
				},
			],
			order: [['created_at', 'DESC']],
		})) as CommonQuestionsIncluded[]
		const ai: Record<string, AIHistoryItem> = {}
		const aiHistory: Record<string, AIHistoryItem> = {}
		for (const value of AI) {
			const aqa = value.AnimalQuestionAnswers?.[0]
			if (!aqa) continue
			const createdAtKey = String(aqa.created_at)
			if (value.question_tag === 23) {
				ai[createdAtKey] = ai[createdAtKey] || {}
				ai[createdAtKey]['dateOfAI'] = aqa.answer ?? ''
			} else if (value.question_tag === 35) {
				ai[createdAtKey] = ai[createdAtKey] || {}
				ai[createdAtKey]['bullNumber'] = aqa.answer ?? ''
			} else if (value.question_tag === 42) {
				ai[createdAtKey] = ai[createdAtKey] || {}
				ai[createdAtKey]['motherYield'] = aqa.answer ?? ''
			} else if (value.question_tag === 14) {
				ai[createdAtKey] = ai[createdAtKey] || {}
				ai[createdAtKey]['semenCompanyName'] = aqa.answer ?? ''
			}
			aiHistory[createdAtKey] = ai[createdAtKey]
		}
		// Delivery History
		const Delivery = (await db.CommonQuestions.findAll({
			where: { question_tag: { [Op.in]: [65, 66] } },
			include: [
				{
					model: db.AnimalQuestionAnswer,
					as: 'AnimalQuestionAnswers',
					where: {
						user_id,
						animal_id,
						animal_number,
						status: { [Op.ne]: 1 },
					},
				},
			],
			order: [['created_at', 'DESC']],
		})) as CommonQuestionsIncluded[]
		const delivery: Record<string, DeliveryHistoryItem> = {}
		const deliveryHistory: Record<string, DeliveryHistoryItem> = {}
		for (const value of Delivery) {
			const aqa = value.AnimalQuestionAnswers?.[0]
			if (!aqa) continue
			const createdAtKey = String(aqa.created_at)
			if (value.question_tag === 65) {
				delivery[createdAtKey] = delivery[createdAtKey] || {}
				delivery[createdAtKey]['dateOfDelvery'] = aqa.answer ?? ''
				// Calf number
				const calf = await db.AnimalMotherCalf.findOne({
					where: {
						user_id,
						animal_id,
						mother_animal_number: animal_number,
						delivery_date: aqa.answer ?? '',
					},
				})
				delivery[createdAtKey]['calfNumber'] = calf
					? calf.calf_animal_number
					: null
			} else if (value.question_tag === 66) {
				delivery[createdAtKey] = delivery[createdAtKey] || {}
				delivery[createdAtKey]['typeOfDelivery'] = aqa.answer ?? ''
			}
			deliveryHistory[createdAtKey] = delivery[createdAtKey]
		}
		// Heat Events
		const heatEvents = (await db.CommonQuestions.findAll({
			where: { question_tag: 64 },
			include: [
				{
					model: db.AnimalQuestionAnswer,
					as: 'AnimalQuestionAnswers',
					where: {
						user_id,
						animal_id,
						animal_number,
						status: { [Op.ne]: 1 },
					},
				},
			],
			order: [['created_at', 'DESC']],
		})) as CommonQuestionsIncluded[]
		const heatEventDates: { heatDate: string }[] = []
		for (const value of heatEvents) {
			const aqa = value.AnimalQuestionAnswers?.[0]
			if (!aqa) continue
			heatEventDates.push({ heatDate: aqa.answer ?? '' })
		}
		return {
			animal_number,
			aiHistory: Object.values(aiHistory),
			deliveryHistory: Object.values(deliveryHistory),
			heatHistory: heatEventDates,
		}
	}

	public static async allAnimalBreedingHistoryData(
		user_id: number,
	): Promise<AllAnimalBreedingHistoryResult> {
		// Helper to get pregnancy status
		const getPregnancyStatus = async (
			user_id: number,
			animal_id: number,
			animal_number: string,
		): Promise<string> => {
			const pregStatus = (await db.CommonQuestions.findOne({
				where: { question_tag: 15 },
				include: [
					{
						model: db.AnimalQuestionAnswer,
						as: 'AnimalQuestionAnswers',
						where: {
							user_id,
							animal_id,
							animal_number,
							status: { [Op.ne]: 1 },
						},
					},
				],
			})) as null | { AnimalQuestionAnswers?: { answer?: string }[] }
			return pregStatus?.AnimalQuestionAnswers?.[0]?.answer?.toLowerCase() || ''
		}

		// Get all animal numbers for the user
		const animalNumbers = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
				'animal_id',
			],
		})) as AnimalNumber[]

		const result: AllAnimalBreedingHistoryResult = {
			pregnant: {},
			no_pregnant: {},
		}

		await Promise.all(
			animalNumbers.map(async (animal) => {
				const status = await getPregnancyStatus(
					user_id,
					animal.animal_id,
					animal.animal_number,
				)
				const breedingData = await ReportService.animalBreedingHistoryData(
					user_id,
					animal.animal_id,
					animal.animal_number,
				)
				if (status === 'yes') {
					result.pregnant[animal.animal_number] = breedingData
				} else {
					result.no_pregnant[animal.animal_number] = breedingData
				}
			}),
		)

		return result
	}

	public static async profitLossGraphReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossRowWithBreedingExpense[]> {
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}

		// Batch fetch all income, expense, and breeding expense answers for the date range
		const [incomeAnswers, expenseAnswers, breedingAnswers] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 2 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 1 },
							},
						],
					},
				],
			}),
			db.CommonQuestions.findAll({
				where: { question_tag: 36 },
				include: [
					{
						model: db.AnimalQuestionAnswer,
						as: 'AnimalQuestionAnswers',
						where: {
							user_id,
							created_at: {
								[Op.between]: [
									`${start_date} 00:00:00`,
									`${end_date} 23:59:59`,
								],
							},
						},
					},
				],
			}),
		])

		// Aggregate by date
		const incomeMap = new Map<string, number>()
		for (const ans of incomeAnswers) {
			const answer_date =
				ans.answer_date instanceof Date
					? ans.answer_date.toISOString().split('T')[0]
					: String(ans.answer_date).split('T')[0]
			const arr = JSON.parse(ans.answer) as Array<{
				price: number
				amount?: number
			}>
			let sum = incomeMap.get(answer_date) || 0
			for (const v of arr) sum += v.price * (v.amount ?? 1)
			incomeMap.set(answer_date, sum)
		}
		const expenseMap = new Map<string, number>()
		for (const ans of expenseAnswers) {
			const answer_date =
				ans.answer_date instanceof Date
					? ans.answer_date.toISOString().split('T')[0]
					: String(ans.answer_date).split('T')[0]
			const arr = JSON.parse(ans.answer) as Array<{
				price: number
				amount?: number
			}>
			let sum = expenseMap.get(answer_date) || 0
			for (const v of arr) sum += v.price * (v.amount ?? 1)
			expenseMap.set(answer_date, sum)
		}
		const breedingMap = new Map<string, number>()
		for (const q of breedingAnswers as {
			AnimalQuestionAnswers?: { answer: string; created_at: Date }[]
		}[]) {
			if (q.AnimalQuestionAnswers) {
				for (const aqa of q.AnimalQuestionAnswers) {
					const date =
						aqa.created_at instanceof Date
							? aqa.created_at.toISOString().split('T')[0]
							: String(aqa.created_at).split('T')[0]
					const val = parseFloat(aqa.answer)
					if (!isNaN(val))
						breedingMap.set(date, (breedingMap.get(date) || 0) + val)
				}
			}
		}

		// Build result
		return dates.map((date) => {
			const income = incomeMap.get(date) || 0
			const expense = expenseMap.get(date) || 0
			const breeding = breedingMap.get(date) || 0
			const total = income - (expense + breeding)
			return {
				date,
				profitWithoutSellingAndPurchasePrice:
					total > 0 ? total.toFixed(2) : '0.00',
				lossWithoutSellingAndPurchasePrice:
					total < 0 ? Math.abs(total).toFixed(2) : '0.00',
				breedingExpense: breeding.toFixed(2),
			}
		})
	}

	public static async profitLossGraphWithSellingAndPurchasePrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossWithSellingRow[]> {
		const [incomeAnswers, expenseAnswers] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: { [Op.in]: [2, 28] } },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: { [Op.in]: [1, 22] } },
							},
						],
					},
				],
			}),
		])
		const incomeMap = new Map<string, number>()
		for (const ans of incomeAnswers as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				ans.answer_date instanceof Date
					? ans.answer_date.toISOString().split('T')[0]
					: String(ans.answer_date).split('T')[0]
			const arr = JSON.parse(ans.answer) as { price: number; amount?: number }[]
			let sum = incomeMap.get(date) || 0
			for (const v of arr) sum += v.price * (v.amount ?? 1)
			incomeMap.set(date, sum)
		}
		const expenseMap = new Map<string, number>()
		for (const ans of expenseAnswers as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				ans.answer_date instanceof Date
					? ans.answer_date.toISOString().split('T')[0]
					: String(ans.answer_date).split('T')[0]
			const arr = JSON.parse(ans.answer) as { price: number; amount?: number }[]
			let sum = expenseMap.get(date) || 0
			for (const v of arr) sum += v.price * (v.amount ?? 1)
			expenseMap.set(date, sum)
		}
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		return dates.map((date) => {
			const income = incomeMap.get(date) || 0
			const expense = expenseMap.get(date) || 0
			const total = income - expense
			return {
				date,
				profitWithSellingAndPurchasePrice:
					total > 0 ? total.toFixed(2) : '0.00',
				lossWithSellingAndPurchasePrice:
					total < 0 ? Math.abs(total).toFixed(2) : '0.00',
			}
		})
	}

	public static async milkProductionQuantityGraphData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkProductionQuantityGraphRow[]> {
		// Get all morning and evening records in one batch
		const [morning, evening] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 26 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 27 },
							},
						],
					},
				],
			}),
		])
		// Aggregate by date
		const morningMap = new Map<string, number>()
		for (const rec of morning as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				rec.answer_date instanceof Date
					? rec.answer_date.toISOString().split('T')[0]
					: String(rec.answer_date).split('T')[0]
			const arr = JSON.parse(rec.answer) as { amount: number }[]
			morningMap.set(date, (morningMap.get(date) || 0) + (arr[0]?.amount ?? 0))
		}
		const eveningMap = new Map<string, number>()
		for (const rec of evening as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				rec.answer_date instanceof Date
					? rec.answer_date.toISOString().split('T')[0]
					: String(rec.answer_date).split('T')[0]
			const arr = JSON.parse(rec.answer) as { amount: number }[]
			eveningMap.set(date, (eveningMap.get(date) || 0) + (arr[0]?.amount ?? 0))
		}
		// Build result for all dates in range
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		return dates.map((date) => ({
			date,
			milkProdMorning: (morningMap.get(date) || 0).toFixed(2),
			milkProdEvening: (eveningMap.get(date) || 0).toFixed(2),
		}))
	}

	public static async fatPercentageGraphData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<FatPercentageGraphRow[]> {
		const [morning, evening] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 17 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 19 },
							},
						],
					},
				],
			}),
		])
		const morningMap = new Map<string, number>()
		for (const rec of morning as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				rec.answer_date instanceof Date
					? rec.answer_date.toISOString().split('T')[0]
					: String(rec.answer_date).split('T')[0]
			const arr = JSON.parse(rec.answer) as { name: number }[]
			morningMap.set(date, (morningMap.get(date) || 0) + (arr[0]?.name ?? 0))
		}
		const eveningMap = new Map<string, number>()
		for (const rec of evening as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				rec.answer_date instanceof Date
					? rec.answer_date.toISOString().split('T')[0]
					: String(rec.answer_date).split('T')[0]
			const arr = JSON.parse(rec.answer) as { name: number }[]
			eveningMap.set(date, (eveningMap.get(date) || 0) + (arr[0]?.name ?? 0))
		}
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		return dates.map((date) => ({
			date,
			totalMorningFat: (morningMap.get(date) || 0).toFixed(2),
			totaleveningFat: (eveningMap.get(date) || 0).toFixed(2),
		}))
	}

	public static async snfPercentageGraphData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<SnfPercentageGraphRow[]> {
		const [morning, evening] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 18 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 20 },
							},
						],
					},
				],
			}),
		])
		const morningMap = new Map<string, number>()
		for (const rec of morning as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				rec.answer_date instanceof Date
					? rec.answer_date.toISOString().split('T')[0]
					: String(rec.answer_date).split('T')[0]
			const arr = JSON.parse(rec.answer) as { name: number }[]
			morningMap.set(date, (morningMap.get(date) || 0) + (arr[0]?.name ?? 0))
		}
		const eveningMap = new Map<string, number>()
		for (const rec of evening as {
			answer: string
			answer_date: Date | string
		}[]) {
			const date =
				rec.answer_date instanceof Date
					? rec.answer_date.toISOString().split('T')[0]
					: String(rec.answer_date).split('T')[0]
			const arr = JSON.parse(rec.answer) as { name: number }[]
			eveningMap.set(date, (eveningMap.get(date) || 0) + (arr[0]?.name ?? 0))
		}
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		return dates.map((date) => ({
			date,
			totalMorningSNF: (morningMap.get(date) || 0).toFixed(2),
			totaleveningSNF: (eveningMap.get(date) || 0).toFixed(2),
		}))
	}

	public static async milkAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkAggregateAverage> {
		const [morning, evening, daysCount] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 26 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 27 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.count({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				distinct: true,
				col: 'answer_date',
			}),
		])
		let TotalLitresInMorning = 0,
			milkProdCostMorning = 0
		for (const value of morning as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				amount: number
				price: number
			}[]
			TotalLitresInMorning += arr[0]?.amount ?? 0
			milkProdCostMorning += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
		}
		let TotalLitresInEvening = 0,
			milkProdCostEvening = 0
		for (const value of evening as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				amount: number
				price: number
			}[]
			TotalLitresInEvening += arr[0]?.amount ?? 0
			milkProdCostEvening += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
		}
		const noOfDays = daysCount || 1
		return {
			aggregate: {
				milkProdQtyMorning: TotalLitresInMorning.toFixed(2),
				milkProdQtyEvening: TotalLitresInEvening.toFixed(2),
				milkProdQtyTotal: (TotalLitresInMorning + TotalLitresInEvening).toFixed(
					2,
				),
				milkProdCostMorning: milkProdCostMorning.toFixed(2),
				milkProdCostEvening: milkProdCostEvening.toFixed(2),
				milkProdCostTotal: (milkProdCostMorning + milkProdCostEvening).toFixed(
					2,
				),
			},
			average: {
				milkProdQtyMorning: (TotalLitresInMorning / noOfDays).toFixed(2),
				milkProdQtyEvening: (TotalLitresInEvening / noOfDays).toFixed(2),
				milkProdQtyTotal: (
					(TotalLitresInMorning + TotalLitresInEvening) /
					noOfDays
				).toFixed(2),
				milkProdCostMorning: (milkProdCostMorning / noOfDays).toFixed(2),
				milkProdCostEvening: (milkProdCostEvening / noOfDays).toFixed(2),
				milkProdCostTotal: (
					(milkProdCostMorning + milkProdCostEvening) /
					noOfDays
				).toFixed(2),
			},
		}
	}

	public static async expenseAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ExpenseAggregateAverage> {
		const [expense, greenFeed, cattleFeed, dryFeed, supplement, daysCount] =
			await Promise.all([
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 1 },
								},
							],
						},
					],
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 30 },
								},
							],
						},
					],
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 31 },
								},
							],
						},
					],
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 32 },
								},
							],
						},
					],
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 33 },
								},
							],
						},
					],
				}),
				db.DailyRecordQuestionAnswer.count({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					distinct: true,
					col: 'answer_date',
				}),
			])
		let totalExpense = 0,
			totalGreenFeed = 0,
			totalCattleFeed = 0,
			totalDryFeed = 0,
			totalSupplement = 0,
			greenFeedQty = 0,
			dryFeedQty = 0,
			cattleFeedQty = 0,
			supplementQty = 0
		for (const value of expense as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalExpense += price
			}
		}
		for (const value of greenFeed as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalGreenFeed += price
				greenFeedQty += amount
			}
		}
		for (const value of cattleFeed as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalCattleFeed += price
				cattleFeedQty += amount
			}
		}
		for (const value of dryFeed as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalDryFeed += price
				dryFeedQty += amount
			}
		}
		for (const value of supplement as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalSupplement += price
				supplementQty += amount
			}
		}
		const otherExpense =
			totalExpense -
			(totalGreenFeed + totalCattleFeed + totalDryFeed + totalSupplement)
		const noOfDays = daysCount || 1
		return {
			aggregate: {
				greenFeedQty: greenFeedQty.toFixed(2),
				dryFeedQty: dryFeedQty.toFixed(2),
				cattleFeedQty: cattleFeedQty.toFixed(2),
				supplementQty: supplementQty.toFixed(2),
				greenFeedCost: totalGreenFeed.toFixed(2),
				dryFeedCost: totalDryFeed.toFixed(2),
				cattleFeedCost: totalCattleFeed.toFixed(2),
				supplementCost: totalSupplement.toFixed(2),
				otherExpense: otherExpense.toFixed(2),
				totalExpense: totalExpense.toFixed(2),
			},
			average: {
				greenFeedQty: (greenFeedQty / noOfDays).toFixed(2),
				dryFeedQty: (dryFeedQty / noOfDays).toFixed(2),
				cattleFeedQty: (cattleFeedQty / noOfDays).toFixed(2),
				supplementQty: (supplementQty / noOfDays).toFixed(2),
				greenFeedCost: (totalGreenFeed / noOfDays).toFixed(2),
				dryFeedCost: (totalDryFeed / noOfDays).toFixed(2),
				cattleFeedCost: (totalCattleFeed / noOfDays).toFixed(2),
				supplementCost: (totalSupplement / noOfDays).toFixed(2),
				otherExpense: (otherExpense / noOfDays).toFixed(2),
				totalExpense: (totalExpense / noOfDays).toFixed(2),
			},
		}
	}

	public static async incomeExpenseOnSalePurchaseAnimal(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseOnSalePurchaseAnimal> {
		const [purchasePrice, sellingPrice] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 22 },
							},
						],
					},
				],
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 28 },
							},
						],
					},
				],
			}),
		])
		let expenseForPurchaseAnimals = 0
		for (const value of purchasePrice as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { amount: number }[]
			for (const v of arr) {
				expenseForPurchaseAnimals += v.amount ?? 0
			}
		}
		let incomeForSaleAnimals = 0
		for (const value of sellingPrice as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { amount: number }[]
			for (const v of arr) {
				incomeForSaleAnimals += v.amount ?? 0
			}
		}
		return {
			income_for_sale_animals: incomeForSaleAnimals.toFixed(2),
			expense_for_purchase_animals: expenseForPurchaseAnimals.toFixed(2),
		}
	}

	public static async getMilkAverageAggregateRecord(
		user_id: number,
		start_date: string,
		end_date: string,
		animal_number?: string,
	): Promise<MilkAverageAggregateRecord> {
		const where: Record<string, unknown> = {
			user_id,
			record_date: { [Op.between]: [start_date, end_date] },
		}
		if (animal_number) {
			where.animal_number = animal_number
		}
		// Aggregate totals
		const milk = (await db.DailyMilkRecord.findOne({
			where,
			attributes: [
				[
					db.Sequelize.fn('sum', db.Sequelize.col('morning_milk_in_litres')),
					't_morning_milk',
				],
				[
					db.Sequelize.fn('sum', db.Sequelize.col('evening_milk_in_litres')),
					't_evening_milk',
				],
				[
					db.Sequelize.literal(
						'SUM(morning_milk_in_litres + evening_milk_in_litres)',
					),
					't_day_milk',
				],
			],
			raw: true,
		})) as {
			t_morning_milk: MilkValue
			t_evening_milk: MilkValue
			t_day_milk: MilkValue
		} | null
		// Animal-wise totals
		const animalwise_total = (await db.DailyMilkRecord.findAll({
			where: {
				user_id,
				record_date: { [Op.between]: [start_date, end_date] },
			},
			attributes: [
				[
					db.Sequelize.literal(
						'sum(morning_milk_in_litres)+sum(evening_milk_in_litres)',
					),
					'total',
				],
				'animal_id',
			],
			group: ['animal_id'],
			raw: true,
		})) as unknown as { total: string | number; animal_id: number }[]
		let cow_total = 0,
			buffalo_total = 0
		for (const value of animalwise_total) {
			if (value.animal_id === 1) {
				cow_total = Number(value.total) || 0
			} else if (value.animal_id === 2) {
				buffalo_total = Number(value.total) || 0
			}
		}
		// Days count
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		let noOfDays = 0
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			noOfDays++
		}
		if (noOfDays === 0) noOfDays = 1
		const t_morning = Number(milk?.t_morning_milk ?? 0)
		const t_evening = Number(milk?.t_evening_milk ?? 0)
		const t_total = Number(milk?.t_day_milk ?? 0)
		return {
			aggregate: {
				morning: t_morning.toFixed(2),
				evening: t_evening.toFixed(2),
				total: t_total.toFixed(2),
			},
			average: {
				morning: (t_morning / noOfDays).toFixed(2),
				evening: (t_evening / noOfDays).toFixed(2),
				total: (t_total / noOfDays).toFixed(2),
			},
			total: {
				cow_total: cow_total.toFixed(2),
				buffalo_total: buffalo_total.toFixed(2),
				total: (cow_total + buffalo_total).toFixed(2),
			},
		}
	}

	public static async animalHealthReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalHealthReportResult> {
		// Get all animal health question IDs (question_tag = 5) from CommonQuestions
		const animalHealthQuestions = (await db.CommonQuestions.findAll({
			where: { question_tag: 5 },
			attributes: ['id'],
			raw: true,
		})) as { id: number }[]
		const questionIds = animalHealthQuestions.map((q) => q.id)
		// Get all daily record questions for health (tag 37)
		const dailyRecordQuestions = (await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: { [Op.between]: [start_date, end_date] },
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 37 },
						},
					],
				},
			],
			raw: true,
		})) as { answer: string }[]
		let totalcostOfTreatment = 0
		for (const value of dailyRecordQuestions) {
			const arr = JSON.parse(value.answer) as { price: number }[]
			totalcostOfTreatment += arr[0]?.price ?? 0
		}
		// Get all animal health answers
		const answers = (await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id,
				question_id: { [Op.in]: questionIds },
				created_at: { [Op.between]: [start_date, end_date] },
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 5 },
					attributes: ['question'],
				},
			],
			raw: true,
		})) as unknown as {
			question: string
			answer: string
			created_at: Date | string
			animal_number: string
		}[]
		const totalAnimalCount: Record<string, unknown> = {}
		const resData: AnimalHealthReportResult = {
			total_cost_of_treatment: totalcostOfTreatment.toFixed(2),
			total_animal: 0,
		}
		for (const value of answers) {
			totalAnimalCount[value.animal_number] = true
			resData.total_animal = Object.keys(totalAnimalCount).length
			if (!resData[value.animal_number]) resData[value.animal_number] = {}
			const dateKey =
				value.created_at instanceof Date
					? value.created_at.toISOString().split('T')[0]
					: String(value.created_at).split('T')[0]
			if (!(resData[value.animal_number] as Record<string, unknown>)[dateKey]) {
				;(resData[value.animal_number] as Record<string, unknown>)[dateKey] = []
			}
			;(
				(resData[value.animal_number] as Record<string, unknown>)[dateKey] as {
					question: string | null
					answer: string | null
					animal_number: string | null
					answered_at: string
				}[]
			).push({
				question: value.question ?? null,
				answer: value.answer ?? null,
				animal_number: value.animal_number ?? null,
				answered_at:
					value.created_at instanceof Date
						? value.created_at.toISOString()
						: String(value.created_at),
			})
		}
		return resData
	}

	public static async animalMilkProductionQuantityReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalMilkProductionQuantityReportResult> {
		const [morningMilk, eveningMilk] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 26 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 27 },
							},
						],
					},
				],
				raw: true,
			}),
		])
		const morningMilkData: Record<string, MilkRecordEntry> = {}
		let morningTotal = 0
		let TotalLitresInMorning = 0
		for (const value of morningMilk as unknown as {
			daily_record_question_id: number
			'DailyRecordQuestion.question': string
			answer: string
			answer_date: string
		}[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount: number
			}[]
			morningMilkData[value.answer_date] = {
				daily_record_question_id: value.daily_record_question_id,
				question: value['DailyRecordQuestion.question'],
				answer: arr,
				answer_date: value.answer_date,
			}
			morningTotal += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
			TotalLitresInMorning += arr[0]?.amount ?? 0
		}
		const eveningMilkData: Record<string, MilkRecordEntry[]> = {}
		let eveningTotal = 0
		let TotalLitresInEvening = 0
		for (const value of eveningMilk as unknown as {
			daily_record_question_id: number
			'DailyRecordQuestion.question': string
			answer: string
			answer_date: string
		}[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount: number
			}[]
			if (!eveningMilkData[value.answer_date])
				eveningMilkData[value.answer_date] = []
			eveningMilkData[value.answer_date].push({
				daily_record_question_id: value.daily_record_question_id,
				question: value['DailyRecordQuestion.question'],
				answer: arr,
				answer_date: value.answer_date,
			})
			eveningTotal += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
			TotalLitresInEvening += arr[0]?.amount ?? 0
		}
		return {
			morning: morningMilkData,
			evening: eveningMilkData,
			morningTotal: morningTotal.toFixed(2),
			eveningTotal: eveningTotal.toFixed(2),
			TotalLitresInMorning: TotalLitresInMorning.toFixed(2),
			TotalLitresInEvening: TotalLitresInEvening.toFixed(2),
		}
	}

	public static async animalMilkProductionQualityReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalMilkProductionQualityReportResult> {
		// Get all relevant data in one batch
		const [data, morningFat, morningSNF, eveningFat, eveningSNF] =
			await Promise.all([
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.gte]: start_date, [Op.lte]: end_date },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
						},
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: [17, 18, 19, 20] },
							include: [
								{
									model: db.QuestionTag,
									as: 'QuestionTag',
									attributes: ['name'],
								},
							],
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.gte]: start_date, [Op.lte]: end_date },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
						},
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 17 },
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.gte]: start_date, [Op.lte]: end_date },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
						},
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 18 },
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.gte]: start_date, [Op.lte]: end_date },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
						},
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 19 },
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.gte]: start_date, [Op.lte]: end_date },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
						},
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 20 },
						},
					],
					raw: true,
				}),
			])
		// Calculate totals and counts
		let totalMorningFat = 0,
			totalMorningSNF = 0,
			totaleveningFat = 0,
			totaleveningSNF = 0
		const morningFatCount = morningFat.length || 1
		const morningSNFCount = morningSNF.length || 1
		const eveningFatCount = eveningFat.length || 1
		const eveningSNFCount = eveningSNF.length || 1
		for (const value of morningFat as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { name: number }[]
			totalMorningFat += arr[0]?.name ?? 0
		}
		for (const value of morningSNF as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { name: number }[]
			totalMorningSNF += arr[0]?.name ?? 0
		}
		for (const value of eveningFat as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { name: number }[]
			totaleveningFat += arr[0]?.name ?? 0
		}
		for (const value of eveningSNF as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { name: number }[]
			totaleveningSNF += arr[0]?.name ?? 0
		}
		// Build data structure
		const resData: Record<string, Record<string, MilkQualityRecordEntry[]>> = {}
		for (const value of data as unknown as {
			answer_date: string
			'QuestionTagMappings.QuestionTag.name': string
			daily_record_question_id: number
			'DailyRecordQuestion.question': string
			answer: string
		}[]) {
			const date = value.answer_date
			const tagName = value['QuestionTagMappings.QuestionTag.name']
			if (!resData[date]) resData[date] = {}
			if (!resData[date][tagName]) resData[date][tagName] = []
			resData[date][tagName].push({
				daily_record_question_id: value.daily_record_question_id,
				question: value['DailyRecordQuestion.question'],
				answer: JSON.parse(value.answer) as { name: number }[],
				answer_date: value.answer_date,
			})
		}
		return {
			data: resData,
			totalMorningFat: (totalMorningFat / morningFatCount).toFixed(2),
			totalMorningSNF: (totalMorningSNF / morningSNFCount).toFixed(2),
			totaleveningFat: (totaleveningFat / eveningFatCount).toFixed(2),
			totaleveningSNF: (totaleveningSNF / eveningSNFCount).toFixed(2),
		}
	}

	public static async manureProductionReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ManureProductionReportResult> {
		const data = await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: { [Op.between]: [start_date, end_date] },
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
				},
				{
					model: db.QuestionTagMapping,
					as: 'QuestionTagMappings',
					where: { question_tag_id: 29 },
					include: [
						{
							model: db.QuestionTag,
							as: 'QuestionTag',
							attributes: ['name'],
						},
					],
				},
			],
			raw: true,
		})
		let totalmanureProductionPrice = 0
		let totalmanureProduction = 0
		const resData: Record<string, ManureRecordEntry[]> = {}
		for (const value of data as unknown as {
			answer_date: string
			daily_record_question_id: number
			'DailyRecordQuestion.question': string
			answer: string
		}[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount: number
			}[]
			totalmanureProduction += arr[0]?.amount ?? 0
			const price = (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
			totalmanureProductionPrice += price
			if (!resData[value.answer_date]) resData[value.answer_date] = []
			resData[value.answer_date].push({
				daily_record_question_id: value.daily_record_question_id,
				question: value['DailyRecordQuestion.question'],
				answer: arr,
				answer_date: value.answer_date,
			})
		}
		return {
			data: resData,
			'Total manure production amount': totalmanureProductionPrice.toFixed(2),
			'Total manure production': totalmanureProduction.toFixed(2),
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
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: [28, 2] },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 2 },
							},
						],
					},
				],
				raw: true,
			}),
			db.AnimalQuestionAnswer.findAll({
				where: {
					user_id,
					created_at: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 36 },
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: { [Op.in]: [1, 22] } },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 1 },
							},
						],
					},
				],
				raw: true,
			}),
		])
		let totalIncome = 0,
			totalExpense = 0,
			profit = 0,
			loss = 0,
			totalIncomeWithoutSellingPrice = 0,
			totalExpenseWithoutPurchasePrice = 0,
			profitWithoutSellingAndPurchasePrice = 0,
			lossWithoutSellingAndPurchasePrice = 0,
			breedingTotal = 0
		for (const value of income as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalIncomeWithoutSellingPrice += price
			}
		}
		for (const value of incomeWithSellingPrice as unknown as {
			answer: string
		}[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalIncome += price
			}
		}
		for (const value of breedingExpense as unknown as { answer: string }[]) {
			const val = parseFloat(value.answer)
			if (!isNaN(val)) breedingTotal += val
		}
		for (const value of expense as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalExpenseWithoutPurchasePrice += price
			}
		}
		for (const value of expenseWithPurchasePrice as unknown as {
			answer: string
		}[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalExpense += price
			}
		}
		const total = totalIncome - (totalExpense + breedingTotal)
		const totalWithoutSellingAndPurchasePrice =
			totalIncomeWithoutSellingPrice -
			(totalExpenseWithoutPurchasePrice + breedingTotal)
		if (totalWithoutSellingAndPurchasePrice > 0) {
			profitWithoutSellingAndPurchasePrice = totalWithoutSellingAndPurchasePrice
		} else {
			lossWithoutSellingAndPurchasePrice = totalWithoutSellingAndPurchasePrice
		}
		if (total > 0) {
			profit = total
		} else {
			loss = total
		}
		return {
			totalIncomeWithSellingPrice: totalIncome.toFixed(2),
			totalExpenseWithPurchasePrice: totalExpense.toFixed(2),
			profitWithSellingAndPurchasePrice: profit.toFixed(2),
			lossWithSellingAndPurchasePrice: loss.toFixed(2),
			totalIncomeWithoutSellingPrice: totalIncomeWithoutSellingPrice.toFixed(2),
			totalExpenseWithoutPurchasePrice:
				totalExpenseWithoutPurchasePrice.toFixed(2),
			profitWithoutSellingAndPurchasePrice:
				profitWithoutSellingAndPurchasePrice.toFixed(2),
			lossWithoutSellingAndPurchasePrice:
				lossWithoutSellingAndPurchasePrice.toFixed(2),
			totalbreedingExpense: breedingTotal,
		}
	}

	public static async summaryReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<SummaryReportResult> {
		const [
			expense,
			income,
			greenFeed,
			cattleFeed,
			dryFeed,
			supplement,
			breedingExpense,
		] = await Promise.all([
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 1 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 2 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 30 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 31 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 32 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 33 },
							},
						],
					},
				],
				raw: true,
			}),
			db.AnimalQuestionAnswer.findAll({
				where: {
					user_id,
					created_at: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 36 },
					},
				],
				raw: true,
			}),
		])
		let totalExpense = 0,
			totalIncome = 0,
			profit = 0,
			totalGreenFeed = 0,
			totalCattleFeed = 0,
			totalDryFeed = 0,
			otherExpense = 0,
			totalSupplement = 0,
			totalBreedingExpense = 0
		for (const value of expense as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalExpense += price
			}
		}
		for (const value of income as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalIncome += price
			}
		}
		profit = totalIncome - totalExpense
		for (const value of greenFeed as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalGreenFeed += price
			}
		}
		for (const value of cattleFeed as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalCattleFeed += price
			}
		}
		for (const value of dryFeed as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalDryFeed += price
			}
		}
		for (const value of supplement as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalSupplement += price
			}
		}
		for (const value of breedingExpense as unknown as { answer: string }[]) {
			const val = parseFloat(value.answer)
			if (!isNaN(val)) totalBreedingExpense += val
		}
		otherExpense =
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

	public static async farmInvestmentReport(
		user_id: number,
		language_id: number,
	): Promise<FarmInvestmentReportResult> {
		const fixedInvestments = (await db.FixedInvestmentDetails.findAll({
			where: { user_id },
			raw: true,
		})) as unknown as {
			id: number
			type_of_investment: number
			amount_in_rs: number
			date_of_installation_or_purchase: string | Date
		}[]
		const typeIds = fixedInvestments.map((f) => f.type_of_investment)
		const investmentTypes = (await db.InvestmentTypesLanguage.findAll({
			where: { investment_type_id: { [Op.in]: typeIds }, language_id },
			raw: true,
		})) as { investment_type_id: number; investment_type: string }[]
		const typeMap = new Map<number, string>()
		for (const t of investmentTypes) {
			typeMap.set(t.investment_type_id, t.investment_type)
		}
		const now = new Date()
		let total = 0
		const reportData: FarmInvestmentEntry[] = fixedInvestments.map((value) => {
			const type_of_investment = typeMap.get(value.type_of_investment) ?? null
			const purchaseDate = value.date_of_installation_or_purchase
			const date2 = new Date(
				typeof purchaseDate === 'string'
					? purchaseDate
					: purchaseDate.toISOString(),
			)
			const diffTime = Math.abs(now.getTime() - date2.getTime())
			const age_in_year = (diffTime / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
			total += value.amount_in_rs
			return {
				id: value.id,
				type_of_investment,
				amount_in_rs: value.amount_in_rs,
				date_of_installation_or_purchase:
					typeof purchaseDate === 'string'
						? purchaseDate
						: purchaseDate.toISOString().split('T')[0],
				age_in_year,
			}
		})
		return {
			reportData,
			total_investment: total.toFixed(2),
			number_of_investments: reportData.length,
		}
	}

	public static async incomeAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeAggregateAverageResult> {
		const [morning, evening, manure, selling, income, daysCount] =
			await Promise.all([
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 26 },
								},
							],
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 27 },
								},
							],
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 29 },
								},
							],
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 28 },
								},
							],
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.findAll({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					include: [
						{
							model: db.DailyRecordQuestion,
							as: 'DailyRecordQuestion',
							include: [
								{
									model: db.QuestionTagMapping,
									as: 'QuestionTagMappings',
									where: { question_tag_id: 2 },
								},
							],
						},
					],
					raw: true,
				}),
				db.DailyRecordQuestionAnswer.count({
					where: {
						user_id,
						answer_date: { [Op.between]: [start_date, end_date] },
					},
					distinct: true,
					col: 'answer_date',
				}),
			])
		let TotalLitresInMorning = 0,
			milkProdCostMorning = 0,
			TotalLitresInEvening = 0,
			milkProdCostEvening = 0,
			totalmanureProduction = 0,
			totalmanureProductionPrice = 0,
			totalsellingPrice = 0,
			totalIncome = 0
		for (const value of morning as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				amount: number
				price: number
			}[]
			TotalLitresInMorning += arr[0]?.amount ?? 0
			milkProdCostMorning += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
		}
		for (const value of evening as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				amount: number
				price: number
			}[]
			TotalLitresInEvening += arr[0]?.amount ?? 0
			milkProdCostEvening += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
		}
		for (const value of manure as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				amount: number
				price: number
			}[]
			totalmanureProduction += arr[0]?.amount ?? 0
			totalmanureProductionPrice += (arr[0]?.price ?? 0) * (arr[0]?.amount ?? 0)
		}
		for (const value of selling as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalsellingPrice += price
			}
		}
		for (const value of income as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalIncome += price
			}
		}
		const noOfDays = daysCount || 1
		const OtherIncomeAmount =
			totalIncome +
			totalsellingPrice -
			(totalmanureProductionPrice +
				milkProdCostMorning +
				milkProdCostEvening +
				totalsellingPrice)
		const aggregate = {
			milkProdQtyMorning: TotalLitresInMorning.toFixed(2),
			milkProdQtyEvening: TotalLitresInEvening.toFixed(2),
			milkProdQtyTotal: (TotalLitresInMorning + TotalLitresInEvening).toFixed(
				2,
			),
			milkProdCostMorning: milkProdCostMorning.toFixed(2),
			milkProdCostEvening: milkProdCostEvening.toFixed(2),
			milkProdCostTotal: (milkProdCostMorning + milkProdCostEvening).toFixed(2),
			manureProductionQuantity: totalmanureProduction.toFixed(2),
			manureProductionAmount: totalmanureProductionPrice.toFixed(2),
			sellingPriceAmount: totalsellingPrice.toFixed(2),
			OtherIncomeAmount: OtherIncomeAmount.toFixed(2),
		}
		const average = {
			milkProdQtyMorning: (TotalLitresInMorning / noOfDays).toFixed(2),
			milkProdQtyEvening: (TotalLitresInEvening / noOfDays).toFixed(2),
			milkProdQtyTotal: (
				(TotalLitresInMorning + TotalLitresInEvening) /
				noOfDays
			).toFixed(2),
			milkProdCostMorning: (milkProdCostMorning / noOfDays).toFixed(2),
			milkProdCostEvening: (milkProdCostEvening / noOfDays).toFixed(2),
			milkProdCostTotal: (
				(milkProdCostMorning + milkProdCostEvening) /
				noOfDays
			).toFixed(2),
			manureProductionQuantity: (totalmanureProduction / noOfDays).toFixed(2),
			manureProductionAmount: (totalmanureProductionPrice / noOfDays).toFixed(
				2,
			),
			sellingPriceAmount: (totalsellingPrice / noOfDays).toFixed(2),
			OtherIncomeAmount: (OtherIncomeAmount / noOfDays).toFixed(2),
		}
		return { aggregate, average }
	}

	public static async totalExpenseAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<TotalExpenseAggregateAverageResult> {
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
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 1 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 30 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 31 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 32 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 33 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 22 },
							},
						],
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.findAll({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.DailyRecordQuestion,
						as: 'DailyRecordQuestion',
						include: [
							{
								model: db.QuestionTagMapping,
								as: 'QuestionTagMappings',
								where: { question_tag_id: 37 },
							},
						],
					},
				],
				raw: true,
			}),
			db.AnimalQuestionAnswer.findAll({
				where: {
					user_id,
					created_at: { [Op.between]: [start_date, end_date] },
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 36 },
					},
				],
				raw: true,
			}),
			db.DailyRecordQuestionAnswer.count({
				where: {
					user_id,
					answer_date: { [Op.between]: [start_date, end_date] },
				},
				distinct: true,
				col: 'answer_date',
			}),
		])
		let totalExpense = 0,
			totalGreenFeed = 0,
			totalCattleFeed = 0,
			totalDryFeed = 0,
			totalSupplement = 0,
			greenFeedQty = 0,
			dryFeedQty = 0,
			cattleFeedQty = 0,
			supplementQty = 0,
			totalpurchasePrice = 0,
			totalcostOfTreatment = 0,
			totalbreedingExpense = 0
		for (const value of expense as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalExpense += price
			}
		}
		for (const value of greenFeed as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalGreenFeed += price
				greenFeedQty += amount
			}
		}
		for (const value of cattleFeed as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalCattleFeed += price
				cattleFeedQty += amount
			}
		}
		for (const value of dryFeed as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalDryFeed += price
				dryFeedQty += amount
			}
		}
		for (const value of supplement as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalSupplement += price
				supplementQty += amount
			}
		}
		for (const value of purchasePrice as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalpurchasePrice += price
			}
		}
		for (const value of medicalExpense as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as { price: number }[]
			totalcostOfTreatment += arr[0]?.price ?? 0
		}
		for (const value of breedingExpense as unknown as { answer: string }[]) {
			const val = parseFloat(value.answer)
			if (!isNaN(val)) totalbreedingExpense += val
		}
		const otherExpense =
			totalExpense +
			totalpurchasePrice +
			totalbreedingExpense -
			(totalGreenFeed +
				totalCattleFeed +
				totalDryFeed +
				totalSupplement +
				totalcostOfTreatment +
				totalbreedingExpense +
				totalpurchasePrice)
		const noOfDays = daysCount || 1
		const aggregate = {
			greenFeedQty: greenFeedQty.toFixed(2),
			dryFeedQty: dryFeedQty.toFixed(2),
			cattleFeedQty: cattleFeedQty.toFixed(2),
			supplementQty: supplementQty.toFixed(2),
			greenFeedCost: totalGreenFeed.toFixed(2),
			dryFeedCost: totalDryFeed.toFixed(2),
			cattleFeedCost: totalCattleFeed.toFixed(2),
			supplementCost: totalSupplement.toFixed(2),
			totalExpense: (
				totalExpense +
				totalpurchasePrice +
				totalbreedingExpense
			).toFixed(2),
			purchaseExpense: totalpurchasePrice.toFixed(2),
			medicalExpense: totalcostOfTreatment.toFixed(2),
			breedingExpense: totalbreedingExpense.toFixed(2),
			otherExpense: otherExpense.toFixed(2),
		}
		const average = {
			greenFeedQty: (greenFeedQty / noOfDays).toFixed(2),
			dryFeedQty: (dryFeedQty / noOfDays).toFixed(2),
			cattleFeedQty: (cattleFeedQty / noOfDays).toFixed(2),
			supplementQty: (supplementQty / noOfDays).toFixed(2),
			greenFeedCost: (totalGreenFeed / noOfDays).toFixed(2),
			dryFeedCost: (totalDryFeed / noOfDays).toFixed(2),
			cattleFeedCost: (totalCattleFeed / noOfDays).toFixed(2),
			supplementCost: (totalSupplement / noOfDays).toFixed(2),
			totalExpense: (
				(totalExpense + totalpurchasePrice + totalbreedingExpense) /
				noOfDays
			).toFixed(2),
			purchaseExpense: (totalpurchasePrice / noOfDays).toFixed(2),
			medicalExpense: (totalcostOfTreatment / noOfDays).toFixed(2),
			breedingExpense: (totalbreedingExpense / noOfDays).toFixed(2),
			otherExpense: (otherExpense / noOfDays).toFixed(2),
		}
		return { aggregate, average }
	}

	public static async healthReportDetails(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<HealthReportDetailsResult> {
		// Get all animal numbers for the user
		const userAnimals = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id },
			attributes: [
				[db.Sequelize.literal('DISTINCT animal_number'), 'animal_number'],
			],
			raw: true,
		})) as { animal_number: string }[]
		// Get all daily record questions for health (tag 37)
		const dailyRecordQuestions = (await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: { [Op.between]: [start_date, end_date] },
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 37 },
						},
					],
				},
			],
			raw: true,
		})) as { answer: string }[]
		let totalcostOfTreatment = 0
		for (const value of dailyRecordQuestions) {
			const arr = JSON.parse(value.answer) as { price: number }[]
			totalcostOfTreatment += arr[0]?.price ?? 0
		}
		// Build date range
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		const animals: string[] = []
		const resData: HealthReportDetailsEntry[] = []
		for (const animal of userAnimals) {
			for (const date of dates) {
				let answer1: string | null = null
				let answer2: string | null = null
				let answer3: string | null = null
				let answer4: string | null = null
				// Date (tag 38)
				const answerDate = (await db.AnimalQuestionAnswer.findAll({
					where: {
						animal_number: animal.animal_number,
						user_id,
						created_at: {
							[Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
						},
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'CommonQuestion',
							where: { question_tag: 38 },
						},
					],
					raw: true,
				})) as { answer: string }[]
				if (answerDate.length > 0) answer1 = answerDate[0].answer
				// Disease Name (tag 39)
				const diseasName = (await db.AnimalQuestionAnswer.findAll({
					where: {
						animal_number: animal.animal_number,
						user_id,
						created_at: {
							[Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
						},
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'CommonQuestion',
							where: { question_tag: 39 },
						},
					],
					raw: true,
				})) as { answer: string }[]
				if (diseasName.length > 0) answer2 = diseasName[0].answer
				// Treatment (tag 40)
				const treatmentData = (await db.AnimalQuestionAnswer.findAll({
					where: {
						animal_number: animal.animal_number,
						user_id,
						created_at: {
							[Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
						},
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'CommonQuestion',
							where: { question_tag: 40 },
						},
					],
					raw: true,
				})) as { answer: string }[]
				if (treatmentData.length > 0) answer3 = treatmentData[0].answer || null
				// Milk Loss (tag 41)
				const milkLoss = (await db.AnimalQuestionAnswer.findAll({
					where: {
						animal_number: animal.animal_number,
						user_id,
						created_at: {
							[Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
						},
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'CommonQuestion',
							where: { question_tag: 41 },
						},
					],
					raw: true,
				})) as { answer: string }[]
				if (milkLoss.length > 0) answer4 = milkLoss[0].answer
				const entry: HealthReportDetailsEntry = {
					date: answer1,
					diseasName: answer2,
					details_of_treatment: answer3,
					milk_loss_in_litres: answer4,
					animal_number: animal.animal_number,
				}
				if (entry.date) {
					resData.push(entry)
					if (!animals.includes(entry.animal_number)) {
						animals.push(entry.animal_number)
					}
				}
			}
		}
		return {
			animal_count: animals.length,
			total_cost_of_treatment: totalcostOfTreatment,
			data: resData,
		}
	}

	public static async latestProfitLossReport(
		user_id: number,
	): Promise<LatestProfitLossReportResult> {
		// Get latest date from animal_question_answers (tag 36)
		const date2 = (await db.AnimalQuestionAnswer.findOne({
			where: { user_id },
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 36 },
				},
			],
			order: [['created_at', 'DESC']],
			raw: true,
		})) as { created_at?: string } | null
		// Get latest date from daily_record_question_answer (tag 1,2)
		const date = (await db.DailyRecordQuestionAnswer.findOne({
			where: { user_id },
			include: [
				{
					model: db.QuestionTagMapping,
					as: 'QuestionTagMappings',
					where: { question_tag_id: [1, 2] },
				},
			],
			order: [['answer_date', 'DESC']],
			raw: true,
		})) as { answer_date?: string } | null
		let latestDate: string
		if (date?.answer_date && !date2?.created_at) {
			latestDate = date.answer_date
		} else if (!date?.answer_date && date2?.created_at) {
			latestDate = date2.created_at
		} else if (date?.answer_date && date2?.created_at) {
			const latestDate1 = new Date(date.answer_date).getTime()
			const latestDate2 = new Date(date2.created_at).getTime()
			latestDate =
				latestDate1 > latestDate2 ? date.answer_date : date2.created_at
		} else {
			latestDate = new Date().toISOString().split('T')[0]
		}
		const date1 = latestDate.split('T')[0]
		// Income
		const income = await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: date1,
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 2 },
						},
					],
				},
			],
			raw: true,
		})
		let totalIncomeWithoutSellingPrice = 0
		for (const value of income as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalIncomeWithoutSellingPrice += price
			}
		}
		// Breeding expense
		const breedingExpense = await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id,
				created_at: {
					[Op.between]: [`${date1} 00:00:00`, `${date1} 23:59:59`],
				},
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag: 36 },
				},
			],
			raw: true,
		})
		let breedingTotal = 0
		for (const value of breedingExpense as unknown as { answer: string }[]) {
			const val = parseFloat(value.answer)
			if (!isNaN(val)) breedingTotal += val
		}
		// Expense
		const expense = await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: date1,
			},
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							where: { question_tag_id: 1 },
						},
					],
				},
			],
			raw: true,
		})
		let totalExpenseWithoutPurchasePrice = 0
		for (const value of expense as unknown as { answer: string }[]) {
			const arr = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			for (const v of arr) {
				const amount = v.amount ?? 1
				const price = v.price * amount
				totalExpenseWithoutPurchasePrice += price
			}
		}
		const totalWithoutSellingAndPurchasePrice =
			totalIncomeWithoutSellingPrice -
			(totalExpenseWithoutPurchasePrice + breedingTotal)
		let key: 'profit' | 'loss' | null = null
		if (totalWithoutSellingAndPurchasePrice > 0) {
			key = 'profit'
		} else if (totalWithoutSellingAndPurchasePrice < 0) {
			key = 'loss'
		}
		return {
			date: latestDate,
			profit_loss: totalWithoutSellingAndPurchasePrice.toFixed(2),
			key,
		}
	}

	public static async animalMilkReportDetails(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<AnimalMilkReportDetailsRow[]> {
		// Get all user animals (distinct animal_number, animal_id)
		const userAnimals = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id },
			attributes: [
				[db.Sequelize.literal('DISTINCT animal_number'), 'animal_number'],
				'animal_id',
			],
			raw: true,
		})) as { animal_number: string; animal_id: number }[]
		// Build date range
		const date_from = new Date(start_date)
		const date_to = new Date(end_date)
		const dates: string[] = []
		for (
			let d = new Date(date_from);
			d <= date_to;
			d.setDate(d.getDate() + 1)
		) {
			dates.push(d.toISOString().split('T')[0])
		}
		// Prepare all queries in batch for all animals and all dates
		const tagMap = {
			morningFat: 17,
			morningSNF: 18,
			eveningFat: 19,
			eveningSNF: 20,
			bacterialCount: 54,
			somaticCellCount: 53,
			milkReportDate: 56,
		}
		// For performance, fetch all relevant answers in one go
		const allAnswers = (await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id,
				created_at: {
					[Op.between]: [`${start_date} 00:00:00`, `${end_date} 23:59:59`],
				},
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					attributes: ['question_tag'],
					where: { question_tag: [17, 18, 19, 20, 53, 54, 56] },
				},
			],
			raw: true,
		})) as unknown as {
			animal_number: string
			animal_id: number
			answer: string
			created_at: string
			'CommonQuestion.question_tag': number
		}[]
		// Build a map: animal_number|animal_id|date|tag -> answer
		const answerMap = new Map<string, string>()
		for (const ans of allAnswers) {
			const date = ans.created_at.split('T')[0]
			const key = `${ans.animal_number}|${ans.animal_id}|${date}|${ans['CommonQuestion.question_tag']}`
			answerMap.set(key, ans.answer)
		}
		const resData: AnimalMilkReportDetailsRow[] = []
		for (const animal of userAnimals) {
			for (const date of dates) {
				const get = (tag: number): string | null =>
					answerMap.get(
						`${animal.animal_number}|${animal.animal_id}|${date}|${tag}`,
					) ?? null
				const row: AnimalMilkReportDetailsRow = {
					date: get(tagMap.milkReportDate),
					animalNumber: animal.animal_number,
					morningFat: get(tagMap.morningFat),
					morningSNF: get(tagMap.morningSNF),
					eveningFat: get(tagMap.eveningFat),
					eveningSNF: get(tagMap.eveningSNF),
					bacterialCount: get(tagMap.bacterialCount),
					somaticCellCount: get(tagMap.somaticCellCount),
				}
				if (row.date) {
					resData.push(row)
				}
			}
		}
		return resData
	}
}

const REPORT_CONFIGS: Record<
	string,
	{
		fetchData: (...args: unknown[]) => Promise<unknown>
		viewName: string
		emailTemplate: string
		emailSubject: string
		emailDataKey: string
	}
> = {
	health_report: {
		fetchData: (...args) =>
			ReportService.healthReportPDFData(...(args as [number, string, string])),
		viewName: 'healthReportPDF',
		emailTemplate: 'helathReport',
		emailSubject: 'Health Report',
		emailDataKey: 'animalHealthData',
	},
	manure_production: {
		fetchData: (...args) =>
			ReportService.manureProductionReportPDFData(
				...(args as [number, string, string]),
			),
		viewName: 'manureProductionPDF',
		emailTemplate: 'manureProductionReport',
		emailSubject: 'Manure Production Report',
		emailDataKey: 'manureProductionData',
	},
	animal_milk_production_quantity: {
		fetchData: (...args) =>
			ReportService.animalMilkProductionQuantityPDFData(
				...(args as [number, string, string]),
			),
		viewName: 'animalMilkProductionQuantityPDF',
		emailTemplate: 'animalMilkProductionQuantityReport',
		emailSubject: 'Animal Milk Production Quantity Report',
		emailDataKey: 'milkProductionData',
	},
	profit_loss_graph_with_selling_and_purchase_price: {
		fetchData: (...args) =>
			ReportService.profitLossGraphWithSellingAndPurcahsePricePDFData(
				...(args as [number, string, string]),
			),
		viewName: 'profitLossGraphWithSellingAndPurcahsePricePDF',
		emailTemplate: 'profitLossGraphWithSellingAndPurcahsePriceReport',
		emailSubject: 'Profit Loss Graph With Selling And Purchase Price Report',
		emailDataKey: 'profitLossGraphData',
	},
	profit_loss: {
		fetchData: (...args) =>
			ReportService.profitLossPDFData(...(args as [number, string, string])),
		viewName: 'profitLossPDF',
		emailTemplate: 'profitLossReport',
		emailSubject: 'Profit Loss Report',
		emailDataKey: 'profitLossData',
	},
	income_expense: {
		fetchData: (...args) =>
			ReportService.incomeExpensePDFData(...(args as [number, string, string])),
		viewName: 'incomeExpensePDF',
		emailTemplate: 'incomeExpenseReport',
		emailSubject: 'Income Expense Report',
		emailDataKey: 'incomeExpenseData',
	},
	milk_production_quantity: {
		fetchData: (...args) =>
			ReportService.animalMilkProductionQuantityPDFData(
				...(args as [number, string, string]),
			),
		viewName: 'milkProductionQuantityPDF',
		emailTemplate: 'milkProductionQuantityReport',
		emailSubject: 'Milk Production Quantity Report',
		emailDataKey: 'milkProductionQuantityData',
	},
	milk_report: {
		fetchData: (...args) =>
			ReportService.milkReportPDFData(
				...(args as [number, string, string, string?]),
			),
		viewName: 'milkReportPDF',
		emailTemplate: 'milkReport',
		emailSubject: 'Milk Report',
		emailDataKey: 'milkReportData',
	},
	get_profile: {
		fetchData: (...args) =>
			ReportService.getProfileData(...(args as [number, number, string])),
		viewName: 'profilePDF',
		emailTemplate: 'profileReport',
		emailSubject: 'Profile Report',
		emailDataKey: 'profileData',
	},
	animal_breeding_history: {
		fetchData: (...args) =>
			ReportService.animalBreedingHistoryData(
				...(args as [number, number, string]),
			),
		viewName: 'animalBreedingHistoryPDF',
		emailTemplate: 'animalBreedingHistoryReport',
		emailSubject: 'Animal Breeding History Report',
		emailDataKey: 'animalBreedingHistoryData',
	},
	all_animal_breeding_history: {
		fetchData: (...args) =>
			ReportService.allAnimalBreedingHistoryData(...(args as [number])),
		viewName: 'allAnimalBreedingHistoryPDF',
		emailTemplate: 'allAnimalBreedingHistoryReport',
		emailSubject: 'All Animal Breeding History Report',
		emailDataKey: 'allAnimalBreedingHistoryData',
	},
}
