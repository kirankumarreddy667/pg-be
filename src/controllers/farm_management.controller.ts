import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { User } from '@/models/user.model'
import { FarmManagementService } from '@/services/farm_management.service'

export interface FarmDetails {
	user_id?: number
	farm_name: string
	farm_type: string
	farm_type_id: number
	loose_housing: string
	silage: string
	azzola: string
	hydroponics: string
}

export interface InvestmentDetails {
	type_of_investment: number
	amount_in_rs: number
	date_of_installation_or_purchase: Date
}

export class FarmManagementController {
	public static readonly storeFarmDetails: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = Number((req.user as User)?.id)
			const result = await FarmManagementService.storeFarmDetails(
				userId,
				req.body as FarmDetails,
			)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly showFarmDetails: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = Number(req.params.id)
			const result = await FarmManagementService.showFarmDetails(userId)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateFarmDetails: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = Number(req.params.id)
			const result = await FarmManagementService.updateFarmDetails(
				userId,
				req.body as FarmDetails,
			)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly farmTypes: RequestHandler = async (req, res, next) => {
		try {
			const language_id = Number(req.params.language_id)
			const result = await FarmManagementService.farmTypes(language_id)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly storeFixedInvestmentDetails: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = Number((req.user as User)?.id)
			const result = await FarmManagementService.storeFixedInvestmentDetails(
				userId,
				req.body as InvestmentDetails,
			)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly investmentTypes: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const language_id = Number(req.params.language_id)
			const result = await FarmManagementService.investmentTypes(language_id)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly investmentDetailsReport: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = Number(req.params.id)
			const result = await FarmManagementService.investmentDetailsReport(userId)
			RESPONSE.SuccessResponse(res, result.status, {
				message: result.message,
				data: result.data,
			})
		} catch (error) {
			next(error)
		}
	}
}
