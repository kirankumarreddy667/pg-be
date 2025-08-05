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
		const dates = this.generateDateRange(start_date, end_date)
		const resData: ProfitLossGraphRow[] = []

		for (const date of dates) {
			const profitLossData = await this.calculateProfitLossForDate(
				user_id,
				date,
			)
			if (profitLossData) {
				resData.push(profitLossData)
			}
		}

		return resData
	}

	private static async calculateProfitLossForDate(
		user_id: number,
		date: string,
	): Promise<ProfitLossGraphRow | null> {
		const newDate = this.formatDate(date)
		const [totalIncomeWithSellingPrice, totalExpenseWithPurchasePrice] =
			await Promise.all([
				this.calculateIncomeWithSellingPrice(user_id, date),
				this.calculateExpenseWithPurchasePrice(user_id, date),
			])

		const totalWithSellingAndPurchasePrice =
			totalIncomeWithSellingPrice - totalExpenseWithPurchasePrice
		const { profit, loss } = this.calculateProfitAndLoss(
			totalWithSellingAndPurchasePrice,
		)

		const result: ProfitLossGraphRow = {
			date: newDate,
			profit: profit.toFixed(2),
			loss: loss.toFixed(2),
		}

		return result.profit !== '0.00' || result.loss !== '0.00' ? result : null
	}

	private static formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
	}

	private static async calculateIncomeWithSellingPrice(
		user_id: number,
		date: string,
	): Promise<number> {
		const income = await this.fetchDailyRecordQuestions(user_id, date, [2, 28])
		return this.calculateTotalFromAnswers(income)
	}

	private static async calculateExpenseWithPurchasePrice(
		user_id: number,
		date: string,
	): Promise<number> {
		const expense = await this.fetchDailyRecordQuestions(user_id, date, [1, 22])
		return this.calculateTotalFromAnswers(expense)
	}

	private static async fetchDailyRecordQuestions(
		user_id: number,
		date: string,
		questionTagIds: number[],
	): Promise<{ answer: string }[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
							where: { question_tag_id: { [Op.in]: questionTagIds } },
						},
					],
				},
			],
			order: [['answer_date', 'DESC']],
		})
	}

	private static calculateTotalFromAnswers(
		records: { answer: string }[],
	): number {
		let total = 0
		for (const record of records) {
			const answer = JSON.parse(record.answer) as Array<{
				price: number
				amount: number
			}>
			for (const item of answer) {
				const amount = item.amount || 1
				const price = item.price * amount
				total += price
			}
		}
		return total
	}

	private static calculateProfitAndLoss(total: number): {
		profit: number
		loss: number
	} {
		if (total > 0) {
			return { profit: total, loss: 0 }
		} else {
			return { profit: 0, loss: Math.abs(total) }
		}
	}

	public static async profitLossPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossRow[]> {
		const dates = this.generateDateRange(start_date, end_date)
		const resData: ProfitLossRow[] = []

		for (const date of dates) {
			const profitLossData =
				await this.calculateProfitLossWithoutSellingPurchase(user_id, date)
			if (profitLossData) {
				resData.push(profitLossData)
			}
		}

		return resData
	}

	private static async calculateProfitLossWithoutSellingPurchase(
		user_id: number,
		date: string,
	): Promise<ProfitLossRow | null> {
		const newDate = this.formatDate(date)
		const [totalIncomeWithoutSellingPrice, totalExpenseWithoutPurchasePrice] =
			await Promise.all([
				this.calculateIncomeWithoutSellingPrice(user_id, date),
				this.calculateExpenseWithoutPurchasePrice(user_id, date),
			])

		const totalWithoutSellingAndPurchasePrice =
			totalIncomeWithoutSellingPrice - totalExpenseWithoutPurchasePrice
		const { profit, loss } = this.calculateProfitAndLoss(
			totalWithoutSellingAndPurchasePrice,
		)

		const result: ProfitLossRow = {
			date: newDate,
			profitWithoutSellingAndPurchasePrice: profit.toFixed(2),
			lossWithoutSellingAndPurchasePrice: loss.toFixed(2),
		}

		return this.shouldIncludeProfitLossRow(result) ? result : null
	}

	private static async calculateIncomeWithoutSellingPrice(
		user_id: number,
		date: string,
	): Promise<number> {
		const income = await this.fetchDailyRecordQuestions(user_id, date, [2])
		return this.calculateTotalFromAnswers(income)
	}

	private static async calculateExpenseWithoutPurchasePrice(
		user_id: number,
		date: string,
	): Promise<number> {
		const expense = await this.fetchDailyRecordQuestions(user_id, date, [1])
		return this.calculateTotalFromAnswers(expense)
	}

	private static shouldIncludeProfitLossRow(result: ProfitLossRow): boolean {
		return (
			result.profitWithoutSellingAndPurchasePrice !== '0.00' ||
			result.lossWithoutSellingAndPurchasePrice !== '0.00'
		)
	}

	public static async incomeExpensePDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseResult> {
		const dates = this.generateDateRange(start_date, end_date)
		const totals = this.initializeTotals()
		const data: IncomeExpenseRow[] = []

		for (const date of dates) {
			const dailyData = await this.processDailyIncomeExpense(user_id, date)
			if (dailyData) {
				data.push(dailyData)
				this.updateTotals(totals, dailyData)
			}
		}

		return {
			expenseData: data,
			totalExpenseData: this.formatTotals(totals),
		}
	}

	private static initializeTotals(): {
		t_expense: number
		t_income: number
		t_profit: number
		t_greenFeed: number
		t_cattleFeed: number
		t_dryFeed: number
		t_otherExpense: number
		t_supplement: number
	} {
		return {
			t_expense: 0,
			t_income: 0,
			t_profit: 0,
			t_greenFeed: 0,
			t_cattleFeed: 0,
			t_dryFeed: 0,
			t_otherExpense: 0,
			t_supplement: 0,
		}
	}

	private static async processDailyIncomeExpense(
		user_id: number,
		date: string,
	): Promise<IncomeExpenseRow | null> {
		const newDate = this.formatDate(date)
		const [totalExpense, totalIncome] = await Promise.all([
			this.calculateExpenseForDate(user_id, date),
			this.calculateIncomeForDate(user_id, date),
		])

		const profit = totalIncome - totalExpense
		const [totalGreenFeed, totalCattleFeed, totalDryFeed, totalSupplement] =
			await Promise.all([
				this.calculateFeedTypeForDate(user_id, date, 30),
				this.calculateFeedTypeForDate(user_id, date, 31),
				this.calculateFeedTypeForDate(user_id, date, 32),
				this.calculateFeedTypeForDate(user_id, date, 33),
			])

		const otherExpense =
			totalExpense -
			(totalGreenFeed + totalCattleFeed + totalDryFeed + totalSupplement)

		const result: IncomeExpenseRow = {
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

		return this.shouldIncludeIncomeExpenseRow(result) ? result : null
	}

	private static async calculateExpenseForDate(
		user_id: number,
		date: string,
	): Promise<number> {
		const expense = await this.fetchDailyRecordQuestions(user_id, date, [1])
		return this.calculateTotalFromAnswers(expense)
	}

	private static async calculateIncomeForDate(
		user_id: number,
		date: string,
	): Promise<number> {
		const income = await this.fetchDailyRecordQuestions(user_id, date, [2])
		return this.calculateTotalFromAnswers(income)
	}

	private static async calculateFeedTypeForDate(
		user_id: number,
		date: string,
		questionTagId: number,
	): Promise<number> {
		const feedData = await this.fetchDailyRecordQuestions(user_id, date, [
			questionTagId,
		])
		return this.calculateTotalFromAnswers(feedData)
	}

	private static updateTotals(
		totals: {
			t_expense: number
			t_income: number
			t_profit: number
			t_greenFeed: number
			t_cattleFeed: number
			t_dryFeed: number
			t_otherExpense: number
			t_supplement: number
		},
		dailyData: IncomeExpenseRow,
	): void {
		totals.t_expense += parseFloat(dailyData.Expense)
		totals.t_income += parseFloat(dailyData.Income)
		totals.t_profit += parseFloat(dailyData.Profit)
		totals.t_greenFeed += parseFloat(dailyData.GreenFeed)
		totals.t_cattleFeed += parseFloat(dailyData.CattleFeed)
		totals.t_dryFeed += parseFloat(dailyData.DryFeed)
		totals.t_otherExpense += parseFloat(dailyData.OtherExpense)
		totals.t_supplement += parseFloat(dailyData.Supplement)
	}

	private static formatTotals(totals: {
		t_expense: number
		t_income: number
		t_profit: number
		t_greenFeed: number
		t_cattleFeed: number
		t_dryFeed: number
		t_otherExpense: number
		t_supplement: number
	}): {
		totalExpense: string
		totalIncome: string
		totalProfit: string
		totalGreenFeed: string
		totalCattleFeed: string
		totalDryFeed: string
		totalOtherExpense: string
		totalSupplement: string
	} {
		return {
			totalExpense: totals.t_expense.toFixed(2),
			totalIncome: totals.t_income.toFixed(2),
			totalProfit: totals.t_profit.toFixed(2),
			totalGreenFeed: totals.t_greenFeed.toFixed(2),
			totalCattleFeed: totals.t_cattleFeed.toFixed(2),
			totalDryFeed: totals.t_dryFeed.toFixed(2),
			totalOtherExpense: totals.t_otherExpense.toFixed(2),
			totalSupplement: totals.t_supplement.toFixed(2),
		}
	}

	private static shouldIncludeIncomeExpenseRow(
		result: IncomeExpenseRow,
	): boolean {
		return (
			result.Expense !== '0.00' ||
			result.Income !== '0.00' ||
			result.GreenFeed !== '0.00' ||
			result.DryFeed !== '0.00' ||
			result.Supplement !== '0.00' ||
			result.CattleFeed !== '0.00'
		)
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
		const [animalType, animalImage, vaccinations, motherNo] = await Promise.all(
			[
				this.getAnimalType(user_id, animal_id, animal_number),
				this.getAnimalImage(user_id, animal_id, animal_number),
				this.getVaccinations(user_id),
				this.getMotherInfo(user_id, animal_id, animal_number),
			],
		)

		const generalData = await this.getGeneralData(
			user_id,
			animal_id,
			animal_number,
			animalType,
		)
		const breedingData = await this.getBreedingData(
			user_id,
			animal_id,
			animal_number,
		)
		const milkData = await this.getMilkData(user_id, animal_id, animal_number)
		const pedigreeData = await this.getPedigreeData(motherNo)

		return {
			profile_img: this.formatProfileImage(animalImage),
			general: generalData,
			breeding_details: breedingData,
			milk_details: milkData,
			vaccination_details: this.formatVaccinations(vaccinations),
			pedigree: pedigreeData,
		}
	}

	private static async getAnimalType(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<InstanceType<typeof db.AnimalQuestionAnswer> | null> {
		return await db.AnimalQuestionAnswer.findOne({
			where: { user_id, animal_id, animal_number, status: { [Op.ne]: 1 } },
			include: [{ model: db.Animal, as: 'Animal' }],
		})
	}

	private static async getAnimalImage(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ image?: string } | null> {
		return await db.AnimalImage.findOne({
			where: { user_id, animal_id, animal_number },
		})
	}

	private static async getVaccinations(
		user_id: number,
	): Promise<InstanceType<typeof db.VaccinationDetail>[]> {
		return await db.VaccinationDetail.findAll({
			where: { user_id },
			include: [
				{
					model: db.VaccinationType,
					as: 'VaccinationType',
				},
			],
		})
	}

	private static async getMotherInfo(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<InstanceType<typeof db.AnimalMotherCalf> | null> {
		return await db.AnimalMotherCalf.findOne({
			where: { user_id, animal_id, calf_animal_number: animal_number },
		})
	}

	private static async getGeneralData(
		user_id: number,
		animal_id: number,
		animal_number: string,
		animalType: InstanceType<typeof db.AnimalQuestionAnswer> | null,
	): Promise<Record<string, unknown>> {
		const [dateOfBirth, weight, pregnancyCycle] = await Promise.all([
			this.getLastQuestionAnswerByQuestionTag(
				user_id,
				animal_id,
				animal_number,
				9,
			),
			this.getLastQuestionAnswerByQuestionTag(
				user_id,
				animal_id,
				animal_number,
				12,
			),
			this.getLastQuestionAnswerByQuestionTag(
				user_id,
				animal_id,
				animal_number,
				59,
			),
		])

		const breed = await this.getBreed(user_id, animal_id, animal_number)
		const age = this.calculateAge(dateOfBirth)

		return {
			animal_type: animalType
				? (animalType as { Animal?: { name?: string } }).Animal?.name || ''
				: '',
			birth: dateOfBirth ? dateOfBirth.answer : '',
			weight: weight ? weight.answer : '',
			age,
			breed,
			lactation_number: pregnancyCycle ? pregnancyCycle.answer : '',
			animal_number,
		}
	}

	private static async getBreedingData(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<Record<string, unknown>> {
		const [pregnantStatus, milkingStatus, lastDeliveryDate, BullNoForAI] =
			await Promise.all([
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					15,
				),
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					16,
				),
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					66,
				),
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					35,
				),
			])

		return {
			pregnant_status: pregnantStatus ? pregnantStatus.answer : '',
			lactating_status: milkingStatus ? milkingStatus.answer : '',
			last_delivery_date: lastDeliveryDate ? lastDeliveryDate.answer : '',
			days_in_milk: 0, // Not calculated here
			last_breeding_bull_no: BullNoForAI ? BullNoForAI.answer : '',
		}
	}

	private static async getMilkData(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<Record<string, unknown>> {
		const [morning_fat, evening_fat, morning_snf, evening_snf] =
			await Promise.all([
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					17,
				),
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					19,
				),
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					18,
				),
				this.getLastQuestionAnswerByQuestionTag(
					user_id,
					animal_id,
					animal_number,
					20,
				),
			])

		const last_known_fat = this.calculateFatSNF(morning_fat, evening_fat)
		const last_known_snf = this.calculateFatSNF(morning_snf, evening_snf)

		return {
			average_daily_milk: '', // Not calculated here
			current_lactation_milk_yield: '', // Not calculated here
			last_lactation_milk_yield: '', // Not calculated here
			last_known_snf: (last_known_snf / 2).toFixed(2),
			last_known_fat: (last_known_fat / 2).toFixed(2),
		}
	}

	private static async getPedigreeData(
		motherNo: { mother_animal_number?: string } | null,
	): Promise<Record<string, unknown>> {
		let mother_milk_yield = 0
		if (motherNo) {
			mother_milk_yield = await this.calculateMotherMilkYield(motherNo)
		}

		return {
			mother: {
				tag_no: motherNo ? motherNo.mother_animal_number : '',
				milk_yield: mother_milk_yield ? mother_milk_yield.toFixed(1) : '',
			},
			father: {
				tag_no: '',
				semen_co_name: '',
				sire_dam_yield: '',
				daughter_yield: '',
			},
		}
	}

	private static async getLastQuestionAnswerByQuestionTag(
		user_id: number,
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

	private static async getBreed(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<string> {
		if (animal_id === 1) {
			const breeding = await this.getLastQuestionAnswerByQuestionTag(
				user_id,
				animal_id,
				animal_number,
				62,
			)
			return breeding ? (breeding.answer ?? '') : ''
		} else if (animal_id === 2) {
			const breeding = await this.getLastQuestionAnswerByQuestionTag(
				user_id,
				animal_id,
				animal_number,
				63,
			)
			return breeding ? (breeding.answer ?? '') : ''
		}
		return ''
	}

	private static calculateAge(dateOfBirth: { answer?: string } | null): number {
		if (!dateOfBirth?.answer) return 0
		const bday = new Date(dateOfBirth.answer)
		const today = new Date()
		return today.getFullYear() - bday.getFullYear()
	}

	private static calculateFatSNF(
		morning: { answer?: string } | null,
		evening: { answer?: string } | null,
	): number {
		const m_value = morning ? (morning.answer ?? '') : ''
		const e_value = evening ? (evening.answer ?? '') : ''
		return (parseFloat(m_value ?? '') || 0) + (parseFloat(e_value ?? '') || 0)
	}

	private static async calculateMotherMilkYield(
		motherNo: {
			user_id?: number
			animal_id?: number
			mother_animal_number?: string
		} | null,
	): Promise<number> {
		const [morningSum, eveningSum] = await Promise.all([
			db.DailyMilkRecord.sum('morning_milk_in_litres', {
				where: {
					user_id: motherNo?.user_id,
					animal_id: motherNo?.animal_id,
					animal_number: motherNo?.mother_animal_number || '',
				},
			}),
			db.DailyMilkRecord.sum('evening_milk_in_litres', {
				where: {
					user_id: motherNo?.user_id,
					animal_id: motherNo?.animal_id,
					animal_number: motherNo?.mother_animal_number || '',
				},
			}),
		])
		return (morningSum || 0) + (eveningSum || 0)
	}

	private static formatProfileImage(animalImage: { image?: string } | null): {
		image: string
	} {
		return {
			image: animalImage?.image || '',
		}
	}

	private static formatVaccinations(
		vaccinations: InstanceType<typeof db.VaccinationDetail>[],
	): { type: string; date: string }[] {
		return vaccinations.map((vaccination) => ({
			type:
				(vaccination as { VaccinationType?: { type?: string } }).VaccinationType
					?.type || '',
			date: '',
		}))
	}

	static async animalBreedingHistoryData(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<AnimalBreedingHistoryResult> {
		const [aiHistory, deliveryHistory, heatHistory] = await Promise.all([
			this.getAIHistory(user_id, animal_id, animal_number),
			this.getDeliveryHistory(user_id, animal_id, animal_number),
			this.getHeatHistory(user_id, animal_id, animal_number),
		])

		return {
			animal_number,
			aiHistory,
			deliveryHistory,
			heatHistory,
		}
	}

	private static async getAIHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<AIHistoryItem[]> {
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

		const aiHistory: Record<string, AIHistoryItem> = {}
		for (const value of AI) {
			const aqa = value.AnimalQuestionAnswers?.[0]
			if (!aqa) continue
			const createdAtKey = String(aqa.created_at)
			aiHistory[createdAtKey] = aiHistory[createdAtKey] || {}
			this.updateAIHistoryItem(
				aiHistory[createdAtKey],
				value.question_tag,
				aqa.answer,
			)
		}

		return Object.values(aiHistory)
	}

	private static updateAIHistoryItem(
		item: AIHistoryItem,
		questionTag: number,
		answer: string | undefined,
	): void {
		switch (questionTag) {
			case 23:
				item.dateOfAI = answer ?? ''
				break
			case 35:
				item.bullNumber = answer ?? ''
				break
			case 42:
				item.motherYield = answer ?? ''
				break
			case 14:
				item.semenCompanyName = answer ?? ''
				break
		}
	}

	private static async getDeliveryHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<DeliveryHistoryItem[]> {
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

		const deliveryHistory: Record<string, DeliveryHistoryItem> = {}
		for (const value of Delivery) {
			const aqa = value.AnimalQuestionAnswers?.[0]
			if (!aqa) continue
			const createdAtKey = String(aqa.created_at)
			deliveryHistory[createdAtKey] = deliveryHistory[createdAtKey] || {}
			await this.updateDeliveryHistoryItem(
				deliveryHistory[createdAtKey],
				value.question_tag,
				aqa.answer,
				user_id,
				animal_id,
				animal_number,
			)
		}

		return Object.values(deliveryHistory)
	}

	private static async updateDeliveryHistoryItem(
		item: DeliveryHistoryItem,
		questionTag: number,
		answer: string | undefined,
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<void> {
		switch (questionTag) {
			case 65:
				item.dateOfDelvery = answer ?? ''
				item.calfNumber = await this.getCalfNumber(
					user_id,
					animal_id,
					animal_number,
					answer,
				)
				break
			case 66:
				item.typeOfDelivery = answer ?? ''
				break
		}
	}

	private static async getCalfNumber(
		user_id: number,
		animal_id: number,
		animal_number: string,
		deliveryDate: string | undefined,
	): Promise<string | null> {
		if (!deliveryDate) return null
		const calf = await db.AnimalMotherCalf.findOne({
			where: {
				user_id,
				animal_id,
				mother_animal_number: animal_number,
				delivery_date: deliveryDate,
			},
		})
		return calf ? calf.calf_animal_number : null
	}

	private static async getHeatHistory(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ heatDate: string }[]> {
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

		return heatEvents
			.map((value) => value.AnimalQuestionAnswers?.[0])
			.filter((aqa) => aqa)
			.map((aqa) => ({ heatDate: aqa!.answer ?? '' }))
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
		const dates = this.generateDateRange(start_date, end_date)
		const [incomeMap, expenseMap, breedingMap] = await this.fetchProfitLossData(
			user_id,
			start_date,
			end_date,
		)

		return this.buildProfitLossResults(
			dates,
			incomeMap,
			expenseMap,
			breedingMap,
		)
	}

	private static async fetchProfitLossData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<[Map<string, number>, Map<string, number>, Map<string, number>]> {
		const [incomeAnswers, expenseAnswers, breedingAnswers] = await Promise.all([
			this.fetchIncomeAnswers(user_id, start_date, end_date),
			this.fetchExpenseAnswers(user_id, start_date, end_date),
			this.fetchBreedingAnswers(user_id, start_date, end_date),
		])

		const incomeMap = this.processIncomeMap(incomeAnswers)
		const expenseMap = this.processExpenseMap(expenseAnswers)
		const breedingMap = this.processBreedingMap(breedingAnswers)

		return [incomeMap, expenseMap, breedingMap]
	}

	private static async fetchIncomeAnswers(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
		})
	}

	private static async fetchExpenseAnswers(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
		})
	}

	private static async fetchBreedingAnswers(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.CommonQuestions>[]> {
		return await db.CommonQuestions.findAll({
			where: { question_tag: 36 },
			include: [
				{
					model: db.AnimalQuestionAnswer,
					as: 'AnimalQuestionAnswers',
					where: {
						user_id,
						created_at: {
							[Op.between]: [`${start_date} 00:00:00`, `${end_date} 23:59:59`],
						},
					},
				},
			],
		})
	}

	private static processIncomeMap(
		incomeAnswers: InstanceType<typeof db.DailyRecordQuestionAnswer>[],
	): Map<string, number> {
		const incomeMap = new Map<string, number>()
		for (const answer of incomeAnswers) {
			const dateKey = this.formatAnswerDate(answer.answer_date)
			const amount = parseFloat(answer.answer || '0')
			incomeMap.set(dateKey, (incomeMap.get(dateKey) || 0) + amount)
		}
		return incomeMap
	}

	private static processExpenseMap(
		expenseAnswers: InstanceType<typeof db.DailyRecordQuestionAnswer>[],
	): Map<string, number> {
		const expenseMap = new Map<string, number>()
		for (const answer of expenseAnswers) {
			const dateKey = this.formatAnswerDate(answer.answer_date)
			const amount = parseFloat(answer.answer || '0')
			expenseMap.set(dateKey, (expenseMap.get(dateKey) || 0) + amount)
		}
		return expenseMap
	}

	private static processBreedingMap(
		breedingAnswers: InstanceType<typeof db.CommonQuestions>[],
	): Map<string, number> {
		const breedingMap = new Map<string, number>()
		for (const question of breedingAnswers) {
			const animalAnswers = (
				question as {
					AnimalQuestionAnswers?: {
						created_at: string | Date
						answer?: string
					}[]
				}
			).AnimalQuestionAnswers
			if (animalAnswers) {
				for (const answer of animalAnswers) {
					const dateKey = this.formatAnswerDate(answer.created_at)
					const amount = parseFloat(answer.answer || '0')
					breedingMap.set(dateKey, (breedingMap.get(dateKey) || 0) + amount)
				}
			}
		}
		return breedingMap
	}

	private static formatAnswerDate(date: Date | string): string {
		return date instanceof Date
			? date.toISOString().split('T')[0]
			: String(date).split('T')[0]
	}

	private static buildProfitLossResults(
		dates: string[],
		incomeMap: Map<string, number>,
		expenseMap: Map<string, number>,
		breedingMap: Map<string, number>,
	): ProfitLossRowWithBreedingExpense[] {
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
		const data = await this.fetchProfitLossReportData(
			user_id,
			start_date,
			end_date,
		)
		const calculations = this.calculateProfitLossTotals(data)
		return this.buildProfitLossReportResult(calculations)
	}

	private static async fetchProfitLossReportData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{
		incomeWithSellingPrice: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		income: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		breedingExpense: InstanceType<typeof db.AnimalQuestionAnswer>[]
		expenseWithPurchasePrice: InstanceType<
			typeof db.DailyRecordQuestionAnswer
		>[]
		expense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
	}> {
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

		return {
			incomeWithSellingPrice,
			income,
			breedingExpense,
			expenseWithPurchasePrice,
			expense,
		}
	}

	private static async fetchIncomeWithSellingPrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
		})
	}

	private static async fetchIncome(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
		})
	}

	private static async fetchBreedingExpense(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.AnimalQuestionAnswer>[]> {
		return await db.AnimalQuestionAnswer.findAll({
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
		})
	}

	private static async fetchExpenseWithPurchasePrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
		})
	}

	private static async fetchExpense(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
		})
	}

	private static calculateProfitLossTotals(data: {
		incomeWithSellingPrice: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		income: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		breedingExpense: InstanceType<typeof db.AnimalQuestionAnswer>[]
		expenseWithPurchasePrice: InstanceType<
			typeof db.DailyRecordQuestionAnswer
		>[]
		expense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
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
		const totalIncomeWithoutSellingPrice = this.calculateTotalFromArray(
			data.income as { answer: string }[],
		)
		const totalIncome = this.calculateTotalFromArray(
			data.incomeWithSellingPrice as { answer: string }[],
		)
		const breedingTotal = this.calculateBreedingTotal(
			data.breedingExpense as { answer: string }[],
		)
		const totalExpenseWithoutPurchasePrice = this.calculateTotalFromArray(
			data.expense as { answer: string }[],
		)
		const totalExpense = this.calculateTotalFromArray(
			data.expenseWithPurchasePrice as { answer: string }[],
		)

		const total = totalIncome - (totalExpense + breedingTotal)
		const totalWithoutSellingAndPurchasePrice =
			totalIncomeWithoutSellingPrice -
			(totalExpenseWithoutPurchasePrice + breedingTotal)

		const profitWithoutSellingAndPurchasePrice =
			totalWithoutSellingAndPurchasePrice > 0
				? totalWithoutSellingAndPurchasePrice
				: 0
		const lossWithoutSellingAndPurchasePrice =
			totalWithoutSellingAndPurchasePrice < 0
				? Math.abs(totalWithoutSellingAndPurchasePrice)
				: 0

		const profit = total > 0 ? total : 0
		const loss = total < 0 ? Math.abs(total) : 0

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

	private static calculateBreedingTotal(data: { answer: string }[]): number {
		let total = 0
		for (const value of data) {
			const val = parseFloat(value.answer)
			if (!isNaN(val)) total += val
		}
		return total
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

	public static async summaryReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<SummaryReportResult> {
		const data = await this.fetchSummaryReportData(
			user_id,
			start_date,
			end_date,
		)
		const totals = this.calculateSummaryTotals(data)
		return this.buildSummaryReportResult(totals)
	}

	private static async fetchSummaryReportData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{
		expense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		income: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		greenFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		cattleFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		dryFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		supplement: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		breedingExpense: InstanceType<typeof db.AnimalQuestionAnswer>[]
	}> {
		const [
			expense,
			income,
			greenFeed,
			cattleFeed,
			dryFeed,
			supplement,
			breedingExpense,
		] = await Promise.all([
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 1),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 2),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 30),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 31),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 32),
			this.fetchSummaryDataByTag(user_id, start_date, end_date, 33),
			this.fetchBreedingExpense(user_id, start_date, end_date),
		])

		return {
			expense,
			income,
			greenFeed,
			cattleFeed,
			dryFeed,
			supplement,
			breedingExpense,
		}
	}

	private static async fetchSummaryDataByTag(
		user_id: number,
		start_date: string,
		end_date: string,
		question_tag_id: number,
	): Promise<InstanceType<typeof db.DailyRecordQuestionAnswer>[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
							where: { question_tag_id },
						},
					],
				},
			],
			raw: true,
		})
	}

	private static calculateSummaryTotals(data: {
		expense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		income: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		greenFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		cattleFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		dryFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		supplement: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		breedingExpense: InstanceType<typeof db.AnimalQuestionAnswer>[]
	}): {
		totalExpense: number
		totalIncome: number
		profit: number
		totalGreenFeed: number
		totalCattleFeed: number
		totalDryFeed: number
		otherExpense: number
		totalSupplement: number
		totalBreedingExpense: number
	} {
		const totalExpense = this.calculateTotalFromArray(data.expense)
		const totalIncome = this.calculateTotalFromArray(data.income)
		const profit = totalIncome - totalExpense
		const totalGreenFeed = this.calculateTotalFromArray(data.greenFeed)
		const totalCattleFeed = this.calculateTotalFromArray(data.cattleFeed)
		const totalDryFeed = this.calculateTotalFromArray(data.dryFeed)
		const totalSupplement = this.calculateTotalFromArray(data.supplement)
		const totalBreedingExpense = this.calculateBreedingTotal(
			data.breedingExpense,
		)
		const otherExpense =
			totalExpense -
			(totalGreenFeed +
				totalCattleFeed +
				totalDryFeed +
				totalSupplement +
				totalBreedingExpense)

		return {
			totalExpense,
			totalIncome,
			profit,
			totalGreenFeed,
			totalCattleFeed,
			totalDryFeed,
			otherExpense,
			totalSupplement,
			totalBreedingExpense,
		}
	}

	private static buildSummaryReportResult(totals: {
		totalExpense: number
		totalIncome: number
		profit: number
		totalGreenFeed: number
		totalCattleFeed: number
		totalDryFeed: number
		otherExpense: number
		totalSupplement: number
		totalBreedingExpense: number
	}): SummaryReportResult {
		return {
			Expense: totals.totalExpense.toFixed(2),
			Income: totals.totalIncome.toFixed(2),
			Profit: totals.profit.toFixed(2),
			GreenFeed: totals.totalGreenFeed.toFixed(2),
			CattleFeed: totals.totalCattleFeed.toFixed(2),
			DryFeed: totals.totalDryFeed.toFixed(2),
			OtherExpense: totals.otherExpense.toFixed(2),
			supplement: totals.totalSupplement.toFixed(2),
			breediingExpense: totals.totalBreedingExpense.toFixed(2),
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
		const data = await this.fetchTotalExpenseData(user_id, start_date, end_date)
		const totals = this.calculateTotalExpenseTotals(data)
		return this.buildTotalExpenseResult(totals, data.daysCount)
	}

	private static async fetchTotalExpenseData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<{
		expense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		greenFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		cattleFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		dryFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		supplement: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		purchasePrice: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		medicalExpense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		breedingExpense: InstanceType<typeof db.AnimalQuestionAnswer>[]
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
			this.fetchBreedingExpense(user_id, start_date, end_date),
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

	private static async fetchDaysCount(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<number> {
		return await db.DailyRecordQuestionAnswer.count({
			where: {
				user_id,
				answer_date: { [Op.between]: [start_date, end_date] },
			},
			distinct: true,
			col: 'answer_date',
		})
	}

	private static calculateTotalExpenseTotals(data: {
		expense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		greenFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		cattleFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		dryFeed: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		supplement: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		purchasePrice: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		medicalExpense: InstanceType<typeof db.DailyRecordQuestionAnswer>[]
		breedingExpense: InstanceType<typeof db.AnimalQuestionAnswer>[]
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

	private static calculateTotalWithQuantity(
		data: InstanceType<typeof db.DailyRecordQuestionAnswer>[],
	): {
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

	private static calculateMedicalExpense(
		data: InstanceType<typeof db.DailyRecordQuestionAnswer>[],
	): number {
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

	public static async healthReportDetails(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<HealthReportDetailsResult> {
		const [userAnimals, dailyRecordQuestions, dates] =
			await this.fetchHealthReportData(user_id, start_date, end_date)
		const totalcostOfTreatment =
			this.calculateTreatmentCostFromRecords(dailyRecordQuestions)
		const resData = await this.processHealthReportDetails(
			user_id,
			userAnimals,
			dates,
		)
		const animals = this.extractUniqueAnimals(resData)

		return {
			animal_count: animals.length,
			total_cost_of_treatment: totalcostOfTreatment,
			data: resData,
		}
	}

	private static async fetchHealthReportData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<[{ animal_number: string }[], { answer: string }[], string[]]> {
		const [userAnimals, dailyRecordQuestions, dates] = await Promise.all([
			this.fetchUserAnimals(user_id),
			this.fetchDailyRecordQuestionsByDateRange(user_id, start_date, end_date),
			this.generateDateRange(start_date, end_date),
		])

		return [userAnimals, dailyRecordQuestions, dates]
	}

	private static async fetchUserAnimals(
		user_id: number,
	): Promise<{ animal_number: string }[]> {
		return (await db.AnimalQuestionAnswer.findAll({
			where: { user_id },
			attributes: [
				[db.Sequelize.literal('DISTINCT animal_number'), 'animal_number'],
			],
			raw: true,
		})) as { animal_number: string }[]
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
	}

	private static calculateTreatmentCostFromRecords(
		dailyRecordQuestions: { answer: string }[],
	): number {
		let totalcostOfTreatment = 0
		for (const value of dailyRecordQuestions) {
			const arr = JSON.parse(value.answer) as { price: number }[]
			totalcostOfTreatment += arr[0]?.price ?? 0
		}
		return totalcostOfTreatment
	}

	private static async processHealthReportDetails(
		user_id: number,
		userAnimals: { animal_number: string }[],
		dates: string[],
	): Promise<HealthReportDetailsEntry[]> {
		const resData: HealthReportDetailsEntry[] = []

		for (const animal of userAnimals) {
			for (const date of dates) {
				const healthData = await this.getHealthDataForAnimalDate(
					user_id,
					animal.animal_number,
					date,
				)
				if (healthData?.date) {
					resData.push(healthData)
				}
			}
		}

		return resData
	}

	private static async getHealthDataForAnimalDate(
		user_id: number,
		animal_number: string,
		date: string,
	): Promise<HealthReportDetailsEntry | null> {
		const [answer1, answer2, answer3, answer4] = await Promise.all([
			this.getAnimalAnswerByTag(user_id, animal_number, date, 38),
			this.getAnimalAnswerByTag(user_id, animal_number, date, 39),
			this.getAnimalAnswerByTag(user_id, animal_number, date, 40),
			this.getAnimalAnswerByTag(user_id, animal_number, date, 41),
		])

		return {
			date: answer1,
			diseasName: answer2,
			details_of_treatment: answer3,
			milk_loss_in_litres: answer4,
			animal_number,
		}
	}

	private static async getAnimalAnswerByTag(
		user_id: number,
		animal_number: string,
		date: string,
		question_tag: number,
	): Promise<string | null> {
		const result = (await db.AnimalQuestionAnswer.findAll({
			where: {
				animal_number,
				user_id,
				created_at: {
					[Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
				},
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'CommonQuestion',
					where: { question_tag },
				},
			],
			raw: true,
		})) as { answer: string }[]

		return result.length > 0 ? result[0].answer : null
	}

	private static extractUniqueAnimals(
		resData: HealthReportDetailsEntry[],
	): string[] {
		const animals: string[] = []
		for (const entry of resData) {
			if (entry.date && !animals.includes(entry.animal_number)) {
				animals.push(entry.animal_number)
			}
		}
		return animals
	}

	public static async latestProfitLossReport(
		user_id: number,
	): Promise<LatestProfitLossReportResult> {
		const latestDate = await this.getLatestDate(user_id)
		const date1 = latestDate.split('T')[0]
		const [
			totalIncomeWithoutSellingPrice,
			breedingTotal,
			totalExpenseWithoutPurchasePrice,
		] = await this.fetchLatestProfitLossData(user_id, date1)
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
		const [date2, date] = await Promise.all([
			this.fetchLatestAnimalQuestionDate(user_id),
			this.fetchLatestDailyRecordDate(user_id),
		])

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

	private static async fetchLatestAnimalQuestionDate(
		user_id: number,
	): Promise<{ created_at?: string } | null> {
		return (await db.AnimalQuestionAnswer.findOne({
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
	}

	private static async fetchLatestDailyRecordDate(
		user_id: number,
	): Promise<{ answer_date?: string } | null> {
		return (await db.DailyRecordQuestionAnswer.findOne({
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
	}

	private static async fetchLatestProfitLossData(
		user_id: number,
		date1: string,
	): Promise<[number, number, number]> {
		const [income, breedingExpense, expense] = await Promise.all([
			this.fetchIncomeData(user_id, date1),
			this.fetchBreedingExpenseDataByDate(user_id, date1),
			this.fetchExpenseData(user_id, date1),
		])

		const totalIncomeWithoutSellingPrice = this.calculateTotalFromArray(income)
		const breedingTotal = this.calculateBreedingTotal(breedingExpense)
		const totalExpenseWithoutPurchasePrice =
			this.calculateTotalFromArray(expense)

		return [
			totalIncomeWithoutSellingPrice,
			breedingTotal,
			totalExpenseWithoutPurchasePrice,
		]
	}

	private static async fetchIncomeData(
		user_id: number,
		date1: string,
	): Promise<{ answer: string }[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
	}

	private static async fetchBreedingExpenseDataByDate(
		user_id: number,
		date1: string,
	): Promise<{ answer: string }[]> {
		return await db.AnimalQuestionAnswer.findAll({
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
	}

	private static async fetchExpenseData(
		user_id: number,
		date1: string,
	): Promise<{ answer: string }[]> {
		return await db.DailyRecordQuestionAnswer.findAll({
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
	}

	private static determineProfitLossKey(
		totalWithoutSellingAndPurchasePrice: number,
	): 'profit' | 'loss' | null {
		if (totalWithoutSellingAndPurchasePrice > 0) {
			return 'profit'
		} else if (totalWithoutSellingAndPurchasePrice < 0) {
			return 'loss'
		}
		return null
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
