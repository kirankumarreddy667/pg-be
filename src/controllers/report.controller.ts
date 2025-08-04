import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ReportService } from '@/services/report.service'
import RESPONSE from '@/utils/response'

export class ReportController {
	public static readonly profitLossGraphReport: RequestHandler = async (
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
			const data = await ReportService.profitLossGraphReport(
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

	public static readonly milkProductionQuantityGraphData: RequestHandler =
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
				const data = await ReportService.milkProductionQuantityGraphData(
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

	public static readonly fatPercentageGraphData: RequestHandler = async (
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
			const data = await ReportService.fatPercentageGraphData(
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

	public static readonly snfPercentageGraphData: RequestHandler = async (
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
			const data = await ReportService.snfPercentageGraphData(
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

	public static readonly profitLossGraphWithSellingAndPurchasePrice: RequestHandler =
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
				const data =
					await ReportService.profitLossGraphWithSellingAndPurchasePrice(
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

	public static readonly milkAggregateAverage: RequestHandler = async (
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
			const data = await ReportService.milkAggregateAverage(
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

	public static readonly expenseAggregateAverage: RequestHandler = async (
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
			const data = await ReportService.expenseAggregateAverage(
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

	public static readonly incomeAggregateAverage: RequestHandler = async (
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
			const data = await ReportService.incomeAggregateAverage(
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

	public static readonly incomeExpenseOnSalePurchaseAnimal: RequestHandler =
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
				const data = await ReportService.incomeExpenseOnSalePurchaseAnimal(
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

	public static readonly getMilkAverageAggregateRecord: RequestHandler = async (
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
			const animal_number = req.query.animal_number as string | undefined
			const data = await ReportService.getMilkAverageAggregateRecord(
				user.id,
				start_date,
				end_date,
				animal_number,
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

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
			const data = await ReportService.animalHealthReport(
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
				const data = await ReportService.animalMilkProductionQuantityReport(
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
				const data = await ReportService.animalMilkProductionQualityReport(
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
			const data = await ReportService.manureProductionReport(
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
			const data = await ReportService.profitLossReport(
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
			const data = await ReportService.summaryReport(
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
			const data = await ReportService.farmInvestmentReport(
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
			const data = await ReportService.totalExpenseAggregateAverage(
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
			const data = await ReportService.healthReportDetails(
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
			const data = await ReportService.latestProfitLossReport(user.id)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
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
			const data = await ReportService.animalMilkReportDetails(
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

	public static readonly generatePdf: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as { id: number } | undefined
			if (!user) {
				return RESPONSE.FailureResponse(res, 401, {
					message: 'Unauthorized',
					data: [],
				})
			}

			const report = await ReportService.generatePdf(
				user.id,
				req.body as {
					report_type: string
					email: string
					start_date?: string
					end_date?: string
					animal_id?: number
					animal_number?: string
				},
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: report,
			})
		} catch (error) {
			next(error)
		}
	}
}
