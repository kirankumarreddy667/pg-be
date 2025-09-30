import { RequestHandler, Request, Response } from 'express'
import { UserService } from '@/services/user.service'
import RESPONSE from '@/utils/response'
import { User } from '@/models/user.model'
import { ValidationRequestError } from '@/utils/errors'
import db from '@/config/database'
import { Transaction } from 'sequelize'

export interface UserMapped {
	user_id: number
	name: string
	email: string
	phone_number: string
	farm_name: string
	address: string
	pincode: string
	taluka: string
	district: string
	state: string
	country: string
	village: string
}

export class UserController {
	public static readonly getAllUsers: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const page = Number(req.query.page) || 1
			const limit = Number(req.query.limit) || 10
			const { data, pagination } = await UserService.getAllUsers(page, limit)

			RESPONSE.SuccessResponse(res, 200, {
				data,
				message: 'Success',
				pagination,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getFilteredUsers: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { status, phone, type, start_date, end_date, page, limit } =
				req.body as {
					status?: string
					phone?: string
					type?: string
					start_date?: string
					end_date?: string
					page?: number
					limit?: number
				}

			if ((!status && !phone) || (status && phone)) {
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Invalid search',
					data: [],
					status: 200,
				})
			}

			const { data: users, pagination } = await UserService.getFilteredUsers({
				status,
				phone,
				type,
				start_date,
				end_date,
				page_number: page || 1,
				limit_number: limit || 10,
			})

			RESPONSE.SuccessResponse(res, 200, {
				data: users,
				message: 'Success',
				pagination,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly sortUsers: RequestHandler = async (req, res, next) => {
		try {
			const {
				payment_status,
				sort_by,
				start_date,
				end_date,
				type,
				page,
				limit,
			} = req.body as {
				payment_status: string
				sort_by: string
				start_date?: string
				end_date?: string
				type?: string
				page: number
				limit: number
			}

			if (!payment_status || !sort_by) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'payment_status and sort_by are required',
				})
			}

			const { data: users, pagination } = await UserService.sortUsers({
				payment_status,
				sort_by,
				start_date,
				end_date,
				type,
				page_number: page || 1,
				limit_number: limit || 10,
			})

			return RESPONSE.SuccessResponse(res, 200, {
				data: users,
				message: 'Success',
				status: 200,
				pagination,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getUserById: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params

			const user = await UserService.getUserById(Number(id))
			if (!user) {
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Success',
					data: [],
				})
			}

			const mappedUser: UserMapped = {
				user_id: Number(user.id),
				name: user.name ?? '',
				email: user.email ?? '',
				phone_number: user.phone_number ?? '',
				farm_name: user.farm_name ?? '',
				address: user.address ?? '',
				pincode: user.pincode ?? '',
				taluka: user.taluka ?? '',
				district: user.district ?? '',
				state: user.state ?? '',
				country: user.country ?? '',
				village: user.village ?? '',
			}

			return RESPONSE.SuccessResponse(res, 200, {
				data: mappedUser,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateProfile: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params
			if (Number((req.user as User).id) !== Number(id)) {
				return RESPONSE.FailureResponse(res, 403, {
					message: 'Unauthorized action.',
				})
			}
			const userId = Number(id)

			const value = req.body as Partial<User>
			const existingFarm = await UserService.findByFarmName(
				value.farm_name ?? '',
			)
			if (existingFarm && existingFarm.get('id') !== userId) {
				throw new ValidationRequestError({
					farm_name: ['The farm name has already been taken.'],
				})
			}
			if (value.email) {
				const existingEmail = await UserService.findByEmail(value.email)
				if (existingEmail && existingEmail.get('id') !== userId) {
					throw new ValidationRequestError({
						email: ['The email has already been taken.'],
					})
				}
			}

			const updated = await UserService.updateUserProfile(userId, value)
			if (!updated)
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found',
				})
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updatePaymentStatus: RequestHandler = async (
		req,
		res,
		next,
	) => {
		const transaction: Transaction = await db.sequelize.transaction()

		try {
			const { user_id, payment_status, exp_date, amount } = req.body as {
				user_id: number
				payment_status: string
				exp_date: Date
				amount?: number
				transaction?: Transaction
			}

			const user = await db.User.findOne({
				where: { id: user_id, deleted_at: null },
			})
			if (!user)
				throw new ValidationRequestError({
					user_id: ['The selected user id is invalid.'],
				})
			const result = await UserService.updatePaymentStatus({
				user_id,
				payment_status,
				exp_date,
				amount,
				transaction,
			})
			if (result.success) {
				await transaction.commit()
				return RESPONSE.SuccessResponse(res, 200, {
					data: [],
					message: 'Success',
				})
			} else {
				await transaction.rollback()
				return RESPONSE.FailureResponse(res, 400, {
					message: result.message || 'Something went wrong. Please try again',
				})
			}
		} catch (error) {
			await transaction.rollback()
			next(error)
		}
	}

	public static readonly saveUserDevice: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const userId = (req.user as User).id

			const user = await UserService.getUserById(Number(userId))
			if (!user) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'User not found',
				})
			}
			const { firebase_token, device_id, deviceType } = req.body as {
				firebase_token: string
				device_id: string
				deviceType: string
			}

			const result = await UserService.saveUserDevice(userId, {
				firebase_token,
				device_id,
				deviceType,
			})

			if (result.success) {
				return RESPONSE.SuccessResponse(res, 200, {
					data: [],
					message: result.message || 'Success',
				})
			} else {
				return RESPONSE.FailureResponse(res, 400, {
					message: result.message || 'Failed to save device details',
				})
			}
		} catch (error) {
			next(error)
		}
	}

	public static readonly getUserAnswerCount: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { type, start_date, end_date } = req.body as {
				type?: string
				start_date?: string
				end_date?: string
			}

			// Mirror PHP validation exactly:
			// PHP allows: type='all_time' OR (start_date AND end_date)
			if (type !== 'all_time' && (!start_date || !end_date)) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Invalid Search',
				})
			}

			// Additional validation: if type is not 'all_time', require both dates
			if (type && type !== 'all_time' && (!start_date || !end_date)) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'Invalid Search',
				})
			}

			const data = await UserService.getUserAnswerCount({
				type,
				start_date,
				end_date,
			})

			return RESPONSE.SuccessResponse(res, 200, {
				data,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly hideAddUpdateSection: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user_id = (req.user as User).id
			const user = await UserService.getUserById(user_id)
			if (!user) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'User not found',
				})
			}
			const result = await UserService.hideAddUpdateSection(user_id)
			return RESPONSE.SuccessResponse(res, 200, {
				data: result,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}

export const redirectUser = (req: Request, res: Response): void => {
	res.redirect(
		'https://play.google.com/store/apps/details?id=com.app.powergotha',
	)
}
