import { Op, QueryTypes, Sequelize } from 'sequelize'
import db from '../config/database'
import ejs from 'ejs'
import puppeteer from 'puppeteer'
// import path from 'path'
import path from 'node:path'
import { addToEmailQueue } from '../queues/email.queue'
// import fs from 'fs/promises'
import fs from 'node:fs/promises'
import { AppError, NotFoundError } from '@/utils/errors'
import moment from 'moment'
import { addMonths, format } from 'date-fns'

type MilkValue = string | number | null

type FeedItem = {
	amount: string | number
	price: string | number
}

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
	milk_production_quantity_morning_in_ruppe: number
	milk_production_quantity_evening_in_lit: number
	milk_production_quantity_evening_in_ruppe: number
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

export interface AnimalBreedingHistoryResult {
	animal_number: string
	aiHistory: AIHistoryItem[]
	deliveryHistory: DeliveryHistoryItem[]
	heatHistory: { heatDate: string }[]
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

export interface MilkProductionRow {
	date: string
	totalMorningFat: string
	totalMorningSNF: string
	totaleveningFat: string
	totaleveningSNF: string
}

interface ProfitLossData {
	answer_date: string
	answer: string
}

interface AnswerItem {
	price: number
	amount?: number
}
interface MilkAnswerItem {
	amount?: string
	price: number
}

interface RawRecord {
	answer_date: string
	daily_record_question_id: number
	answer: string
	question_tag_id: number
}

interface AggregatedTotal {
	animal_id: number
	morning_milk: string | number
	evening_milk: string | number
	total: string | number
}

interface DayWiseTotal {
	record_date: string
	animal_id: number
	morning_milk: string | number
	evening_milk: string | number
	total: string | number
}
interface DayWiseSubTotalItem {
	cow_morning_milk?: number
	cow_evening_milk?: number
	cow_total?: number
	buffalo_morning_milk?: number
	buffalo_evening_milk?: number
	buffalo_total?: number
}
interface InvestmentData {
	investment_type: string
	amount_in_rs: number
	date_of_installation_or_purchase: string
}

interface ProcessedInvestmentData {
	type_of_investment: string
	amount_in_rs: string
	date_of_installation_or_purchase: string
	age_in_year: string
}

interface InvestmentReportData {
	reportData: ProcessedInvestmentData[]
	total_investment: string
	number_of_investments: number
}

interface InvestmentReport {
	success: boolean
	message?: string
	data: InvestmentReportData | []
}

interface PregnantAnimal {
	animal_num: string
	date_of_pregnancy_detection: string
	bull_no: string
	expected_month_of_delivery: string | null
	status_milking_dry: string
	date_of_AI: string
}

interface NonPregnantAnimal {
	animal_num: string
	date_of_last_AI: string
	bull_no: string
	date_of_pregnancy_detection: string
	date_of_last_delivery: string
	status_milking_dry: string
}

interface BreedingReportResult {
	pregnant: Record<string, PregnantAnimal[]>
	non_pregnant: Record<string, NonPregnantAnimal[]>
}

interface LactationHistory {
	lactating_status: string
	date: string | Date
	created_at: string | Date
}

interface ProfileData {
	profile_img: { image: string }
	general: Record<string, unknown>
	breeding_details: Record<string, unknown>
	milk_details: Record<string, unknown>
	vaccination_details: { type: string; date: string }[]
	pedigree: Record<string, unknown>
}

interface IncomeExpenseRecord {
	answer_date: string
	daily_record_question_id: number
	answer: string
}

interface BreedingRecord {
	created_at: string
	answer: string
}

interface MilkRecord {
	daily_record_question_id: number
	answer: string
	answer_date: Date | string
}
interface QuestionAnswerRecord {
	answer: string
	answer_date: Date | string
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

	milk_production_quality: {
		fetchData: (...args) =>
			ReportService.milkProductionQualityPDF(
				...(args as [number, string, string]),
			),
		viewName: 'milkProductionQualityPDF',
		emailTemplate: 'milkProductionQualityReport',
		emailSubject: 'Milk Production Quality Report',
		emailDataKey: 'milkProductionQualityData',
	},

	milk_production_quantity: {
		fetchData: (...args) =>
			ReportService.animalMilkProductionQuantityPDF(
				...(args as [number, string, string]),
			),
		viewName: 'milkProductionQuantityPDF',
		emailTemplate: 'animalMilkProductionQuantityReport',
		emailSubject: 'Milk Production Quantity Report',
		emailDataKey: 'milkProductionData',
	},

	profit_loss_with_purchase_selling_price: {
		fetchData: (...args) =>
			ReportService.profitLossGraphWithSellingAndPurcahsePricePDFData(
				...(args as [number, string, string]),
			),
		viewName: 'profitLossWithSellingAndPurchasePricePDF',
		emailTemplate: 'profitLossGraphWithSellingAndPurcahsePriceReport',
		emailSubject: 'Profit Loss With Purchase Selling Price Report',
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
		emailDataKey: 'incomeExpense',
	},
	milk_output_report: {
		fetchData: (...args) =>
			ReportService.milkReportPDFData(
				...(args as [number, string, string, string?]),
			),
		viewName: 'dailyMilkReportPDF',
		emailTemplate: 'milkReport',
		emailSubject: 'Milk Output Report',
		emailDataKey: 'milkReportPDF',
	},
	fixed_investment_report: {
		fetchData: (...args) =>
			ReportService.fixedInvestmentReportPDFData(...(args as [number])),
		viewName: 'fixedInvestmentReportPDF',
		emailTemplate: 'fixedInvestmentReport',
		emailSubject: 'Fixed Investment Report',
		emailDataKey: 'fixedInvestmentData',
	},
	breeding_report: {
		fetchData: (...args) =>
			ReportService.breedingReportPDFData(...(args as [number])),
		viewName: 'breedingReportPDF',
		emailTemplate: 'breedingReport',
		emailSubject: 'Breeding Report',
		emailDataKey: 'responseData',
	},
	animal_profile_certificate: {
		fetchData: (...args) =>
			ReportService.getProfileData(
				...(args as [number, string, string, number, string]),
			),
		viewName: 'animalProfileCertificate',
		emailTemplate: 'profileReport',
		emailSubject: 'Animal Profile Certificate',
		emailDataKey: 'profileData',
	},
	animal_breeding_history_report: {
		fetchData: (...args) =>
			ReportService.animalBreedingHistoryData(
				...(args as [number, string, string, number, string]),
			),
		viewName: 'animalBreedingHistoryPDF',
		emailTemplate: 'animalBreedingHistoryReport',
		emailSubject: 'Animal Breeding History Report',
		emailDataKey: 'reportData',
	},
	all_animal_breeding_history: {
		fetchData: (...args) =>
			ReportService.allAnimalBreedingHistoryData(
				...(args as [number, string, string, number, string]),
			),
		viewName: 'allAnimalBreedingHistoryPDF',
		emailTemplate: 'allAnimalBreedingHistoryReport',
		emailSubject: 'All Animal Breeding History Report',
		emailDataKey: 'reportData',
	},
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
		const user = await db.User.findOne({
			where: { id: user_id, deleted_at: null },
		})
		if (!user) throw new NotFoundError('User not found')

		const config = REPORT_CONFIGS[data.report_type]
		if (!config) throw new AppError('Invalid report', 400)

		// Fetch report-specific data
		const pdfData = await config.fetchData(
			user_id,
			data?.start_date,
			data?.end_date,
			data?.animal_id,
			data?.animal_number,
		)

		// Render EJS template
		const templatePath = path.resolve(
			__dirname,
			`../views/reports/${config.viewName}.ejs`,
		)
		const html = await ejs.renderFile(templatePath, {
			[config.emailDataKey]: pdfData,
			user: user.name,
			report_type: config.emailSubject,
		})

		const browser = await puppeteer.launch({
			headless: true, // Runs without GUI (perfect for servers)
			args: ['--no-sandbox', '--disable-setuid-sandbox'], // Security flags for server environments
		})

		try {
			const page = await browser.newPage()
			await page.setContent(html, { waitUntil: 'networkidle0' })

			const pdfBuffer = await page.pdf({
				format: 'A4',
				printBackground: true,
				margin: {
					top: '20mm',
					right: '10mm',
					bottom: '20mm',
					left: '10mm',
				},
			})

			// Save file
			const reportDir = path.resolve(__dirname, '../../storage/reports')
			await fs.mkdir(reportDir, { recursive: true })
			const filename = `${config.emailSubject.replaceAll(' ', '_')}-${user_id}-${Date.now()}.pdf`
			const filePath = path.join(reportDir, filename)
			await fs.writeFile(filePath, pdfBuffer)

			// Queue Email
			addToEmailQueue({
				to: data.email,
				subject: config.emailSubject,
				template:
					'report' as keyof import('../utils/emailTemplates').EmailTemplateMap,
				data: { user: user.get('name'), report_type: config.emailSubject },
				attachments: [
					{ filename: `${config.emailSubject}.pdf`, path: filePath },
				],
			})
		} finally {
			await browser.close()
		}
	}

	private static generateDates(startDate: Date, endDate: Date): string[] {
		const dates: string[] = []
		const currentDate = new Date(startDate)

		while (currentDate <= endDate) {
			dates.push(currentDate.toISOString().split('T')[0])
			currentDate.setDate(currentDate.getDate() + 1)
		}

		// Add end date if not already included
		const endDateStr = endDate.toISOString().split('T')[0]
		if (!dates.includes(endDateStr)) {
			dates.push(endDateStr)
		}

		return dates
	}
	//Health Report
	private static async getUserAnimals(
		user_id: number,
	): Promise<AnimalNumber[]> {
		const results = await db.AnimalQuestionAnswer.findAll({
			where: { user_id, status: { [Op.ne]: 1 }, deleted_at: null },
			attributes: [
				[
					Sequelize.fn('DISTINCT', Sequelize.col('animal_number')),
					'animal_number',
				],
			],
		})

		return results.map((result) => ({
			animal_id: 0,
			animal_number: result.get('animal_number'),
		}))
	}

