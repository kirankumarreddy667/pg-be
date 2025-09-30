import { Request, Response, NextFunction, RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { ReportsService } from '@/services/reports.service'
import { User } from '@/models/user.model'

export class ReportsController {
	public static readonly animalHealthReport: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.animalHealthReport(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly animalMilkProductionQuantityReport: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { start_date, end_date } = req.params
				const data = await ReportsService.animalMilkProductionQuantityReport(
					user.id,
					start_date,
					end_date,
				)
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Success',
					data,
				})
			} catch (error) {
				next(error)
			}
		}

	public static readonly animalMilkProductionQualityReport: RequestHandler =
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const user = req.user as { id: number } | undefined
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'Unauthorized',
						data: [],
					})
				}
				const { start_date, end_date } = req.params
				const data = await ReportsService.animalMilkProductionQualityReport(
					user.id,
					start_date,
					end_date,
				)
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Success',
					data,
				})
			} catch (error) {
				next(error)
			}
		}

	public static readonly manureProductionReport: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.manureProductionReport(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly profitLossReport: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.profitLossReport(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly summaryReport: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.summaryReport(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly farmInvestmentReport: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { language_id } = req.params
			const data = await ReportsService.farmInvestmentReport(
				user.id,
				Number(language_id),
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly totalExpenseAggregateAverage: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.totalExpenseAggregateAverage(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly healthReportDetails: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.healthReportDetails(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly latestProfitLossReport: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const data = await ReportsService.latestProfitLossReport(user.id)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly animalMilkReportDetails: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}
			const { start_date, end_date } = req.params
			const data = await ReportsService.animalMilkReportDetails(
				user.id,
				start_date,
				end_date,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly pregnantNonPregnantAnimals: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const data = await ReportsService.getPregnantNonPregnantAnimalsCount(user)
			return RESPONSE.SuccessResponse(res, 200, { message: 'success', data })
		} catch (error) {
			next(error)
		}
	}

	public static readonly pregnantNonPregnantAnimalsList: RequestHandler =
		async (req, res, next) => {
			try {
				const user = req.user as User
				if (!user) {
					return RESPONSE.FailureResponse(res, 401, {
						message: 'User not found',
						data: [],
					})
				}
				const data = await ReportsService.getPregnantAnimalsDetails(user)
				return RESPONSE.SuccessResponse(res, 200, { message: 'success', data })
			} catch (error) {
				next(error)
			}
		}

	public static readonly lactatingNonLactatingAnimals: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'User not found',
					data: [],
				})
			}
			const data =
				await ReportsService.getLactatingNonLactatingAnimalsCount(user)
			return RESPONSE.SuccessResponse(res, 200, { message: 'success', data })
		} catch (error) {
			next(error)
		}
	}
}
