import fs from 'node:fs'
import path from 'node:path'
import ejs from 'ejs'
import {
	MilkProductionQuantityRow,
	ProfitLossGraphRow,
	ProfitLossRow,
	IncomeExpenseResult,
	MilkReportRow,
	AnimalBreedingHistoryResult,
	AllAnimalBreedingHistoryResult,
	MilkProductionRow,
} from '../services/report.service'

const businessCredentialsTemplate = fs.readFileSync(
	path.join(__dirname, '../views/business/businessCredentials.ejs'),
	'utf-8',
)

const healthReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/healthReportPDF.ejs'),
	'utf-8',
)

const manureProductionTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/manureProductionPDF.ejs'),
	'utf-8',
)

const milkProductionQualityTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/milkProductionQualityPDF.ejs'),
	'utf-8',
)

const animalMilkProductionQuantityTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/milkProductionQuantityPDF.ejs'),
	'utf-8',
)
const profitLossGraphWithSellingAndPurcahsePriceTemplate = fs.readFileSync(
	path.join(
		__dirname,
		'../views/reports/profitLossWithSellingAndPurchasePricePDF.ejs',
	),
	'utf-8',
)
const profitLossTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/profitLossPDF.ejs'),
	'utf-8',
)
const incomeExpenseTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/incomeExpensePDF.ejs'),
	'utf-8',
)

const milkReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/dailyMilkReportPDF.ejs'),
	'utf-8',
)
const fixedInvestmentReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/fixedInvestmentReportPDF.ejs'),
	'utf-8',
)
const breedingReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/breedingReportPDF.ejs'),
	'utf-8',
)

const profileReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/animalProfileCertificate.ejs'),
	'utf-8',
)
const animalBreedingHistoryReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/animalBreedingHistoryPDF.ejs'),
	'utf-8',
)
const allAnimalBreedingHistoryReportTemplate = fs.readFileSync(
	path.join(__dirname, '../views/reports/allAnimalBreedingHistoryPDF.ejs'),
	'utf-8',
)

const enquiryNotificationTemplate = fs.readFileSync(
	path.join(__dirname, '../views/enquiry/enquiryNotification.ejs'),
	'utf-8',
)

const planPaymentSuccessTemplate = fs.readFileSync(
	path.join(__dirname, '../views/payment/planPaymentSuccess.ejs'),
	'utf-8',
)

const adminPlanPaymentSuccessTemplate = fs.readFileSync(
	path.join(__dirname, '../views/payment/adminPlanPaymentSuccess.ejs'),
	'utf-8',
)

const report = fs.readFileSync(
	path.join(__dirname, '../views/reports/report.ejs'),
	'utf-8',
)

export interface EmailTemplateMap {
	businessCredentials: { name: string; phone: string; password: string }
	report: { user: string; report_type: string }
	helathReport: {
		animalHealthData: {
			total_cost_of_treatment: number | string
			data: Array<{
				date: string
				animal_number: string
				diseasName: string
				details_of_treatment: string
				milk_loss_in_litres: string | number
				font: string
			}>
		}
	}
	manureProductionReport: {
		manureProductionData: Array<{
			answer_date: string
			total_manure_production_in_KG: string | number
			rate_per_kg: string | number
			total_in_rupees: string | number
		}>
	}
	milkProductionQualityReport: {
		milkProductionQualityData: MilkProductionRow[]
	}
	animalMilkProductionQuantityReport: {
		milkProductionData: MilkProductionQuantityRow[]
	}
	profitLossGraphWithSellingAndPurchasePriceReport: {
		profitLossGraphData: ProfitLossGraphRow[]
	}
	profitLossReport: { profitLossData: ProfitLossRow[] }
	incomeExpenseReport: { incomeExpense: IncomeExpenseResult }
	milkReport: {
		milkReportPDF: {
			animal_number: string | null
			cow_daily_milk: MilkReportRow[]
			buffalo_daily_milk: MilkReportRow[]
			relevent_total: Record<string, unknown>
			daywise_sub_total: Record<string, unknown>
		}
	}
	fixedInvestmentReport: {
		fixedInvestmentData: {
			reportData: {
				type_of_investment: string
				amount_in_rs: string
				date_of_installation_or_purchase: string
				age_in_year: string
			}[]
			total_investment: string
			number_of_investments: number
		}
	}
	breedingReport: {
		responseData: {
			pregnant: Record<string, unknown>
			non_pregnant: Record<string, unknown>
		}
	}
	profileReport: {
		profileData: {
			profile_img: { image: string }
			general: Record<string, unknown>
			breeding_details: Record<string, unknown>
			milk_details: Record<string, unknown>
			vaccination_details: { type: string; date: string }[]
			pedigree: Record<string, unknown>
		}
	}
	animalBreedingHistoryReport: { reportData: AnimalBreedingHistoryResult }
	allAnimalBreedingHistoryReport: { reportData: AllAnimalBreedingHistoryResult }
	enquiryNotification: {
		first_name: string
		last_name?: string
		email: string
		phone: string
		query: string
	}
	planPaymentSuccess: {
		name: string
		quantity?: number
		amount: number
		coupon: string
		coupon_code: string
		offer: string
		offer_name: string
		month_year: string
	}
	adminPlanPaymentSuccess: {
		plan_name: string
		quantity?: number
		name: string
		email: string
		phone: string
		amount: number
		coupon_code: string
		offer_name: string
		month_year: string
	}
}

export const emailTemplates: {
	[K in keyof EmailTemplateMap]: (data: EmailTemplateMap[K]) => string
} = {
	businessCredentials: (data) => ejs.render(businessCredentialsTemplate, data),
	report: (data) => ejs.render(report, data),
	helathReport: (data) => ejs.render(healthReportTemplate, data),
	manureProductionReport: (data) => ejs.render(manureProductionTemplate, data),
	animalMilkProductionQuantityReport: (data) =>
		ejs.render(animalMilkProductionQuantityTemplate, data),
	profitLossGraphWithSellingAndPurchasePriceReport: (data) =>
		ejs.render(profitLossGraphWithSellingAndPurcahsePriceTemplate, data),
	profitLossReport: (data) => ejs.render(profitLossTemplate, data),
	incomeExpenseReport: (data) => ejs.render(incomeExpenseTemplate, data),
	milkProductionQualityReport: (data) =>
		ejs.render(milkProductionQualityTemplate, data),
	milkReport: (data) => ejs.render(milkReportTemplate, data),
	fixedInvestmentReport: (data) =>
		ejs.render(fixedInvestmentReportTemplate, data),
	breedingReport: (data) => ejs.render(breedingReportTemplate, data),
	profileReport: (data) => ejs.render(profileReportTemplate, data),
	animalBreedingHistoryReport: (data) =>
		ejs.render(animalBreedingHistoryReportTemplate, data),
	allAnimalBreedingHistoryReport: (data) =>
		ejs.render(allAnimalBreedingHistoryReportTemplate, data),
	enquiryNotification: (data) => ejs.render(enquiryNotificationTemplate, data),
	planPaymentSuccess: (data) => ejs.render(planPaymentSuccessTemplate, data),
	adminPlanPaymentSuccess: (data) =>
		ejs.render(adminPlanPaymentSuccessTemplate, data),
}