	//Health Report
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
	private static async calculateTreatmentCost(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<number> {
		const query = `
        SELECT 
            dqa.daily_record_question_id,
            drq.question,
            dqa.answer,
            dqa.answer_date
        FROM daily_record_questions AS drq
        JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
        JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
        WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
        AND dqa.user_id = ?
        AND qtm.question_tag_id = 37
		AND drq.delete_status = 0
        ORDER BY dqa.answer_date DESC
    `

		const dailyRecordQuestions = (await db.sequelize.query(query, {
			replacements: [start_date, end_date, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as {
			daily_record_question_id: number
			question: string
			answer: string
			answer_date: string
		}[]

		return dailyRecordQuestions.reduce((total, value) => {
			const answer = JSON.parse(value.answer) as {
				price: number
				amount?: number
			}[]
			return total + answer[0].price
		}, 0)
	}
	private static async processHealthData(
		user_id: number,
		userAnimals: AnimalNumber[],
		dates: string[],
	): Promise<HealthReportRow[]> {
		const animalNumbers = userAnimals.map((animal) => animal.animal_number)

		const query = `
        SELECT 
            cq.question_tag,
            cq.question,
            aqa.answer,
            aqa.created_at,
            aqa.animal_number
        FROM common_questions AS cq
        JOIN animal_question_answers AS aqa ON aqa.question_id = cq.id AND aqa.deleted_at IS NULL
        WHERE aqa.animal_number IN (${animalNumbers.map(() => '?').join(',')})
        AND cq.question_tag IN (38, 39, 40, 41)
        AND DATE(aqa.created_at) IN (${dates.map(() => '?').join(',')})
        AND aqa.user_id = ?
        AND aqa.status <> 1
		AND aqa.deleted_at IS NULL
		AND cq.deleted_at IS NULL
        ORDER BY aqa.animal_number, aqa.created_at, cq.question_tag
    `

		const results = (await db.sequelize.query(query, {
			replacements: [...animalNumbers, ...dates, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as {
			question_tag: number
			question: string
			answer: string
			created_at: Date | string
			animal_number: string
		}[]

		const groupedData: {
			[key: string]: {
				animal_number: string
				date: string
				answers: { [questionTag: number]: string }
			}
		} = {}

		// results.forEach((row) => {
		for (const row of results) {
			const dateKey =
				typeof row.created_at === 'string'
					? row.created_at.split(' ')[0]
					: row.created_at.toISOString().split('T')[0]
			const key = `${row.animal_number}_${dateKey}`

			if (!groupedData[key]) {
				groupedData[key] = {
					animal_number: row.animal_number,
					date: dateKey,
					answers: {},
				}
			}

			groupedData[key].answers[row.question_tag] = row.answer
			// })
		}

		const resData: HealthReportRow[] = []

		// Object.values(groupedData).forEach(
		// 	(group: {
		// 		animal_number: string
		// 		date: string
		// 		answers: { [questionTag: number]: string }
		// 	}) => {
		for (const group of Object.values(groupedData)) {
			let answer1 = group.answers[38] || ''
			const answer2 = group.answers[39] || ''
			const answer3 = group.answers[40] || ''
			const answer4 = group.answers[41] || ''

			if (answer1) {
				const dateObj = new Date(answer1)
				const day = dateObj.getDate()

				let suffix: string
				if (day % 10 === 1 && day !== 11) {
					suffix = 'st'
				} else if (day % 10 === 2 && day !== 12) {
					suffix = 'nd'
				} else if (day % 10 === 3 && day !== 13) {
					suffix = 'rd'
				} else {
					suffix = 'th'
				}
				const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
				const year = dateObj.getFullYear()
				answer1 = `${day}${suffix} ${month} ${year}`
			}

			let font = 'Pothana2000'

			if (answer2) {
				const end =
					'A B C D E F G H I J K L M N O P Q R E S U V W X Y Z a b c d e f g h i j k l m n o p q u r s t u v q x y z'
				const hin =
					'अ आ इ ई उ ऊ ए ऐ ओ औ अं अः क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह क़ ग़ ख़ ज़ ड़ ऋ ढ़ फ़'
				const telu =
					'మాస్టాటిట్స్ తైలేరియా బాబేసిల్ తివా (3 రోజుల సిక్నెస్) పాలు జ్వరం (కాల్షియం కోల్పోవడం) డిస్టాకిల్ ప్రత్యుత్పత్తి లేకుండుట గర్భస్రావం న్యుమోనియా జ్వరము, దగ్గు విరేచనాలు ఎరుపు మూత్రం ఇతర'

				const words = answer2.split(' ')
				const firstWord = words[0]

				if (end.includes(answer2[0])) {
					font = 'DejaVuSans'
				} else if (hin.includes(answer2[0])) {
					font = 'mangal'
				} else if (telu.includes(firstWord)) {
					// font already 'Pothana2000', no need to reassign
				}
			}

			const abc = {
				date: answer1,
				diseasName: answer2,
				details_of_treatment: answer3,
				milk_loss_in_litres: answer4,
				animal_number: group.animal_number,
				font: font,
			}

			if (abc.date) {
				resData.push(abc)
			}
		}
		// },
		// )

		return resData
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

	//Manure Production
	public static async manureProductionReportPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ManureProductionRow[]> {
		const data = (await db.sequelize.query(
			`
            SELECT 
            dqa.answer_date,
            JSON_EXTRACT(dqa.answer, '$[*].amount') as amounts,
            JSON_EXTRACT(dqa.answer, '$[*].price') as prices,
            JSON_LENGTH(dqa.answer) as answer_count
            FROM daily_record_questions AS drq
            JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
            JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
            JOIN question_tags AS qt ON qt.id = qtm.question_tag_id AND qt.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
            AND dqa.user_id = :user_id
            AND qtm.question_tag_id = 29
			AND drq.delete_status = 0
            ORDER BY dqa.answer_date DESC
            `,
			{
				replacements: {
					start_date: start_date,
					end_date: end_date,
					user_id: user_id,
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			answer_date: Date
			amounts: string
			prices: string
			answer_count: number
		}[]

		const result = data.flatMap((item) => {
			const amounts = JSON.parse(item.amounts) as number[]
			const prices = JSON.parse(item.prices) as number[]

			const formattedDate = new Date(item.answer_date)
				.toLocaleDateString('en-US', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				})
				.replaceAll(/(\d+)/, (match) => {
					const day = Number.parseInt(match)

					let suffix: string
					if (day === 1 || day === 21 || day === 31) {
						suffix = 'st'
					} else if (day === 2 || day === 22) {
						suffix = 'nd'
					} else if (day === 3 || day === 23) {
						suffix = 'rd'
					} else {
						suffix = 'th'
					}

					return day + suffix
				})

			return amounts.map((amount, index) => ({
				total_manure_production_in_KG: amount,
				rate_per_kg: prices[index],
				total_in_rupees: prices[index] * amount,
				answer_date: formattedDate,
			}))
		})

		return result
	}

	// Milk Production Quality
	public static async milkProductionQualityPDF(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkProductionRow[]> {
		const startDate = new Date(start_date)
		const endDate = new Date(end_date)
		const daysDiff =
			Math.ceil(
				(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
			) + 1

		const dateArray = Array.from({ length: daysDiff }, (_, i) => {
			const date = new Date(startDate)
			date.setDate(startDate.getDate() + i)
			return date.toISOString().split('T')[0]
		})

		const data = (await db.sequelize.query(
			`
            SELECT 
            DATE(dqa.answer_date) as answer_date,
            qtm.question_tag_id,
            SUM(
                CASE 
                    WHEN JSON_VALID(dqa.answer) AND JSON_LENGTH(dqa.answer) > 0 
                    THEN COALESCE(CAST(JSON_EXTRACT(dqa.answer, '$[0].price') AS DECIMAL(10,2)), 0)
                    ELSE 0 
                END
            ) as total_amount
            FROM daily_record_questions AS drq
            JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
            JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
            AND dqa.user_id = :user_id
            AND qtm.question_tag_id IN (17, 18, 19, 20)
			AND drq.delete_status = 0
            GROUP BY DATE(dqa.answer_date), qtm.question_tag_id
            ORDER BY DATE(dqa.answer_date) DESC
        `,
			{
				replacements: {
					start_date: start_date,
					end_date: end_date,
					user_id: user_id,
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			answer_date: string
			question_tag_id: number
			total_amount: number
		}[]

		// Create lookup map for O(1) access instead of nested loops
		const dataMap = new Map<string, Record<number, number>>()

		// data.forEach((row) => {
		for (const row of data) {
			if (!dataMap.has(row.answer_date)) {
				dataMap.set(row.answer_date, {})
			}
			dataMap.get(row.answer_date)![row.question_tag_id] = row.total_amount
			// })
		}

		// Process all dates with single map operation
		const result = dateArray
			.map((date) => {
				const dayData = dataMap.get(date) || {}

				const totalMorningFat = Number((dayData[17] || 0).toFixed(2))
				const totalMorningSNF = Number((dayData[18] || 0).toFixed(2))
				const totalEveningFat = Number((dayData[19] || 0).toFixed(2))
				const totalEveningSNF = Number((dayData[20] || 0).toFixed(2))

				// Format date to match PHP Carbon format (1st Jan 2024)
				const formattedDate = new Date(date)
					.toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})
					.replaceAll(/(\d+)/, (match) => {
						const day = Number.parseInt(match)

						let suffix: string

						if (day === 1 || day === 21 || day === 31) {
							suffix = 'st'
						} else if (day === 2 || day === 22) {
							suffix = 'nd'
						} else if (day === 3 || day === 23) {
							suffix = 'rd'
						} else {
							suffix = 'th'
						}
						return day + suffix
					})

				return {
					date: formattedDate,
					totalMorningFat: totalMorningFat.toFixed(2),
					totalMorningSNF: totalMorningSNF.toFixed(2),
					totaleveningFat: totalEveningFat.toFixed(2),
					totaleveningSNF: totalEveningSNF.toFixed(2),
				}
			})
			.filter(
				(item) =>
					// Only include records with non-zero values (same as PHP logic)
					Number.parseFloat(item.totalMorningFat) !== 0 ||
					Number.parseFloat(item.totalMorningSNF) !== 0 ||
					Number.parseFloat(item.totaleveningFat) !== 0 ||
					Number.parseFloat(item.totaleveningSNF) !== 0,
			)

		return result
	}

	// Animal Milk Production Quantity
	public static async animalMilkProductionQuantityPDF(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkProductionQuantityRow[]> {
		const startDate = new Date(start_date)
		const endDate = new Date(end_date)
		const daysDiff =
			Math.ceil(
				(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
			) + 1

		const dateArray = Array.from({ length: daysDiff }, (_, i) => {
			const date = new Date(startDate)
			date.setDate(startDate.getDate() + i)
			return date.toISOString().split('T')[0] // YYYY-MM-DD format
		})

		// Single optimized query to get all data at once
		const data = (await db.sequelize.query(
			`
        SELECT 
            DATE(dqa.answer_date) as answer_date,
            qtm.question_tag_id,
            SUM(
                CASE 
                    WHEN JSON_VALID(dqa.answer) AND JSON_LENGTH(dqa.answer) > 0 
                    THEN COALESCE(CAST(JSON_EXTRACT(dqa.answer, '$[0].amount') AS DECIMAL(10,2)), 0)
                    ELSE 0 
                END
            ) as total_amount,
            SUM(
                CASE 
                    WHEN JSON_VALID(dqa.answer) AND JSON_LENGTH(dqa.answer) > 0 
                    THEN COALESCE(
                        CAST(JSON_EXTRACT(dqa.answer, '$[0].price') AS DECIMAL(10,2)) * 
                        CAST(JSON_EXTRACT(dqa.answer, '$[0].amount') AS DECIMAL(10,2)), 0
                    )
                    ELSE 0 
                END
            ) as total_value
        FROM daily_record_questions AS drq
        JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id
		    AND dqa.deleted_at IS NULL
        JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id
			AND qtm.deleted_at IS NULL
        WHERE DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
        AND dqa.user_id = :user_id
        AND qtm.question_tag_id IN (26, 27)
		AND drq.delete_status = 0
        GROUP BY DATE(dqa.answer_date), qtm.question_tag_id
        ORDER BY DATE(dqa.answer_date) DESC
        `,
			{
				replacements: {
					start_date: start_date,
					end_date: end_date,
					user_id: user_id,
				},
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			answer_date: string
			question_tag_id: number
			total_amount: number
			total_value: number
		}[]

		// Create lookup map for O(1) access instead of nested loops
		const dataMap = new Map<
			string,
			Record<number, { amount: number; value: number }>
		>()

		// data.forEach((row) => {
		for (const row of data) {
			if (!dataMap.has(row.answer_date)) {
				dataMap.set(row.answer_date, {})
			}
			dataMap.get(row.answer_date)![row.question_tag_id] = {
				amount: row.total_amount,
				value: row.total_value,
			}
			// })
		}

		// Process all dates with single map operation
		const result = dateArray
			.map((date) => {
				const dayData = dataMap.get(date) || {}

				// Morning data (tag_id 26)
				const morningData = dayData[26] || { amount: 0, value: 0 }
				const morningTotalAmt = morningData.amount
				const morningTotal = morningData.value

				// Evening data (tag_id 27)
				const eveningData = dayData[27] || { amount: 0, value: 0 }
				const eveningTotalAmt = eveningData.amount
				const eveningTotal = eveningData.value

				// Format date to match PHP Carbon format (1st Jan 2024)
				const formattedDate = new Date(date)
					.toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})
					.replaceAll(/(\d+)/, (match) => {
						const day = Number.parseInt(match)

						let suffix: string

						if (day === 1 || day === 21 || day === 31) {
							suffix = 'st'
						} else if (day === 2 || day === 22) {
							suffix = 'nd'
						} else if (day === 3 || day === 23) {
							suffix = 'rd'
						} else {
							suffix = 'th'
						}
						return day + suffix
					})

				return {
					date: formattedDate,
					milk_production_quantity_morning_in_lit: morningTotalAmt,
					milk_production_quantity_morning_in_ruppe: Number(
						morningTotal.toFixed(2),
					),
					milk_production_quantity_evening_in_lit: eveningTotalAmt,
					milk_production_quantity_evening_in_ruppe: Number(
						eveningTotal.toFixed(2),
					),
				}
			})
			.filter(
				(item) =>
					// Only include records with non-zero values (same as PHP logic)
					item.milk_production_quantity_morning_in_ruppe !== 0 ||
					item.milk_production_quantity_evening_in_ruppe !== 0,
			)

		return result
	}

	// Profit Loss With Selling And Purchase Price
	public static async profitLossGraphWithSellingAndPurcahsePricePDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossGraphRow[]> {
		const dateRangeQuery = `
            WITH RECURSIVE date_range AS (
                SELECT DATE(?) as date
                UNION ALL
                SELECT DATE_ADD(date, INTERVAL 1 DAY)
                FROM date_range
                WHERE date < DATE(?)
            )
            SELECT date FROM date_range
        `

		const dates = (await db.sequelize.query(dateRangeQuery, {
			replacements: [start_date, end_date],
			type: QueryTypes.SELECT,
		})) as unknown as { date: string }[]

		const dateList = dates.map((row) => row.date)

		// Fetch all income data for the date range in one query
		const incomeQuery = `
            SELECT DATE(dqa.answer_date) as answer_date, dqa.answer
            FROM daily_record_questions AS drq
            JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id
			AND dqa.deleted_at IS NULL
            JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id
			AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id IN (2, 28)
			AND drq.delete_status = 0
            ORDER BY dqa.answer_date DESC
        `

		// Fetch all expense data for the date range in one query
		const expenseQuery = `
            SELECT DATE(dqa.answer_date) as answer_date, dqa.answer
            FROM daily_record_questions AS drq
            JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id
			AND dqa.deleted_at IS NULL
            JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id
			AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id IN (1, 22)
			AND drq.delete_status = 0
            ORDER BY dqa.answer_date DESC
        `

		const [incomeData, expenseData] = await Promise.all([
			db.sequelize.query(incomeQuery, {
				replacements: [start_date, end_date, user_id],
				type: QueryTypes.SELECT,
			}) as unknown as Promise<ProfitLossData[]>,
			db.sequelize.query(expenseQuery, {
				replacements: [start_date, end_date, user_id],
				type: QueryTypes.SELECT,
			}) as unknown as Promise<ProfitLossData[]>,
		])

		// Group data by date using reduce
		const incomeByDate: Record<string, ProfitLossData[]> = incomeData.reduce(
			(acc: Record<string, ProfitLossData[]>, record: ProfitLossData) => {
				const date = record.answer_date
				if (!acc[date]) acc[date] = []
				acc[date].push(record)
				return acc
			},
			{} as Record<string, ProfitLossData[]>,
		)

		const expenseByDate: Record<string, ProfitLossData[]> = expenseData.reduce(
			(acc: Record<string, ProfitLossData[]>, record: ProfitLossData) => {
				const date = record.answer_date
				if (!acc[date]) acc[date] = []
				acc[date].push(record)
				return acc
			},
			{} as Record<string, ProfitLossData[]>,
		)

		// Process all dates using map and filter
		const resData = dateList
			.map((date: string): ProfitLossGraphRow => {
				const newDate = moment(date).format('Do MMM YYYY')
				let profit = 0
				let loss = 0

				// Calculate total income for this date
				const totalIncomeWithSellingPrice = (incomeByDate[date] || []).reduce(
					(total: number, record: ProfitLossData) => {
						const answer = JSON.parse(record.answer) as {
							price: number
							amount?: number
						}[]
						return (
							total +
							answer.reduce((itemTotal, valuew) => {
								const amount = valuew.amount || 1
								return itemTotal + valuew.price * amount
							}, 0)
						)
					},
					0,
				)

				// Calculate total expense for this date
				const totalExpenseWithPurchasePrice = (
					expenseByDate[date] || []
				).reduce((total: number, record: ProfitLossData) => {
					const answer = JSON.parse(record.answer) as {
						price: number
						amount?: number
					}[]
					return (
						total +
						answer.reduce(
							(
								itemTotal: number,
								valuea: { price: number; amount?: number },
							) => {
								const amount = valuea.amount || 1
								return itemTotal + valuea.price * amount
							},
							0,
						)
					)
				}, 0)

				const totalWithSellingAndPurchasePrice =
					totalIncomeWithSellingPrice - totalExpenseWithPurchasePrice

				if (totalWithSellingAndPurchasePrice > 0) {
					profit = totalWithSellingAndPurchasePrice
				} else {
					loss = totalWithSellingAndPurchasePrice
					loss = Math.abs(loss)
				}

				return {
					date: newDate,
					profit: this.numberFormat(profit, 2, '.', ''),
					loss: this.numberFormat(Math.floor(loss), 2, '.', ''),
				}
			})
			.filter((abc) => abc.profit !== '0.00' || abc.loss !== '0.00')

		return resData
	}

	static numberFormat(
		number: number,
		decimals: number,
		decPoint: string,
		thousandsSep: string,
	): string {
		const n = Number.isFinite(+number) ? +number : 0
		const prec = Number.isFinite(+decimals) ? Math.abs(decimals) : 0
		// const sep = thousandsSep === undefined ? ',' : thousandsSep
		// const dec = decPoint === undefined ? '.' : decPoint
		const sep = thousandsSep ?? ','
		const dec = decPoint ?? '.'

		const s = (prec ? n.toFixed(prec) : Math.round(n).toString()).split('.')

		if (s[0].length > 3) {
			s[0] = s[0].replaceAll(/\B(?=(?:\d{3})+(?!\d))/g, sep)
		}

		if ((s[1] || '').length < prec) {
			s[1] = s[1] || ''
			s[1] += new Array(prec - s[1].length + 1).join('0')
		}

		return s.join(dec)
	}

	public static async profitLossPDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossRow[]> {
		const dateRangeQuery = `
            WITH RECURSIVE date_range AS (
                SELECT DATE(?) as date
                UNION ALL
                SELECT DATE_ADD(date, INTERVAL 1 DAY)
                FROM date_range
                WHERE date < DATE(?)
            )
            SELECT date FROM date_range
        `

		const dates = (await db.sequelize.query(dateRangeQuery, {
			replacements: [start_date, end_date],
			type: QueryTypes.SELECT,
		})) as unknown as { date: string }[]

		const dateList = dates.map((row) => row.date)

		const incomeQuery = `
            SELECT DATE(dqa.answer_date) as answer_date, dqa.answer
            FROM daily_record_questions AS drq
            JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id
			AND dqa.deleted_at IS NULL
            JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id
			AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 2
			AND drq.delete_status = 0
            ORDER BY dqa.answer_date DESC
        `

		const expenseQuery = `
            SELECT DATE(dqa.answer_date) as answer_date, dqa.answer
            FROM daily_record_questions AS drq
            JOIN daily_record_question_answer AS dqa ON dqa.daily_record_question_id = drq.id
			AND dqa.deleted_at IS NULL
            JOIN question_tag_mapping AS qtm ON qtm.question_id = drq.id
			AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 1
			AND drq.delete_status = 0
            ORDER BY dqa.answer_date DESC
        `

		const [incomeData, expenseData] = await Promise.all([
			db.sequelize.query(incomeQuery, {
				replacements: [start_date, end_date, user_id],
				type: QueryTypes.SELECT,
			}) as unknown as Promise<ProfitLossData[]>,
			db.sequelize.query(expenseQuery, {
				replacements: [start_date, end_date, user_id],
				type: QueryTypes.SELECT,
			}) as unknown as Promise<ProfitLossData[]>,
		])

		// Group data by date using reduce (no loops)
		const incomeByDate: Record<string, ProfitLossData[]> = incomeData.reduce(
			(acc: Record<string, ProfitLossData[]>, record: ProfitLossData) => {
				const date = record.answer_date
				if (!acc[date]) acc[date] = []
				acc[date].push(record)
				return acc
			},
			{} as Record<string, ProfitLossData[]>,
		)

		const expenseByDate: Record<string, ProfitLossData[]> = expenseData.reduce(
			(acc: Record<string, ProfitLossData[]>, record: ProfitLossData) => {
				const date = record.answer_date
				if (!acc[date]) acc[date] = []
				acc[date].push(record)
				return acc
			},
			{} as Record<string, ProfitLossData[]>,
		)

		const resData = dateList
			.map((date: string): ProfitLossRow => {
				const newDate = moment(date).format('Do MMM YYYY')
				let profit = 0
				let loss = 0
				let totalWithoutSellingAndPurchasePrice = 0
				let totalIncomeWithoutSellingPrice = 0
				let totalExpenseWithoutPurchasePrice = 0

				totalIncomeWithoutSellingPrice = (incomeByDate[date] || []).reduce(
					(total: number, record: ProfitLossData) => {
						const answer = JSON.parse(record.answer) as AnswerItem[]
						return (
							total +
							answer.reduce((itemTotal: number, valuew: AnswerItem) => {
								const amount = valuew.amount || 1
								const price = valuew.price * amount
								return itemTotal + price
							}, 0)
						)
					},
					0,
				)

				totalExpenseWithoutPurchasePrice = (expenseByDate[date] || []).reduce(
					(total: number, record: ProfitLossData) => {
						const answer = JSON.parse(record.answer) as AnswerItem[]
						return (
							total +
							answer.reduce((itemTotal: number, valuea: AnswerItem) => {
								const amount = valuea.amount || 1
								const price = valuea.price * amount
								return itemTotal + price
							}, 0)
						)
					},
					0,
				)

				totalWithoutSellingAndPurchasePrice =
					totalIncomeWithoutSellingPrice - totalExpenseWithoutPurchasePrice

				if (totalWithoutSellingAndPurchasePrice > 0) {
					profit = totalWithoutSellingAndPurchasePrice
				} else {
					loss = totalWithoutSellingAndPurchasePrice
					loss = Math.abs(loss)
				}

				return {
					date: newDate,
					profitWithoutSellingAndPurchasePrice: this.numberFormat(
						profit,
						2,
						'.',
						'',
					),
					lossWithoutSellingAndPurchasePrice: this.numberFormat(
						Math.floor(loss),
						2,
						'.',
						'',
					),
				}
			})
			.filter(
				(abc: ProfitLossRow) =>
					abc.profitWithoutSellingAndPurchasePrice !== '0.00' ||
					abc.lossWithoutSellingAndPurchasePrice !== '0.00',
			)

		return resData
	}

	// Income and Expense
	private static async fetchAllRecordsRaw(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<RawRecord[]> {
		const query = `
			SELECT DISTINCT
				dqa.answer_date,
				dqa.daily_record_question_id,
				dqa.answer,
				qtm.question_tag_id
			FROM daily_record_question_answer dqa
			JOIN daily_record_questions drq ON dqa.daily_record_question_id = drq.id
			    AND drq.deleted_at IS NULL
			JOIN question_tag_mapping qtm ON qtm.question_id = drq.id
			    AND qtm.deleted_at IS NULL
			WHERE dqa.user_id = :user_id
			AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
			AND qtm.question_tag_id IN (1, 2, 30, 31, 32, 33)
			AND drq.delete_status = 0
			ORDER BY dqa.answer_date DESC
		`

		const results = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: {
				user_id,
				start_date,
				end_date,
			},
		})) as unknown as RawRecord[]

		return results
	}

	private static groupRecordsByDate(
		records: RawRecord[],
	): Record<string, RawRecord[]> {
		const grouped: Record<string, RawRecord[]> = {}

		for (const record of records) {
			const date = record.answer_date
			if (!grouped[date]) {
				grouped[date] = []
			}
			grouped[date].push(record)
		}

		return grouped
	}

	private static processDailyIncomeExpenseFromGrouped(
		date: string,
		dayRecords: RawRecord[],
	): IncomeExpenseRow | null {
		const uniqueRecords = new Map<number, RawRecord>()

		for (const record of dayRecords) {
			const key = record.daily_record_question_id
			if (!uniqueRecords.has(key)) {
				uniqueRecords.set(key, record)
			}
		}

		const records = Array.from(uniqueRecords.values())

		const totals = {
			expense: this.calculateTotalByTags(records, [1]),
			income: this.calculateTotalByTags(records, [2]),
			greenFeed: this.calculateTotalByTags(records, [30]),
			cattleFeed: this.calculateTotalByTags(records, [31]),
			dryFeed: this.calculateTotalByTags(records, [32]),
			supplement: this.calculateTotalByTags(records, [33]),
		}

		const profit = totals.income - totals.expense
		const otherExpense =
			totals.expense -
			(totals.greenFeed +
				totals.cattleFeed +
				totals.dryFeed +
				totals.supplement)

		// Format date for display
		const newDate = this.formatDateForDisplay(date)

		const dailyData: IncomeExpenseRow = {
			Date: newDate,
			Expense: totals.expense.toFixed(2),
			Income: totals.income.toFixed(2),
			Profit: profit.toFixed(2),
			GreenFeed: totals.greenFeed.toFixed(2),
			CattleFeed: totals.cattleFeed.toFixed(2),
			DryFeed: totals.dryFeed.toFixed(2),
			OtherExpense: otherExpense.toFixed(2),
			Supplement: totals.supplement.toFixed(2),
		}

		// Only return data if there's actual activity
		if (
			totals.expense !== 0 ||
			totals.income !== 0 ||
			totals.greenFeed !== 0 ||
			totals.dryFeed !== 0 ||
			totals.supplement !== 0 ||
			totals.cattleFeed !== 0
		) {
			return dailyData
		}

		return null
	}

	private static formatDateForDisplay(date: string): string {
		const dateObj = new Date(date)
		const day = dateObj.getDate()
		const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
		const year = dateObj.getFullYear()

		// Add ordinal suffix efficiently

		let suffix: string

		if (day % 10 === 1 && day !== 11) {
			suffix = 'st'
		} else if (day % 10 === 2 && day !== 12) {
			suffix = 'nd'
		} else if (day % 10 === 3 && day !== 13) {
			suffix = 'rd'
		} else {
			suffix = 'th'
		}

		return `${day}${suffix} ${month} ${year}`
	}

	private static calculateTotalByTags(
		records: RawRecord[],
		targetTags: number[],
	): number {
		let total = 0

		for (const record of records) {
			if (targetTags.includes(record.question_tag_id)) {
				const answer = JSON.parse(record.answer) as Array<{
					price: number
					amount?: number
				}>
				for (const item of answer) {
					const amount = item.amount || 1
					total += item.price * amount
				}
			}
		}

		return total
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
		totals.t_expense += Number.parseFloat(dailyData.Expense)
		totals.t_income += Number.parseFloat(dailyData.Income)
		totals.t_profit += Number.parseFloat(dailyData.Profit)
		totals.t_greenFeed += Number.parseFloat(dailyData.GreenFeed)
		totals.t_cattleFeed += Number.parseFloat(dailyData.CattleFeed)
		totals.t_dryFeed += Number.parseFloat(dailyData.DryFeed)
		totals.t_otherExpense += Number.parseFloat(dailyData.OtherExpense)
		totals.t_supplement += Number.parseFloat(dailyData.Supplement)
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

	public static async incomeExpensePDFData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseResult> {
		const allRecords = await this.fetchAllRecordsRaw(
			user_id,
			start_date,
			end_date,
		)

		const recordsByDate = this.groupRecordsByDate(allRecords)
		const dates = this.generateDateRange(start_date, end_date)
		const totals = this.initializeTotals()
		const data: IncomeExpenseRow[] = []

		for (const date of dates) {
			const dailyData = this.processDailyIncomeExpenseFromGrouped(
				date,
				recordsByDate[date] || [],
			)
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

	// Milk Report
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
		const generateDateRange = (start: string, end: string): string[] => {
			const dates: string[] = []
			const startTime = Math.floor(new Date(start).getTime() / 1000)
			const endTime = Math.floor(new Date(end).getTime() / 1000)

			for (let i = startTime; i <= endTime; i += 86400) {
				dates.push(new Date(i * 1000).toISOString().split('T')[0])
			}
			return dates
		}

		const buildBaseWhere = (
			dates: string[],
		): {
			user_id: number
			record_date?: { [Op.in]: string[] }
			animal_number?: string
		} => {
			const where: {
				user_id: number
				record_date?: { [Op.in]: string[] }
				animal_number?: string
				deleted_at: null
			} = { user_id, deleted_at: null }

			if (dates.length > 0 && dates[0] !== '1970-01-01') {
				where.record_date = { [Op.in]: dates }
			}

			if (animal_number?.trim()) {
				where.animal_number = animal_number
			}
			where.deleted_at = null

			return where
		}

		const formatDate = (dateStr: string): string => {
			const date = new Date(dateStr)
			const months = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			]
			return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')},${date.getFullYear()}`
		}

		const dates = generateDateRange(start_date, end_date)
		const baseWhere = buildBaseWhere(dates)

		const [allRecords, aggregatedTotals, dayWiseTotals] = await Promise.all([
			db.DailyMilkRecord.findAll({
				where: baseWhere,
				order: [['created_at', 'DESC']],
			}),

			db.DailyMilkRecord.findAll({
				where: baseWhere,
				attributes: [
					'animal_id',
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
				],
				group: ['animal_id'],
				raw: true,
			}) as unknown as AggregatedTotal[],

			db.DailyMilkRecord.findAll({
				where: baseWhere,
				attributes: [
					'record_date',
					'animal_id',
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
				],
				group: ['record_date', 'animal_id'],
				raw: true,
			}) as unknown as DayWiseTotal[],
		])

		const cows = allRecords
			.filter((record) => record.animal_id === 1)
			.map((cow) => ({
				record_date: cow.record_date,
				animal_id: cow.animal_id,
				animal_number: cow.animal_number,
				morning_milk_in_litres: cow.morning_milk_in_litres,
				evening_milk_in_litres: cow.evening_milk_in_litres,
				total_milk_in_litres:
					Number(cow.morning_milk_in_litres) +
					Number(cow.evening_milk_in_litres),
			}))

		const buffalos = allRecords
			.filter((record) => record.animal_id === 2)
			.map((buffalo) => ({
				record_date: buffalo.record_date,
				animal_id: buffalo.animal_id,
				animal_number: buffalo.animal_number,
				morning_milk_in_litres: buffalo.morning_milk_in_litres,
				evening_milk_in_litres: buffalo.evening_milk_in_litres,
				total_milk_in_litres:
					Number(buffalo.morning_milk_in_litres) +
					Number(buffalo.evening_milk_in_litres),
			}))

		const totals = {
			cow: { morning: 0, evening: 0 },
			buffalo: { morning: 0, evening: 0 },
			overall: 0,
		}

		// aggregatedTotals.forEach((item) => {
		for (const item of aggregatedTotals) {
			const total = Number(item.total || 0)
			totals.overall += total

			if (item.animal_id === 1) {
				totals.cow.morning = Number(item.morning_milk || 0)
				totals.cow.evening = Number(item.evening_milk || 0)
			} else if (item.animal_id === 2) {
				totals.buffalo.morning = Number(item.morning_milk || 0)
				totals.buffalo.evening = Number(item.evening_milk || 0)
			}
			// })
		}

		const dayWiseSubTotal: Record<string, DayWiseSubTotalItem> = {}
		// dayWiseTotals.forEach((item) => {
		for (const item of dayWiseTotals) {
			const dateKey = String(item.record_date)

			if (!dayWiseSubTotal[dateKey]) {
				dayWiseSubTotal[dateKey] = {}
			}

			if (item.animal_id === 1) {
				Object.assign(dayWiseSubTotal[dateKey], {
					cow_morning_milk: Number(item.morning_milk || 0),
					cow_evening_milk: Number(item.evening_milk || 0),
					cow_total: Number(item.total || 0),
				})
			} else if (item.animal_id === 2) {
				Object.assign(dayWiseSubTotal[dateKey], {
					buffalo_morning_milk: Number(item.morning_milk || 0),
					buffalo_evening_milk: Number(item.evening_milk || 0),
					buffalo_total: Number(item.total || 0),
				})
			}
			// })
		}

		return {
			animal_number: animal_number || null,
			cow_daily_milk: cows,
			buffalo_daily_milk: buffalos,
			relevent_total: {
				total_cow_morning_milk: totals.cow.morning,
				total_cow_evening_milk: totals.cow.evening,
				total_buffalo_morning_milk: totals.buffalo.morning,
				total_buffalo_evening_milk: totals.buffalo.evening,
				total_milk: totals.overall,
				record_period: `${formatDate(start_date)} - ${formatDate(end_date)}`,
			},
			daywise_sub_total: dayWiseSubTotal,
		}
	}

	// Fixed Investment Report
	public static async fixedInvestmentReportPDFData(
		user_id: number,
	): Promise<InvestmentReport> {
		const query: string = `
            SELECT 
                it.investment_type,
                fid.amount_in_rs,
                fid.date_of_installation_or_purchase
            FROM fixed_investment_details fid
            INNER JOIN investment_types it ON it.id = fid.type_of_investment
            WHERE fid.user_id = ? 
			AND fid.deleted_at IS NULL
			AND it.deleted_at IS NULL
            ORDER BY fid.date_of_installation_or_purchase DESC
        `

		const data: InvestmentData[] = await db.sequelize.query(query, {
			replacements: [user_id],
			type: QueryTypes.SELECT,
		})
		// Early return if no data
		if (!data || data.length === 0) {
			return {
				success: true,
				data: {
					reportData: [],
					total_investment: '0.00',
					number_of_investments: 0,
				},
			}
		}

		const currentDate = moment()
		let total: number = 0

		const resData: ProcessedInvestmentData[] = data.map(
			(item: InvestmentData) => {
				const purchaseDate = moment(item.date_of_installation_or_purchase)
				const ageInYears: number = currentDate.diff(purchaseDate, 'days') / 365

				// Accumulate total in the same loop
				total += Number.parseFloat(String(item.amount_in_rs)) || 0

				return {
					type_of_investment: item.investment_type,
					amount_in_rs: Number.parseFloat(String(item.amount_in_rs)).toFixed(2),
					date_of_installation_or_purchase: purchaseDate.format('Do MMM YYYY'),
					age_in_year: ageInYears.toFixed(1),
				}
			},
		)

		return {
			success: true,
			data: {
				reportData: resData,
				total_investment: total.toFixed(2),
				number_of_investments: resData.length,
			},
		}
	}

	// Breeding Report
	public static async breedingReportPDFData(
		user_id: number,
	): Promise<BreedingReportResult> {
		const sql = `
            SELECT DISTINCT
                aqa.animal_number,
                aqa.animal_id,
                a.name as animal_name,
                MAX(CASE WHEN cq.question_tag = 8 THEN aqa.answer END) as sex,
                MAX(CASE WHEN cq.question_tag = 15 THEN aqa.answer END) as pregnancy_state,
                MAX(CASE WHEN cq.question_tag = 23 THEN aqa.answer END) as ai_date,
				MAX(CASE WHEN cq.question_tag = 35 THEN aqa.answer END) as bull_no,
                MAX(CASE WHEN cq.question_tag = 16 THEN aqa.answer END) as milking_status,
				MAX(CASE WHEN cq.question_tag = 9 THEN aqa.answer END) as dob
            FROM animal_question_answers aqa
            JOIN animals a ON a.id = aqa.animal_id AND a.deleted_at IS NULL
            JOIN common_questions cq ON cq.id = aqa.question_id AND cq.deleted_at IS NULL
            WHERE aqa.user_id = ?
            AND aqa.status != 1
            AND cq.question_tag IN (8, 9, 11, 15, 16, 23, 35)
			AND aqa.deleted_at IS NULL
            GROUP BY aqa.animal_number, aqa.animal_id, a.name
        `

		const animals = (await db.sequelize.query(sql, {
			replacements: [user_id],
			type: QueryTypes.SELECT,
		})) as unknown as {
			animal_number: string
			animal_id: number
			animal_name: string
			sex: string
			pregnancy_state: string
			ai_date: string
			bull_no: string
			milking_status: string
			dob: string
		}[]

		const motherOffspringQuery = `
            SELECT 
               mother_aqa.answer as mother_number,
               offspring_aqa.animal_number as offspring_number,
               offspring_aqa.animal_id as offspring_id,
               MAX(CASE WHEN cq.question_tag = 9 THEN offspring_aqa.answer END) as offspring_dob
            FROM animal_question_answers mother_aqa
            JOIN animal_question_answers offspring_aqa ON offspring_aqa.animal_id = mother_aqa.animal_id
            JOIN common_questions cq ON cq.id = offspring_aqa.question_id
            WHERE mother_aqa.user_id = ?
            AND mother_aqa.status != 1
            AND offspring_aqa.status != 1
            AND mother_aqa.question_id IN (SELECT id FROM common_questions WHERE question_tag = 11 AND deleted_at IS NULL)
            AND cq.question_tag IN (9, 11)
            AND mother_aqa.deleted_at IS NULL
            AND offspring_aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            GROUP BY mother_aqa.answer, offspring_aqa.animal_number, offspring_aqa.animal_id
        `

		const motherOffspringData = (await db.sequelize.query(
			motherOffspringQuery,
			{
				replacements: [user_id],
				type: QueryTypes.SELECT,
			},
		)) as unknown as { mother_number: string; offspring_dob: string }[]

		const motherOffspringMap = new Map<string, string>()

		for (const row of motherOffspringData) {
			if (row.mother_number && row.offspring_dob) {
				motherOffspringMap.set(row.mother_number, row.offspring_dob)
			}
		}

		const pregnant: Record<string, PregnantAnimal[]> = {}
		const nonPregnant: Record<string, NonPregnantAnimal[]> = {}

		for (const animal of animals) {
			if (!animal.sex || animal.sex.toLowerCase() === 'male') {
				continue
			}

			if (!animal.pregnancy_state) {
				continue
			}

			const pregnancyState = animal.pregnancy_state.toLowerCase()
			const aiDate = animal.ai_date
			const bullNo = animal.bull_no || 'NA'
			const milkingStatus = animal.milking_status || 'dry'
			const animalName = animal.animal_name

			if (pregnancyState === 'yes') {
				let monthOfPregnancy = 'NA'
				let expectedDeliveryMonth: string | null = null

				if (aiDate && aiDate !== 'NA') {
					try {
						const aiDateParsed = new Date(aiDate)
						const pregnancyDetectionDate = addMonths(aiDateParsed, 3)
						monthOfPregnancy = format(pregnancyDetectionDate, 'yyyy-MM-dd')

						const expectedDeliveryDate = addMonths(aiDateParsed, 9)
						expectedDeliveryMonth = format(expectedDeliveryDate, 'MMMM')
					} catch {
						monthOfPregnancy = 'NA'
						expectedDeliveryMonth = null
					}
				}

				if (!pregnant[animalName]) {
					pregnant[animalName] = []
				}

				pregnant[animalName].push({
					animal_num: animal.animal_number,
					date_of_pregnancy_detection: monthOfPregnancy,
					bull_no: bullNo,
					expected_month_of_delivery: expectedDeliveryMonth,
					status_milking_dry: milkingStatus,
					date_of_AI: aiDate || 'NA',
				})
			} else {
				let dateOfPregnancyDetection = 'NA'

				if (aiDate && aiDate !== 'NA') {
					try {
						const aiDateParsed = new Date(aiDate)
						const pregnancyDetectionDate = addMonths(aiDateParsed, 3)
						dateOfPregnancyDetection = format(
							pregnancyDetectionDate,
							'yyyy-MM-dd',
						)
					} catch {
						dateOfPregnancyDetection = 'NA'
					}
				}

				const lastDeliveryDate =
					motherOffspringMap.get(animal.animal_number) || 'NA'

				if (!nonPregnant[animalName]) {
					nonPregnant[animalName] = []
				}

				nonPregnant[animalName].push({
					animal_num: animal.animal_number,
					date_of_last_AI: aiDate || 'NA',
					bull_no: bullNo,
					date_of_pregnancy_detection: dateOfPregnancyDetection,
					date_of_last_delivery: lastDeliveryDate,
					status_milking_dry: milkingStatus,
				})
			}
		}

		return {
			pregnant,
			non_pregnant: nonPregnant,
		}
	}

	//Animal Profile Report
	public static async getProfileData(
		user_id: number,
		_start_date: string,
		_end_date: string,
		animal_id: number,
		animal_number: string,
	): Promise<ProfileData> {
		const [animalType, animalImage, vaccinations, motherNo] =
			(await Promise.all([
				this.getAnimalType(user_id, animal_id, animal_number),
				this.getAnimalImage(user_id, animal_id, animal_number),
				this.getVaccinations(user_id, animal_id, animal_number),
				this.getMotherInfo(user_id, animal_id, animal_number),
			])) as unknown as [
				{ id: number; Animal: { name: string } } | null,
				{
					image?: string
				},
				{
					UserVaccinationTypes?: { VaccinationType?: { type?: string } }[]
					date?: Date | string
				}[],
				{ mother_animal_number: string; delivery_date: Date },
			]

		const [generalData, breedingData, milkData, pedigreeData] =
			await Promise.all([
				this.getGeneralData(user_id, animal_id, animal_number, animalType),
				this.getBreedingData(user_id, animal_id, animal_number),
				this.getMilkData(user_id, animal_id, animal_number),
				this.getPedigreeData(user_id, animal_id, animal_number, motherNo),
			])

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
	): Promise<{ id: number; Animal: { name: string } } | null> {
		return (await db.AnimalQuestionAnswer.findOne({
			where: {
				user_id,
				animal_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.Animal,
					as: 'Animal',
					attributes: ['name'],
					where: { deleted_at: null },
				},
			],
			attributes: ['id'],
		})) as unknown as {
			id: number
			Animal: {
				name: string
			}
		}
	}

	private static async getAnimalImage(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ image?: string } | null> {
		return await db.AnimalImage.findOne({
			where: { user_id, animal_id, animal_number, deleted_at: null },
			attributes: ['image'],
		})
	}

	private static async getVaccinations(
		user_id: number,
		_animal_id: number,
		animal_number: string,
	): Promise<{ date: Date }[]> {
		return await db.VaccinationDetail.findAll({
			where: { user_id, deleted_at: null },
			include: [
				{
					model: db.AnimalVaccination,
					as: 'AnimalVaccinations',
					where: { animal_number, deleted_at: null },
					required: true,
				},
				{
					model: db.UserVaccinationType,
					as: 'VaccinationTypes',
					include: [
						{
							model: db.VaccinationType,
							as: 'VaccinationType',
							attributes: ['type'],
							where: { deleted_at: null },
						},
					],
					where: { deleted_at: null },
				},
			],
			attributes: ['date'],
		})
	}

	private static async getMotherInfo(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{ mother_animal_number: string; delivery_date: Date } | null> {
		return await db.AnimalMotherCalf.findOne({
			where: {
				user_id,
				animal_id,
				calf_animal_number: animal_number,
				deleted_at: null,
			},
			attributes: ['mother_animal_number', 'delivery_date'],
			raw: true,
		})
	}

	private static async getGeneralData(
		user_id: number,
		animal_id: number,
		animal_number: string,
		animalType: { Animal: { name: string } } | null,
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
			animal_type: animalType?.Animal?.name || '',
			birth: dateOfBirth?.answer || '',
			weight: weight?.answer || '',
			age,
			breed,
			lactation_number: pregnancyCycle?.answer || '',
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

		const daysInMilk = await this.calculateCurrentDaysInMilk(
			user_id,
			animal_id,
			animal_number,
		)

		return {
			pregnant_status: pregnantStatus?.answer || '',
			lactating_status: milkingStatus?.answer || '',
			last_delivery_date: lastDeliveryDate?.answer || '',
			days_in_milk: daysInMilk,
			last_breeding_bull_no: BullNoForAI?.answer || '',
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

		// Calculate milk yields and average
		const [currentLactationYield, lastLactationYield, daysInMilk] =
			await Promise.all([
				this.calculateCurrentLactationMilkYield(
					user_id,
					animal_id,
					animal_number,
				),
				this.calculateLastLactationMilkYield(user_id, animal_id, animal_number),
				this.calculateCurrentDaysInMilk(user_id, animal_id, animal_number),
			])

		const avgDailyMilk =
			daysInMilk > 0 ? (currentLactationYield / daysInMilk).toFixed(2) : ''

		return {
			average_daily_milk: avgDailyMilk,
			current_lactation_milk_yield: currentLactationYield,
			last_lactation_milk_yield: lastLactationYield,
			last_known_snf: (last_known_snf / 2).toFixed(2),
			last_known_fat: (last_known_fat / 2).toFixed(2),
		}
	}

	private static async getPedigreeData(
		user_id: number,
		animal_id: number,
		_animal_number: string,
		motherNo: { mother_animal_number: string; delivery_date: Date } | null,
	): Promise<Record<string, unknown>> {
		let mother_milk_yield = 0
		let motherBullNoUsedForAI = ''
		let semen_co_name = ''
		let sire_dam_yield = ''

		if (motherNo) {
			// Calculate mother's total milk yield
			const motherMilkResult = (await db.DailyMilkRecord.findOne({
				where: {
					user_id,
					animal_id,
					animal_number: motherNo.mother_animal_number,
					deleted_at: null,
				},
				attributes: [
					[
						db.sequelize.fn(
							'SUM',
							db.sequelize.literal(
								'morning_milk_in_litres + evening_milk_in_litres',
							),
						),
						'total_milk',
					],
				],
				raw: true,
			})) as unknown as { total_milk: string }

			mother_milk_yield = Number.parseFloat(motherMilkResult?.total_milk || '0')

			// Get AI date for mother
			const dateOfAI = await db.AnimalQuestionAnswer.findOne({
				where: {
					user_id,
					animal_id,
					animal_number: motherNo.mother_animal_number,
					answer: { [Op.lte]: motherNo.delivery_date },
					status: { [Op.ne]: 1 },
					deleted_at: null,
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'AnimalQuestion',
						where: { question_tag: 23, deleted_at: null },
					},
				],
				order: [['created_at', 'DESC']],
				attributes: ['answer', 'created_at'],
			})

			if (dateOfAI) {
				// Get bull number used for AI
				const noOfBullUsedForAI = await db.AnimalQuestionAnswer.findOne({
					where: {
						user_id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
						created_at: dateOfAI.created_at,
						status: { [Op.ne]: 1 },
						deleted_at: null,
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'AnimalQuestion',
							where: { question_tag: 35, deleted_at: null },
						},
					],
					order: [['created_at', 'DESC']],
					attributes: ['answer'],
				})
				motherBullNoUsedForAI = noOfBullUsedForAI?.answer || ''

				// Get semen company name
				const semenCoName = await db.AnimalQuestionAnswer.findOne({
					where: {
						user_id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
						created_at: dateOfAI.created_at,
						status: { [Op.ne]: 1 },
						deleted_at: null,
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'AnimalQuestion',
							where: { question_tag: 42, deleted_at: null },
						},
					],
					order: [['created_at', 'DESC']],
					attributes: ['answer'],
				})
				semen_co_name = semenCoName?.answer || ''

				// Get bull mother yield (sire dam yield)
				const bullMotherYield = await db.AnimalQuestionAnswer.findOne({
					where: {
						user_id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
						created_at: dateOfAI.created_at,
						status: { [Op.ne]: 1 },
						deleted_at: null,
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'AnimalQuestion',
							where: { question_tag: 14, deleted_at: null },
						},
					],
					order: [['created_at', 'DESC']],
					attributes: ['answer'],
				})
				sire_dam_yield = bullMotherYield?.answer || ''
			}
		}

		return {
			mother: {
				tag_no: motherNo?.mother_animal_number || '',
				milk_yield: mother_milk_yield.toFixed(1),
			},
			father: {
				tag_no: motherBullNoUsedForAI,
				semen_co_name: semen_co_name,
				sire_dam_yield: Number.parseFloat(sire_dam_yield).toFixed(1) || '',
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
			where: {
				user_id,
				animal_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: tag, deleted_at: null },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['answer'],
		})
	}

	private static async getBreed(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<string> {
		let tag: number
		if (animal_id === 1) {
			tag = 62
		} else if (animal_id === 2) {
			tag = 63
		} else {
			return ''
		}

		const breeding = await this.getLastQuestionAnswerByQuestionTag(
			user_id,
			animal_id,
			animal_number,
			tag,
		)
		return breeding?.answer || ''
	}
	private static calculateAge(dateOfBirth: { answer?: string } | null): number {
		if (!dateOfBirth?.answer) return 0

		const bday = new Date(dateOfBirth.answer)
		const today = new Date()
		const diffTime = Math.abs(today.getTime() - bday.getTime())
		const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))

		return diffYears
	}

	private static calculateFatSNF(
		morning: { answer?: string } | null,
		evening: { answer?: string } | null,
	): number {
		const m_value = Number.parseFloat(morning?.answer || '0') || 0
		const e_value = Number.parseFloat(evening?.answer || '0') || 0
		return m_value + e_value
	}

	private static async calculateCurrentDaysInMilk(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<number> {
		const lastLactationStatus = (await db.AnimalQuestionAnswer.findOne({
			where: {
				user_id,
				animal_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 16, deleted_at: null },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['answer', 'created_at'],
		})) as unknown as { answer: string; created_at: Date }

		if (lastLactationStatus?.answer?.toLowerCase() === 'yes') {
			const from = new Date(lastLactationStatus.created_at)
			const to = new Date()
			const diffTime = Math.abs(to.getTime() - from.getTime())
			return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		}

		return 0
	}

	private static async calculateCurrentLactationMilkYield(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<number> {
		const lastLactationStatus = (await db.AnimalQuestionAnswer.findOne({
			where: {
				user_id,
				animal_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 16, deleted_at: null },
				},
			],
			order: [['created_at', 'DESC']],
			attributes: ['answer', 'created_at'],
		})) as unknown as { answer: string; created_at: Date }

		if (lastLactationStatus?.answer?.toLowerCase() === 'yes') {
			const startDate = new Date(lastLactationStatus.created_at)
			const endDate = new Date()

			// Generate date range
			const dates = this.generateDates(startDate, endDate)

			if (dates.length > 0) {
				const milkResult = (await db.DailyMilkRecord.findOne({
					where: {
						user_id,
						animal_number,
						animal_id,
						record_date: { [Op.in]: dates },
						deleted_at: null,
					},
					attributes: [
						[
							db.sequelize.fn(
								'SUM',
								db.sequelize.literal(
									'morning_milk_in_litres + evening_milk_in_litres',
								),
							),
							'total_milk',
						],
					],
					raw: true,
				})) as unknown as { total_milk: string }

				return Number.parseFloat(milkResult?.total_milk || '0')
			}
		}

		return 0
	}

	private static async calculateLastLactationMilkYield(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<number> {
		const lHistory = (await db.AnimalQuestionAnswer.findAll({
			where: {
				user_id,
				animal_id,
				animal_number,
				status: { [Op.ne]: 1 },
				deleted_at: null,
			},
			include: [
				{
					model: db.CommonQuestions,
					as: 'AnimalQuestion',
					where: { question_tag: 16, deleted_at: null },
				},
			],
			order: [['created_at', 'ASC']],
			attributes: ['answer', 'created_at'],
		})) as unknown as {
			answer: string
			created_at: Date
		}[]

		if (lHistory.length <= 1) return 0

		const historyData: LactationHistory[] = lHistory.map((item) => ({
			lactating_status: item.answer || '',
			date: item.created_at,
			created_at: item.created_at,
		}))

		const result: LactationHistory[] = []

		// Replicate PHP logic for finding lactation cycles
		for (let i = 0; i < historyData.length; i++) {
			if (
				i < historyData.length - 1 &&
				historyData[i].lactating_status.toLowerCase() === 'yes'
			) {
				let k = i + 1
				while (
					k < historyData.length - 1 &&
					historyData[k].lactating_status.toLowerCase() !== 'no'
				) {
					k++
				}

				if (
					historyData[i].lactating_status !== historyData[k].lactating_status
				) {
					result.push(historyData[i], historyData[k])
				}
			}
		}

		const lactatingCycles = this.getCountLactationCycle(result)

		if (lactatingCycles.length > 0) {
			let startDate = ''
			let endDate = ''
			let cycleCount = lactatingCycles.length

			for (const cycle of result) {
				if (cycle.lactating_status.toLowerCase() === 'yes') {
					startDate = cycle.date as string
				} else if (cycle.lactating_status.toLowerCase() === 'no') {
					endDate = cycle.date as string
				}

				if (startDate && endDate) {
					if (cycleCount === 1) {
						const dates = this.generateDates(
							new Date(startDate),
							new Date(endDate),
						)

						if (dates.length > 0) {
							const milkResult = (await db.DailyMilkRecord.findOne({
								where: {
									user_id,
									animal_number,
									animal_id,
									record_date: { [Op.in]: dates },
									deleted_at: null,
								},
								attributes: [
									[
										db.sequelize.fn(
											'SUM',
											db.sequelize.literal(
												'morning_milk_in_litres + evening_milk_in_litres',
											),
										),
										'total_milk',
									],
								],
								raw: true,
							})) as unknown as { total_milk: string }

							return Number.parseFloat(milkResult?.total_milk || '0')
						}
					}
					startDate = ''
					endDate = ''
					cycleCount--
				}
			}
		}

		return 0
	}

	private static getCountLactationCycle(result: LactationHistory[]): unknown[] {
		const cycles = []
		for (let i = 0; i < result.length; i += 2) {
			if (i + 1 < result.length) {
				cycles.push([result[i], result[i + 1]])
			}
		}
		return cycles
	}

	private static formatProfileImage(animalImage: { image?: string } | null): {
		image: string
	} {
		if (animalImage?.image) {
			return {
				image: `${process.env.APP_URL}/profile_img/thumb/${animalImage.image}`,
			}
		}
		return { image: '' }
	}

	private static formatVaccinations(
		vaccinations: {
			UserVaccinationTypes?: { VaccinationType?: { type?: string } }[]
			date?: Date | string
		}[],
	): { type: string; date: string }[] {
		return vaccinations.map((vaccination) => ({
			type: vaccination.UserVaccinationTypes?.[0]?.VaccinationType?.type || '',
			date: (vaccination.date as string) || '',
		}))
	}

	//Animal Breeding History
	public static async animalBreedingHistoryData(
		user_id: number,
		_start_date: string,
		_end_date: string,
		animal_id: number,
		animal_number: string,
	): Promise<AnimalBreedingHistoryResult> {
		const breedingData = await this.getAnimalBreeding(
			user_id,
			animal_id,
			animal_number,
		)

		return {
			animal_number,
			aiHistory: breedingData.aiHistory,
			deliveryHistory: breedingData.deliveryHistory,
			heatHistory: breedingData.heatHistory,
		}
	}

	private static async getAnimalBreeding(
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<{
		aiHistory: AIHistoryItem[]
		deliveryHistory: DeliveryHistoryItem[]
		heatHistory: { heatDate: string }[]
	}> {
		const AI = (await db.sequelize.query(
			`
            SELECT aqa.answer, aqa.created_at, cq.question_tag
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag IN (23, 35, 42, 14)
            AND aqa.user_id = :user_id
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number = :animal_number
            AND aqa.status <> 1
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            ORDER BY aqa.created_at DESC
            `,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)) as unknown as Array<{
			answer: string
			created_at: string
			question_tag: number
		}>

		const ai: Record<string, Partial<AIHistoryItem>> = {}
		const aiHistory: Record<string, AIHistoryItem> = {}

		for (const value of AI) {
			const createdAtKey = String(value.created_at)

			if (!ai[createdAtKey]) {
				ai[createdAtKey] = {}
			}

			if (value.question_tag === 23) {
				ai[createdAtKey].dateOfAI = value.answer
			} else if (value.question_tag === 35) {
				ai[createdAtKey].bullNumber = value.answer
			} else if (value.question_tag === 42) {
				ai[createdAtKey].motherYield = value.answer
			} else if (value.question_tag === 14) {
				ai[createdAtKey].semenCompanyName = value.answer
			}

			aiHistory[createdAtKey] = ai[createdAtKey] as AIHistoryItem
		}

		const Delivery = (await db.sequelize.query(
			`
            SELECT aqa.answer, aqa.created_at, cq.question_tag
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag IN (65, 66)
            AND aqa.user_id = :user_id
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number = :animal_number
            AND aqa.status <> 1
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            ORDER BY aqa.created_at DESC
            `,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)) as unknown as Array<{
			answer: string
			created_at: string
			question_tag: number
		}>

		const delivery: Record<string, Partial<DeliveryHistoryItem>> = {}
		const deliveryHistory: Record<string, DeliveryHistoryItem> = {}

		for (const value of Delivery) {
			const createdAtKey = String(value.created_at)

			if (!delivery[createdAtKey]) {
				delivery[createdAtKey] = {}
			}

			if (value.question_tag === 65) {
				delivery[createdAtKey].dateOfDelvery = value.answer

				const calf = await db.AnimalMotherCalf.findOne({
					where: {
						user_id,
						animal_id,
						mother_animal_number: animal_number,
						delivery_date: value.answer,
					},
				})
				delivery[createdAtKey].calfNumber = calf?.calf_animal_number ?? null
			} else if (value.question_tag === 66) {
				delivery[createdAtKey].typeOfDelivery = value.answer
			}

			deliveryHistory[createdAtKey] = delivery[
				createdAtKey
			] as DeliveryHistoryItem
		}

		const heatEvents = (await db.sequelize.query(
			`
            SELECT aqa.answer, aqa.created_at, cq.question_tag
            FROM common_questions cq
            JOIN animal_question_answers aqa ON aqa.question_id = cq.id
            WHERE cq.question_tag = 64
            AND aqa.user_id = :user_id
            AND aqa.animal_id = :animal_id
            AND aqa.animal_number = :animal_number
            AND aqa.status <> 1
            AND aqa.deleted_at IS NULL
            AND cq.deleted_at IS NULL
            ORDER BY aqa.created_at DESC
            `,
			{
				replacements: { user_id, animal_id, animal_number },
				type: QueryTypes.SELECT,
			},
		)) as unknown as Array<{
			answer: string
			created_at: string
			question_tag: number
		}>

		const heatEventDates: { heatDate: string }[] = []
		for (const value of heatEvents) {
			heatEventDates.push({ heatDate: value.answer })
		}

		return {
			aiHistory: Object.values(aiHistory),
			deliveryHistory: Object.values(deliveryHistory),
			heatHistory: heatEventDates,
		}
	}

	//All Animal Breeding History
	public static async allAnimalBreedingHistoryData(
		user_id: number,
		start_date: string,
		end_date: string,
		_animal_id?: number,
		_animal_number?: string,
	): Promise<AllAnimalBreedingHistoryResult> {
		const getPregnancyStatus = async (
			user_id: number,
			_start_date: string,
			_end_date: string,
			animal_id: number,
			animal_number: string,
		): Promise<string> => {
			const pregStatus = (await db.sequelize.query(
				`
                SELECT aqa.answer
                FROM animal_question_answers aqa
                JOIN common_questions cq ON cq.id = aqa.question_id
                WHERE cq.question_tag = 15
                AND aqa.user_id = :user_id
                AND aqa.animal_id = :animal_id
                AND aqa.animal_number = :animal_number
                AND aqa.status <> 1
                AND aqa.deleted_at IS NULL
                AND cq.deleted_at IS NULL
                ORDER BY aqa.created_at DESC
                LIMIT 1
                `,
				{
					replacements: { user_id, animal_id, animal_number },
					type: QueryTypes.SELECT,
				},
			)) as unknown as Array<{ answer: string }>
			return pregStatus[0]?.answer?.toLowerCase() || ''
		}

		const animalNumbers = (await db.AnimalQuestionAnswer.findAll({
			where: { user_id, status: { [Op.ne]: 1 } },
			attributes: [
				[
					db.Sequelize.fn('DISTINCT', db.Sequelize.col('animal_number')),
					'animal_number',
				],
				'animal_id',
			],
			raw: true,
		})) as unknown as AnimalNumber[]

		const result: AllAnimalBreedingHistoryResult = {
			pregnant: {},
			no_pregnant: {},
		}

		await Promise.all(
			animalNumbers.map(async (animal) => {
				const status = await getPregnancyStatus(
					user_id,
					start_date,
					end_date,
					animal.animal_id,
					animal.animal_number,
				)
				const breedingData = await ReportService.animalBreedingHistoryData(
					user_id,
					start_date,
					end_date,
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

	// Profit Loss graph
	public static async profitLossGraphReport(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossRowWithBreedingExpense[]> {
		const dates = this.generateDateRange(start_date, end_date)

		const [incomeData, expenseData, breedingData] = await Promise.all([
			this.fetchAllIncomeDataWithDistinct(user_id, start_date, end_date),
			this.fetchAllExpenseDataWithDistinct(user_id, start_date, end_date),
			this.fetchAllBreedingData(user_id, start_date, end_date),
		])

		const incomeMap = this.buildIncomeMapWithExactLogic(incomeData)
		const expenseMap = this.buildExpenseMapWithExactLogic(expenseData)
		const breedingMap = this.buildBreedingMapWithExactLogic(breedingData)

		return this.processAllDatesWithExactLogic(
			dates,
			incomeMap,
			expenseMap,
			breedingMap,
		)
	}

	private static async fetchAllIncomeDataWithDistinct(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseRecord[]> {
		const query = `
            SELECT DISTINCT(dqa.daily_record_question_id) as daily_record_question_id,
               dqa.answer_date, 
               dqa.answer
            FROM daily_record_question_answer dqa
            JOIN daily_record_questions drq ON dqa.daily_record_question_id = drq.id 
			AND drq.delete_status <> 1
            JOIN question_tag_mapping qtm ON qtm.question_id = drq.id 
			AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 2
			AND dqa.deleted_at IS NULL
            ORDER BY dqa.answer_date DESC
        `

		const results = (await db.sequelize.query(query, {
			replacements: [start_date, end_date, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as IncomeExpenseRecord[]

		return results.map((r) => ({
			answer_date: this.formatDate(r.answer_date),
			daily_record_question_id: r.daily_record_question_id,
			answer: r.answer,
		}))
	}

	private static async fetchAllExpenseDataWithDistinct(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseRecord[]> {
		const query = `
            SELECT DISTINCT(dqa.daily_record_question_id) as daily_record_question_id,
               dqa.answer_date, 
               dqa.answer
            FROM daily_record_question_answer dqa
            JOIN daily_record_questions drq ON dqa.daily_record_question_id = drq.id AND drq.delete_status <> 1
            JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id = 1
			AND dqa.deleted_at IS NULL
            ORDER BY dqa.answer_date DESC
        `

		const results = (await db.sequelize.query(query, {
			replacements: [start_date, end_date, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as IncomeExpenseRecord[]

		return results.map((r) => ({
			answer_date: this.formatDate(r.answer_date),
			daily_record_question_id: r.daily_record_question_id,
			answer: r.answer,
		}))
	}

	private static async fetchAllBreedingData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<BreedingRecord[]> {
		const query = `
           SELECT aqa.created_at, aqa.answer
           FROM animal_question_answers aqa
           JOIN common_questions cq ON aqa.question_id = cq.id AND cq.deleted_at IS NULL
           WHERE DATE(aqa.created_at) BETWEEN ? AND ?
           AND aqa.user_id = ?
		   AND aqa.deleted_at IS NULL
           AND cq.question_tag = 36
           AND cq.deleted_at IS NULL
        `

		const results = (await db.sequelize.query(query, {
			replacements: [start_date, end_date, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as BreedingRecord[]

		return results.map((r) => ({
			created_at: this.formatDate(r.created_at),
			answer: r.answer || '0',
		}))
	}

	private static buildIncomeMapWithExactLogic(
		incomeData: IncomeExpenseRecord[],
	): Map<string, IncomeExpenseRecord[]> {
		const incomeMap = new Map<string, IncomeExpenseRecord[]>()

		for (const record of incomeData) {
			const date = record.answer_date
			if (!incomeMap.has(date)) {
				incomeMap.set(date, [])
			}
			incomeMap.get(date)!.push(record)
		}

		return incomeMap
	}

	private static buildExpenseMapWithExactLogic(
		expenseData: IncomeExpenseRecord[],
	): Map<string, IncomeExpenseRecord[]> {
		const expenseMap = new Map<string, IncomeExpenseRecord[]>()

		for (const record of expenseData) {
			const date = record.answer_date
			if (!expenseMap.has(date)) {
				expenseMap.set(date, [])
			}
			expenseMap.get(date)!.push(record)
		}

		return expenseMap
	}

	private static buildBreedingMapWithExactLogic(
		breedingData: BreedingRecord[],
	): Map<string, BreedingRecord[]> {
		const breedingMap = new Map<string, BreedingRecord[]>()

		for (const record of breedingData) {
			const date = record.created_at
			if (!breedingMap.has(date)) {
				breedingMap.set(date, [])
			}
			breedingMap.get(date)!.push(record)
		}

		return breedingMap
	}

	private static processAllDatesWithExactLogic(
		dates: string[],
		incomeMap: Map<string, IncomeExpenseRecord[]>,
		expenseMap: Map<string, IncomeExpenseRecord[]>,
		breedingMap: Map<string, BreedingRecord[]>,
	): ProfitLossRowWithBreedingExpense[] {
		const resData: ProfitLossRowWithBreedingExpense[] = []

		for (const date of dates) {
			let profit = 0
			let loss = 0
			let totalWithoutSellingAndPurchasePrice = 0
			let totalIncomeWithoutSellingPrice = 0
			let totalExpenseWithoutPurchasePrice = 0
			let totalbreedingExpense = 0

			const incomeRecords = incomeMap.get(date) || []
			for (const value1 of incomeRecords) {
				try {
					const answer = JSON.parse(value1?.answer || '[]') as AnswerItem[]
					for (const value of answer) {
						const amount = value?.amount ?? 1

						const price = value.price * amount
						totalIncomeWithoutSellingPrice =
							totalIncomeWithoutSellingPrice + price
					}
				} catch {
					continue
				}
			}

			const breedingRecords = breedingMap.get(date) || []
			for (const value1 of breedingRecords) {
				const answer = Number.parseFloat(value1.answer)
				totalbreedingExpense = totalbreedingExpense + answer
			}

			const expenseRecords = expenseMap.get(date) || []
			for (const value3 of expenseRecords) {
				try {
					const answer = JSON.parse(value3?.answer || '[]') as AnswerItem[]

					for (const value of answer) {
						const amount = value?.amount ?? 1
						const price = value.price * amount
						totalExpenseWithoutPurchasePrice =
							totalExpenseWithoutPurchasePrice + price
					}
				} catch {
					continue
				}
			}

			totalWithoutSellingAndPurchasePrice =
				totalIncomeWithoutSellingPrice -
				(totalExpenseWithoutPurchasePrice + totalbreedingExpense)

			if (totalWithoutSellingAndPurchasePrice > 0) {
				profit = totalWithoutSellingAndPurchasePrice
			} else {
				loss = totalWithoutSellingAndPurchasePrice
				loss = Math.abs(loss)
			}

			resData.push({
				date: date,
				profitWithoutSellingAndPurchasePrice: profit.toFixed(2),
				lossWithoutSellingAndPurchasePrice: Math.floor(loss).toFixed(2),
				breedingExpense: totalbreedingExpense.toFixed(2),
			})
		}

		return resData
	}

	private static formatDate(date: Date | string): string {
		if (date instanceof Date) {
			return date.toISOString().split('T')[0]
		}
		return String(date).split('T')[0]
	}

	// Profit Loss With Selling And Purchase Price graph
	public static async profitLossGraphWithSellingAndPurchasePrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<ProfitLossWithSellingRow[]> {
		const dates = this.generateDateRange(start_date, end_date)

		const [incomeData, expenseData, breedingData] = await Promise.all([
			this.fetchAllIncomeDataWithSellingPrice(user_id, start_date, end_date),
			this.fetchAllExpenseDataWithPurchasePrice(user_id, start_date, end_date),
			this.fetchAllBreedingData(user_id, start_date, end_date), // Reuse existing method
		])

		const incomeMap = this.buildIncomeMapWithExactLogic(incomeData)
		const expenseMap = this.buildExpenseMapWithExactLogic(expenseData)
		const breedingMap = this.buildBreedingMapWithExactLogic(breedingData)

		return this.processAllDatesWithSellingAndPurchaseLogic(
			dates,
			incomeMap,
			expenseMap,
			breedingMap,
		)
	}

	private static async fetchAllIncomeDataWithSellingPrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseRecord[]> {
		const query = `
            SELECT DISTINCT(dqa.daily_record_question_id) as daily_record_question_id,
              dqa.answer_date, 
              dqa.answer
            FROM daily_record_question_answer dqa
            JOIN daily_record_questions drq ON dqa.daily_record_question_id = drq.id AND drq.delete_status <> 1
            JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id IN (2, 28)
            AND dqa.deleted_at IS NULL
            ORDER BY dqa.answer_date DESC
        `
		const results = (await db.sequelize.query(query, {
			replacements: [start_date, end_date, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as IncomeExpenseRecord[]

		return results.map((r) => ({
			answer_date: this.formatDate(r.answer_date),
			daily_record_question_id: r.daily_record_question_id,
			answer: r.answer,
		}))
	}

	private static async fetchAllExpenseDataWithPurchasePrice(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeExpenseRecord[]> {
		const query = `
            SELECT DISTINCT(dqa.daily_record_question_id) as daily_record_question_id,
               dqa.answer_date, 
               dqa.answer
            FROM daily_record_question_answer dqa
            JOIN daily_record_questions drq ON dqa.daily_record_question_id = drq.id AND drq.delete_status <> 1
            JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
            WHERE DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.user_id = ?
            AND qtm.question_tag_id IN (1, 22)
            AND dqa.deleted_at IS NULL
            ORDER BY dqa.answer_date DESC
        `
		const results = (await db.sequelize.query(query, {
			replacements: [start_date, end_date, user_id],
			type: QueryTypes.SELECT,
		})) as unknown as IncomeExpenseRecord[]

		return results.map((r) => ({
			answer_date: this.formatDate(r.answer_date),
			daily_record_question_id: r.daily_record_question_id,
			answer: r.answer,
		}))
	}

	private static processAllDatesWithSellingAndPurchaseLogic(
		dates: string[],
		incomeMap: Map<string, IncomeExpenseRecord[]>,
		expenseMap: Map<string, IncomeExpenseRecord[]>,
		breedingMap: Map<string, BreedingRecord[]>,
	): ProfitLossWithSellingRow[] {
		const resData: ProfitLossWithSellingRow[] = []

		for (const date of dates) {
			let profit = 0
			let loss = 0
			let totalWithoutSellingAndPurchasePrice = 0
			let totalIncomeWithoutSellingPrice = 0
			let totalExpenseWithoutPurchasePrice = 0
			let totalbreedingExpense = 0

			const incomeRecords = incomeMap.get(date) || []
			for (const value1 of incomeRecords) {
				try {
					const answer = JSON.parse(value1?.answer || '[]') as AnswerItem[]
					for (const value of answer) {
						const amount = value?.amount ?? 1
						const price = value.price * amount
						totalIncomeWithoutSellingPrice =
							totalIncomeWithoutSellingPrice + price
					}
				} catch {
					continue
				}
			}

			const breedingRecords = breedingMap.get(date) || []
			for (const value1 of breedingRecords) {
				const answer = Number.parseFloat(value1.answer)
				totalbreedingExpense = totalbreedingExpense + answer
			}

			const expenseRecords = expenseMap.get(date) || []
			for (const value3 of expenseRecords) {
				try {
					const answer = JSON.parse(value3?.answer || '[]') as AnswerItem[]
					for (const valuea of answer) {
						const amount: number = valuea.amount ?? 1
						const price = valuea.price * amount
						totalExpenseWithoutPurchasePrice =
							totalExpenseWithoutPurchasePrice + price
					}
				} catch {
					continue
				}
			}

			totalWithoutSellingAndPurchasePrice =
				totalIncomeWithoutSellingPrice -
				(totalExpenseWithoutPurchasePrice + totalbreedingExpense)

			if (totalWithoutSellingAndPurchasePrice > 0) {
				profit = totalWithoutSellingAndPurchasePrice
			} else {
				loss = totalWithoutSellingAndPurchasePrice
				loss = Math.abs(loss)
			}

			resData.push({
				date: date,
				profitWithSellingAndPurchasePrice: profit.toFixed(2),
				lossWithSellingAndPurchasePrice: Math.floor(loss).toFixed(2),
			})
		}

		return resData
	}

	// milk production quantity graph
	public static async milkProductionQuantityGraphData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkProductionQuantityGraphRow[]> {
		const dates = this.generateDateRange(start_date, end_date)

		// Fetch all data in parallel using raw SQL queries to match
		const [morningData, eveningData] = await Promise.all([
			this.fetchMilkData(user_id, start_date, end_date, 26), // Morning milk
			this.fetchMilkData(user_id, start_date, end_date, 27), // Evening milk
		])

		// Build maps for efficient lookup
		const morningMap = this.buildMilkMap(morningData)
		const eveningMap = this.buildMilkMap(eveningData)

		// Process each date and calculate totals
		return this.processMilkProductionDates(dates, morningMap, eveningMap)
	}

	private static async fetchMilkData(
		user_id: number,
		start_date: string,
		end_date: string,
		question_tag_id: number,
	): Promise<MilkRecord[]> {
		const query = `
            SELECT dqa.daily_record_question_id,
               dqa.answer,
               dqa.answer_date
            FROM daily_record_question_answer dqa
            JOIN daily_record_questions drq ON dqa.daily_record_question_id = drq.id 
            AND drq.delete_status <> 1
            JOIN question_tag_mapping qtm ON qtm.question_id = drq.id 
            AND qtm.deleted_at IS NULL
            WHERE dqa.user_id = ?
            AND qtm.question_tag_id = ?
            AND DATE(dqa.answer_date) BETWEEN ? AND ?
            AND dqa.deleted_at IS NULL
            ORDER BY dqa.answer_date DESC
        `

		const results = (await db.sequelize.query(query, {
			replacements: [user_id, question_tag_id, start_date, end_date],
			type: QueryTypes.SELECT,
		})) as unknown as MilkRecord[]

		return results.map((r) => ({
			daily_record_question_id: r.daily_record_question_id,
			answer: r.answer,
			answer_date: this.formatDate(r.answer_date),
		}))
	}

	private static buildMilkMap(milkData: MilkRecord[]): Map<string, number> {
		const milkMap = new Map<string, number>()

		for (const record of milkData) {
			const date =
				typeof record.answer_date === 'string'
					? record.answer_date.split('T')[0]
					: record.answer_date.toISOString().split('T')[0]

			try {
				const answer = JSON.parse(record?.answer || '[]') as MilkAnswerItem[]
				if (Array.isArray(answer) && answer.length > 0 && answer[0]) {
					const amount = Number.parseFloat(answer[0]?.amount || '0') || 0
					milkMap.set(date, (milkMap.get(date) || 0) + amount)
				}
			} catch {
				continue
			}
		}

		return milkMap
	}

	private static processMilkProductionDates(
		dates: string[],
		morningMap: Map<string, number>,
		eveningMap: Map<string, number>,
	): MilkProductionQuantityGraphRow[] {
		const resData: MilkProductionQuantityGraphRow[] = []

		for (const date of dates) {
			let TotalLitresInMorning = 0
			let TotalLitresInEvening = 0

			TotalLitresInMorning = morningMap.get(date) || 0
			TotalLitresInEvening = eveningMap.get(date) || 0

			resData.push({
				date: date,
				milkProdMorning: TotalLitresInMorning.toFixed(2),
				milkProdEvening: TotalLitresInEvening.toFixed(2),
			})
		}

		return resData
	}

	// fat percentage graph
	public static async fatPercentageGraphData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<FatPercentageGraphRow[]> {
		// Fetch both morning (tag_id: 17) and evening (tag_id: 19) data in parallel
		const [morningRecords, eveningRecords] = await Promise.all([
			this.fetchRecordsByTag(user_id, start_date, end_date, 17),
			this.fetchRecordsByTag(user_id, start_date, end_date, 19),
		])

		// Process records into maps for efficient lookup
		const morningMap = this.processRecordsToMap(morningRecords)
		const eveningMap = this.processRecordsToMap(eveningRecords)

		// Generate date range
		const dates = this.generateDateRange(start_date, end_date)

		// Build result data
		return dates.map((date) => ({
			date,
			totalMorningFat: this.formatNumber(morningMap.get(date) || 0),
			totaleveningFat: this.formatNumber(eveningMap.get(date) || 0),
		}))
	}

	// snf percentage graph
	public static async snfPercentageGraphData(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<SnfPercentageGraphRow[]> {
		// Fetch both morning (tag_id: 18) and evening (tag_id: 20) data in parallel
		const [morningRecords, eveningRecords] = await Promise.all([
			this.fetchRecordsByTag(user_id, start_date, end_date, 18),
			this.fetchRecordsByTag(user_id, start_date, end_date, 20),
		])

		// Process records into maps for efficient lookup
		const morningMap = this.processRecordsToMap(morningRecords)
		const eveningMap = this.processRecordsToMap(eveningRecords)

		// Generate date range
		const dates = this.generateDateRange(start_date, end_date)

		// Build result data
		return dates.map((date) => ({
			date,
			totalMorningSNF: this.formatNumber(morningMap.get(date) || 0),
			totaleveningSNF: this.formatNumber(eveningMap.get(date) || 0),
		}))
	}

	private static async fetchRecordsByTag(
		user_id: number,
		start_date: string,
		end_date: string,
		question_tag_id: number,
	): Promise<QuestionAnswerRecord[]> {
		return (await db.DailyRecordQuestionAnswer.findAll({
			where: {
				user_id,
				answer_date: {
					[Op.between]: [start_date, end_date],
				},
				deleted_at: null,
			},
			attributes: ['answer', 'answer_date'],
			include: [
				{
					model: db.DailyRecordQuestion,
					as: 'DailyRecordQuestion',
					attributes: [],
					required: true,
					include: [
						{
							model: db.QuestionTagMapping,
							as: 'QuestionTagMappings',
							attributes: [],
							where: { question_tag_id, deleted_at: null },
							required: true,
						},
					],
					where: { delete_status: 0 },
				},
			],
			order: [['answer_date', 'DESC']],
			raw: false,
		})) as unknown as QuestionAnswerRecord[]
	}

	private static processRecordsToMap(
		records: QuestionAnswerRecord[],
	): Map<string, number> {
		const resultMap = new Map<string, number>()

		for (const record of records) {
			try {
				const date = this.normalizeDate(record.answer_date)

				const answerArray = JSON.parse(record.answer) as { name: number }[]

				const value = answerArray[0]?.name || 0

				resultMap.set(date, (resultMap.get(date) || 0) + value)
			} catch {
				continue
			}
		}

		return resultMap
	}
	private static normalizeDate(date: Date | string): string {
		if (date instanceof Date) {
			return date.toISOString().split('T')[0]
		}
		return String(date).split('T')[0]
	}

	private static formatNumber(value: number): string {
		return value.toFixed(2)
	}

	// milk aggregate
	public static async milkAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<MilkAggregateAverage> {
		const [morningRecords, eveningRecords, daysCountResult] = await Promise.all(
			[
				// Morning milk query
				db.sequelize.query(
					`
                    SELECT dqa.answer
					FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                    WHERE dqa.user_id = :user_id
                    AND qtm.question_tag_id = 26
                    AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				    AND drq.delete_status <>1
                    ORDER BY dqa.answer_date DESC
                `,
					{
						replacements: { user_id, start_date, end_date },
						type: QueryTypes.SELECT,
					},
				) as unknown as { answer: string }[],

				// Evening milk query
				db.sequelize.query(
					`
                    SELECT dqa.answer
                    FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                    WHERE dqa.user_id = :user_id
                    AND qtm.question_tag_id = 27
                    AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				    AND drq.delete_status <>1
                    ORDER BY dqa.answer_date DESC
                `,
					{
						replacements: { user_id, start_date, end_date },
						type: QueryTypes.SELECT,
					},
				) as unknown as { answer: string }[],

				// Days count query
				db.sequelize.query(
					`
                    SELECT COUNT(DISTINCT DATE(answer_date)) as count
                    FROM daily_record_question_answer
                    WHERE user_id = :user_id
                    AND DATE(answer_date) BETWEEN :start_date AND :end_date
					AND deleted_at IS NULL
                    `,
					{
						replacements: { user_id, start_date, end_date },
						type: QueryTypes.SELECT,
					},
				) as unknown as { count: number }[],
			],
		)

		const noOfDays =
			daysCountResult[0]?.count > 0 ? daysCountResult[0].count : 1

		let TotalLitresInMorning = 0
		let milkProdCostMorning = 0
		// morningRecords.forEach((record: { answer: string }) => {
		for (const record of morningRecords) {
			const answer = JSON.parse(record.answer) as unknown

			if (Array.isArray(answer) && answer.length > 0) {
				const firstRecord = answer[0] as { amount: number; price: number }

				const amount =
					typeof firstRecord?.amount === 'number' ? firstRecord.amount : 0
				const price =
					typeof firstRecord?.price === 'number' ? firstRecord.price : 0

				TotalLitresInMorning += amount
				milkProdCostMorning += price * amount
			}
			// })
		}
		let TotalLitresInEvening = 0
		let milkProdCostEvening = 0
		// eveningRecords.forEach((record) => {
		for (const record of eveningRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer) && answer.length > 0) {
				const firstRecord = answer[0] as { amount: number; price: number }

				const amount =
					typeof firstRecord?.amount === 'number' ? firstRecord.amount : 0
				const price =
					typeof firstRecord?.price === 'number' ? firstRecord.price : 0

				TotalLitresInEvening += amount
				milkProdCostEvening += price * amount
			}
			// })
		}
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
		const [
			expenseRecords,
			greenFeedRecords,
			cattleFeedRecords,
			dryFeedRecords,
			supplementRecords,
			daysCountResult,
		] = await Promise.all([
			// Expense query (question_tag_id = 1)
			db.sequelize.query(
				`
                SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 1
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <>1
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],

			// Green Feed query (question_tag_id = 30)
			db.sequelize.query(
				`
                  SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 30
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <>1
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],

			// Cattle Feed query (question_tag_id = 31)
			db.sequelize.query(
				`
                  SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 31
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <>1
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],

			// Dry Feed query (question_tag_id = 32)
			db.sequelize.query(
				`
                 SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 32
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <>1
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],

			// Supplement query (question_tag_id = 33)
			db.sequelize.query(
				`
                SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL 
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 33
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <>1
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],

			// Days count query
			db.sequelize.query(
				`
                SELECT COUNT(DISTINCT DATE(answer_date)) as count
                FROM daily_record_question_answer
                WHERE user_id = :user_id
                AND DATE(answer_date) BETWEEN :start_date AND :end_date
				AND deleted_at IS NULL
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { count: number }[],
		])

		const noOfDays =
			daysCountResult[0]?.count > 0 ? daysCountResult[0].count : 1

		// Process expense records
		let totalExpense = 0
		// expenseRecords.forEach((record) => {
		for (const record of expenseRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { amount: number | string; price: number | string }) => {
				for (const item of answer as {
					amount: number | string
					price: number | string
				}[]) {
					const rawAmount = item?.amount
					const rawPrice = item?.price

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1

					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					// const price =
					// 	typeof rawPrice === 'number'
					// 		? rawPrice
					// 		: typeof rawPrice === 'string'
					// 			? Number.parseFloat(rawPrice) || 0
					// 			: 0

					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}

					totalExpense += price * amount
					// },
					// )
				}
			}
			// })
		}

		// Process green feed records
		let totalGreenFeed = 0
		let greenFeedQty = 0
		// greenFeedRecords.forEach((record) => {
		for (const record of greenFeedRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { amount: string | number; price: string | number }) => {
				for (const item of answer as Array<{
					amount: string | number
					price: string | number
				}>) {
					const rawAmount = item?.amount
					const rawPrice = item?.price

					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}

					totalGreenFeed += price * amount
					greenFeedQty += amount
					// },
					// )
				}
			}
			// })
		}

		// Process cattle feed records
		let totalCattleFeed = 0
		let cattleFeedQty = 0
		// cattleFeedRecords.forEach((record) => {
		for (const record of cattleFeedRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { amount: string | number; price: string | number }) => {
				for (const item of answer as Array<{
					amount: string | number
					price: string | number
				}>) {
					const rawAmount = item?.amount
					const rawPrice = item?.price

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1

					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					// const price =
					// 	typeof rawPrice === 'number'
					// 		? rawPrice
					// 		: typeof rawPrice === 'string'
					// 			? Number.parseFloat(rawPrice) || 0
					// 			: 0

					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}

					totalCattleFeed += price * amount
					cattleFeedQty += amount
					// },
					// )
				}
			}
			// })
		}

		// Process dry feed records
		let totalDryFeed = 0
		let dryFeedQty = 0
		// dryFeedRecords.forEach((record) => {
		for (const record of dryFeedRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { amount: string | number; price: string | number }) => {
				for (const item of answer) {
					const feedItem = item as FeedItem
					const rawAmount = feedItem?.amount
					const rawPrice = feedItem?.price

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1
					// const price =
					// 	typeof rawPrice === 'number'
					// 		? rawPrice
					// 		: typeof rawPrice === 'string'
					// 			? Number.parseFloat(rawPrice) || 0
					// 			: 0

					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}
					totalDryFeed += price * amount
					dryFeedQty += amount
					// },
					// )
				}
			}
			// })
		}

		// Process supplement records
		let totalSupplement = 0
		let supplementQty = 0
		// supplementRecords.forEach((record) => {
		for (const record of supplementRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { amount: string | number; price: string | number }) => {
				for (const item of answer) {
					const feedItem = item as FeedItem
					const rawAmount = feedItem?.amount
					const rawPrice = feedItem?.price

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1
					// const price =
					// 	typeof rawPrice === 'number'
					// 		? rawPrice
					// 		: typeof rawPrice === 'string'
					// 			? Number.parseFloat(rawPrice) || 0
					// 			: 0

					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}
					totalSupplement += price * amount
					supplementQty += amount
					// },
					// )
				}
			}
			// })
		}
		const otherExpense =
			totalExpense -
			(totalGreenFeed + totalCattleFeed + totalDryFeed + totalSupplement)

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
		const [purchaseRecords, saleRecords] = await Promise.all([
			// Purchase animals query (question_tag_id = 22)
			db.sequelize.query(
				`
                SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 22
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <> 1
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],

			// Sale animals query (question_tag_id = 28)
			db.sequelize.query(
				`
                SELECT dqa.answer
                FROM daily_record_questions drq
                INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                WHERE dqa.user_id = :user_id
                AND qtm.question_tag_id = 28
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
				AND drq.delete_status <> 1
                AND DATE(dqa.answer_date) BETWEEN :start_date AND :end_date
                ORDER BY dqa.answer_date DESC
            `,
				{
					replacements: { user_id, start_date, end_date },
					type: QueryTypes.SELECT,
				},
			) as unknown as { answer: string }[],
		])
		// Process purchase records
		let expenseForPurchaseAnimals = 0
		// purchaseRecords.forEach((record) => {
		for (const record of purchaseRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach((item: { amount: string | number }) => {
				for (const item of answer as { amount: string | number }[]) {
					const rawAmount = item?.amount

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1

					let amount: number

					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}
					expenseForPurchaseAnimals += amount
					// })
				}
			}
			// })
		}

		// Process sale records
		let incomeForSaleAnimals = 0
		// saleRecords.forEach((record) => {
		for (const record of saleRecords) {
			const answer = JSON.parse(record.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach((item: { amount: string | number }) => {
				for (const item of answer as { amount: string | number }[]) {
					const rawAmount = item?.amount

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1

					// Extract nested ternary into independent statement
					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					incomeForSaleAnimals += amount
					// })
				}
			}
			// })
		}

		return {
			income_for_sale_animals: incomeForSaleAnimals.toFixed(2),
			expense_for_purchase_animals: expenseForPurchaseAnimals.toFixed(2),
		}
	}

	// Get milk average aggregate record
	public static async getMilkAverageAggregateRecord(
		user_id: number,
		start_date: string,
		end_date: string,
		animal_number?: string,
	): Promise<MilkAverageAggregateRecord> {
		// Calculate number of days efficiently
		const startDate = new Date(start_date)
		const endDate = new Date(end_date)
		const timeDiff = endDate.getTime() - startDate.getTime()
		const noOfDays = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1

		// Build where clause for main milk query
		const milkWhere: Record<string, unknown> = {
			user_id,
			[Op.and]: [
				db.Sequelize.where(
					db.Sequelize.fn('DATE', db.Sequelize.col('record_date')),
					{ [Op.between]: [start_date, end_date] },
				),
			],
		}

		if (animal_number) {
			milkWhere.animal_number = animal_number
		}
		milkWhere.deleted_at = null

		// Execute both queries in parallel for better performance
		const [milk, animalwise_total] = await Promise.all([
			// Main milk aggregation query
			db.DailyMilkRecord.findOne({
				where: milkWhere,
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
			}) as Promise<{
				t_morning_milk: MilkValue
				t_evening_milk: MilkValue
				t_day_milk: MilkValue
			} | null>,

			// Animal-wise totals query (only when no specific animal_number is provided)
			db.DailyMilkRecord.findAll({
				where: {
					user_id,
					[Op.and]: [
						db.Sequelize.where(
							db.Sequelize.fn('DATE', db.Sequelize.col('record_date')),
							{ [Op.between]: [start_date, end_date] },
						),
					],
					deleted_at: null,
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
			}) as unknown as Promise<{ total: string | number; animal_id: number }[]>,
		])

		// Process animal-wise totals
		let cow_total = 0
		let buffalo_total = 0

		if (animalwise_total && animalwise_total.length > 0) {
			for (const value of animalwise_total) {
				if (value.animal_id === 1) {
					cow_total = Number(value.total) || 0
				} else if (value.animal_id === 2) {
					buffalo_total = Number(value.total) || 0
				}
			}
		}

		// Extract values with proper null handling
		const t_morning = Number(milk?.t_morning_milk ?? 0)
		const t_evening = Number(milk?.t_evening_milk ?? 0)
		const t_total = Number(milk?.t_day_milk ?? 0)

		// Format numbers to 2 decimal places (matching PHP's number_format)
		const formatNumber = (num: number): string => {
			return Number.parseFloat(num.toFixed(2)).toString()
		}

		return {
			aggregate: {
				morning: formatNumber(t_morning),
				evening: formatNumber(t_evening),
				total: formatNumber(t_total),
			},
			average: {
				morning: formatNumber(t_morning / noOfDays),
				evening: formatNumber(t_evening / noOfDays),
				total: formatNumber(t_total / noOfDays),
			},
			total: {
				cow_total: formatNumber(cow_total),
				buffalo_total: formatNumber(buffalo_total),
				total: formatNumber(cow_total + buffalo_total),
			},
		}
	}

	// Aggregate and average for income
	public static async incomeAggregateAverage(
		user_id: number,
		start_date: string,
		end_date: string,
	): Promise<IncomeAggregateAverageResult> {
		// Execute all queries in parallel for better performance
		const [morning, evening, manure, selling, income, daysCount] =
			await Promise.all([
				// Morning milk query (question_tag_id = 26)
				db.sequelize.query(
					`
                    SELECT drq.question, dqa.answer, dqa.answer_date, dqa.daily_record_question_id
                    FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
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
						question: string
						answer: string
						answer_date: string
						daily_record_question_id: number
					}[]
				>,

				// Evening milk query (question_tag_id = 27)
				db.sequelize.query(
					`
                    SELECT drq.question, dqa.answer, dqa.answer_date, dqa.daily_record_question_id
                    FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
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
						question: string
						answer: string
						answer_date: string
						daily_record_question_id: number
					}[]
				>,

				// Manure production query (question_tag_id = 29)
				db.sequelize.query(
					`
                    SELECT drq.question, dqa.answer, dqa.answer_date, dqa.daily_record_question_id, qt.name
                    FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                    INNER JOIN question_tags qt ON qt.id = qtm.question_tag_id AND qt.deleted_at IS NULL
                    WHERE dqa.user_id = :user_id
                    AND qtm.question_tag_id = 29
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
						question: string
						answer: string
						answer_date: string
						daily_record_question_id: number
						name: string
					}[]
				>,

				// Selling price query (question_tag_id = 28) with DISTINCT
				db.sequelize.query(
					`
                    SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
                    FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
                    WHERE dqa.user_id = :user_id
                    AND qtm.question_tag_id = 28
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

				// Income query (question_tag_id = 2) with DISTINCT
				db.sequelize.query(
					`
                    SELECT DISTINCT(dqa.daily_record_question_id), drq.question, dqa.answer, dqa.answer_date
                    FROM daily_record_questions drq
                    INNER JOIN daily_record_question_answer dqa ON dqa.daily_record_question_id = drq.id AND dqa.deleted_at IS NULL
                    INNER JOIN question_tag_mapping qtm ON qtm.question_id = drq.id AND qtm.deleted_at IS NULL
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
				) as unknown as Promise<
					{
						daily_record_question_id: number
						question: string
						answer: string
						answer_date: string
					}[]
				>,

				// Days count query - COUNT DISTINCT answer_date
				db.sequelize.query(
					`
                    SELECT COUNT(DISTINCT(DATE(answer_date))) as count
                    FROM daily_record_question_answer
                    WHERE user_id = :user_id
                    AND DATE(answer_date) BETWEEN :start_date AND :end_date
					AND deleted_at IS NULL
                    `,
					{
						replacements: { user_id, start_date, end_date },
						type: QueryTypes.SELECT,
					},
				) as unknown as Promise<{ count: number }[]>,
			])

		// Initialize variables
		let TotalLitresInMorning = 0
		let TotalLitresInEvening = 0
		let milkProdCostMorning = 0
		let milkProdCostEvening = 0
		let totalmanureProduction = 0
		let totalmanureProductionPrice = 0
		let totalsellingPrice = 0
		let totalIncome = 0

		// Process morning milk data
		// morning.forEach((value) => {
		for (const value of morning) {
			const answer = JSON.parse(value.answer) as unknown
			if (Array.isArray(answer)) {
				const firstItem = answer[0] as {
					amount?: string | number
					price?: string | number
				}
				// const amount =
				// 	typeof firstItem?.amount === 'number'
				// 		? firstItem.amount
				// 		: typeof firstItem?.amount === 'string'
				// 			? Number.parseFloat(firstItem.amount) || 0
				// 			: 0
				// const price =
				// 	typeof firstItem?.price === 'number'
				// 		? firstItem.price
				// 		: typeof firstItem?.price === 'string'
				// 			? Number.parseFloat(firstItem.price) || 0
				// 			: 0

				let amount: number
				if (typeof firstItem?.amount === 'number') {
					amount = firstItem.amount
				} else if (typeof firstItem?.amount === 'string') {
					amount = Number.parseFloat(firstItem.amount) || 0
				} else {
					amount = 0
				}

				let price: number
				if (typeof firstItem?.price === 'number') {
					price = firstItem.price
				} else if (typeof firstItem?.price === 'string') {
					price = Number.parseFloat(firstItem.price) || 0
				} else {
					price = 0
				}

				TotalLitresInMorning += amount
				milkProdCostMorning += price * amount
			}
			// })
		}

		// Process evening milk data
		// evening.forEach((value) => {
		for (const value of evening) {
			const answer = JSON.parse(value.answer) as unknown
			if (Array.isArray(answer)) {
				const firstItem = answer[0] as {
					amount?: string | number
					price?: string | number
				}
				// const amount =
				// 	typeof firstItem?.amount === 'number'
				// 		? firstItem.amount
				// 		: typeof firstItem?.amount === 'string'
				// 			? Number.parseFloat(firstItem.amount) || 0
				// 			: 0
				// const price =
				// 	typeof firstItem?.price === 'number'
				// 		? firstItem.price
				// 		: typeof firstItem?.price === 'string'
				// 			? Number.parseFloat(firstItem.price) || 0
				// 			: 0

				let amount: number
				if (typeof firstItem?.amount === 'number') {
					amount = firstItem.amount
				} else if (typeof firstItem?.amount === 'string') {
					amount = Number.parseFloat(firstItem.amount) || 0
				} else {
					amount = 0
				}

				// Extract price calculation
				let price: number
				if (typeof firstItem?.price === 'number') {
					price = firstItem.price
				} else if (typeof firstItem?.price === 'string') {
					price = Number.parseFloat(firstItem.price) || 0
				} else {
					price = 0
				}

				TotalLitresInEvening += amount
				milkProdCostEvening += price * amount
			}
			// })
		}

		// Process manure production data
		// manure.forEach((value) => {
		for (const value of manure) {
			const answer = JSON.parse(value.answer) as unknown
			if (Array.isArray(answer)) {
				const firstItem = answer[0] as {
					amount?: string | number
					price?: string | number
				}
				// const amount =
				// 	typeof firstItem?.amount === 'number'
				// 		? firstItem.amount
				// 		: typeof firstItem?.amount === 'string'
				// 			? Number.parseFloat(firstItem.amount) || 0
				// 			: 0
				// const price =
				// 	typeof firstItem?.price === 'number'
				// 		? firstItem.price
				// 		: typeof firstItem?.price === 'string'
				// 			? Number.parseFloat(firstItem.price) || 0
				// 			: 0

				let amount: number
				if (typeof firstItem?.amount === 'number') {
					amount = firstItem.amount
				} else if (typeof firstItem?.amount === 'string') {
					amount = Number.parseFloat(firstItem.amount) || 0
				} else {
					amount = 0
				}

				// Extract price calculation
				let price: number
				if (typeof firstItem?.price === 'number') {
					price = firstItem.price
				} else if (typeof firstItem?.price === 'string') {
					price = Number.parseFloat(firstItem.price) || 0
				} else {
					price = 0
				}

				totalmanureProduction += amount
				totalmanureProductionPrice += price * amount
			}
			// })
		}

		// Process selling price data
		// selling.forEach((value) => {
		for (const value of selling) {
			const answer = JSON.parse(value.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { price?: string | number; amount?: string | number }) => {
				for (const item of answer as Array<{
					price?: string | number
					amount?: string | number
				}>) {
					const rawAmount = item?.amount
					const rawPrice = item?.price

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1
					// const price =
					// 	typeof rawPrice === 'number'
					// 		? rawPrice
					// 		: typeof rawPrice === 'string'
					// 			? Number.parseFloat(rawPrice) || 0
					// 			: 0

					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					// Extract nested ternary for price
					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}
					totalsellingPrice += price * amount
					// },
					// )
				}
			}
			// })
		}

		// Process income data
		// income.forEach((value) => {
		for (const value of income) {
			const answer = JSON.parse(value.answer) as unknown
			if (Array.isArray(answer)) {
				// answer.forEach(
				// 	(item: { price?: string | number; amount?: string | number }) => {
				for (const item of answer as Array<{
					price?: string | number
					amount?: string | number
				}>) {
					const rawAmount = item?.amount
					const rawPrice = item?.price

					// const amount =
					// 	typeof rawAmount === 'number'
					// 		? rawAmount
					// 		: typeof rawAmount === 'string'
					// 			? Number.parseFloat(rawAmount) || 1
					// 			: 1
					// const price =
					// 	typeof rawPrice === 'number'
					// 		? rawPrice
					// 		: typeof rawPrice === 'string'
					// 			? Number.parseFloat(rawPrice) || 0
					// 			: 0

					// Extract nested ternary for price
					let amount: number
					if (typeof rawAmount === 'number') {
						amount = rawAmount
					} else if (typeof rawAmount === 'string') {
						amount = Number.parseFloat(rawAmount) || 1
					} else {
						amount = 1
					}

					// Extract nested ternary for price
					let price: number
					if (typeof rawPrice === 'number') {
						price = rawPrice
					} else if (typeof rawPrice === 'string') {
						price = Number.parseFloat(rawPrice) || 0
					} else {
						price = 0
					}

					totalIncome += price * amount
					// },
					// )
				}
			}
			// })
		}

		// Calculate number of days
		const noOfDays = daysCount[0]?.count > 0 ? daysCount[0].count : 1

		// Calculate other income amount (exactly as in PHP)
		const OtherIncomeAmount =
			totalIncome +
			totalsellingPrice -
			(totalmanureProductionPrice +
				milkProdCostMorning +
				milkProdCostEvening +
				totalsellingPrice)

		// Format numbers to match PHP's number_format behavior
		const formatNumber = (num: number): string => {
			return Number.parseFloat(num.toFixed(2)).toString()
		}

		const aggregate = {
			milkProdQtyMorning: formatNumber(TotalLitresInMorning),
			milkProdQtyEvening: formatNumber(TotalLitresInEvening),
			milkProdQtyTotal: formatNumber(
				TotalLitresInMorning + TotalLitresInEvening,
			),
			milkProdCostMorning: formatNumber(milkProdCostMorning),
			milkProdCostEvening: formatNumber(milkProdCostEvening),
			milkProdCostTotal: formatNumber(
				milkProdCostMorning + milkProdCostEvening,
			),
			manureProductionQuantity: formatNumber(totalmanureProduction),
			manureProductionAmount: formatNumber(totalmanureProductionPrice),
			sellingPriceAmount: formatNumber(totalsellingPrice),
			OtherIncomeAmount: formatNumber(OtherIncomeAmount),
		}

		const average = {
			milkProdQtyMorning: formatNumber(TotalLitresInMorning / noOfDays),
			milkProdQtyEvening: formatNumber(TotalLitresInEvening / noOfDays),
			milkProdQtyTotal: formatNumber(
				(TotalLitresInMorning + TotalLitresInEvening) / noOfDays,
			),
			milkProdCostMorning: formatNumber(milkProdCostMorning / noOfDays),
			milkProdCostEvening: formatNumber(milkProdCostEvening / noOfDays),
			milkProdCostTotal: formatNumber(
				(milkProdCostMorning + milkProdCostEvening) / noOfDays,
			),
			manureProductionQuantity: formatNumber(totalmanureProduction / noOfDays),
			manureProductionAmount: formatNumber(
				totalmanureProductionPrice / noOfDays,
			),
			sellingPriceAmount: formatNumber(totalsellingPrice / noOfDays),
			OtherIncomeAmount: formatNumber(OtherIncomeAmount / noOfDays),
		}

		return { aggregate, average }
	}
}
