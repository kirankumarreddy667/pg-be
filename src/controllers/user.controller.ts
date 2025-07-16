import { RequestHandler, Request, Response } from 'express'
import { UserService } from '@/services/user.service'
import RESPONSE from '@/utils/response'
import type { UserWithLanguage } from '@/types'
import { User } from '@/models/user.model'

export interface UserMapped {
	user_id: number | null
	name: string | null
	email: string | null
	phone_number: string | null
	farm_name: string | null
	address: string | null
	pincode: string | null
	taluka: string | null
	district: string | null
	state_name: string | null
	country: string | null
	payment_status: string | null
	expDate: string | null
	registration_date: string | null
	Daily_record_update_count: number | null
	total_days: number | null
	answer_days_count: number | null
	percentage: number | null
	language_id: number | null
	language_name: string | null
}

export class UserController {
	public static readonly getAllUsers: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const users: UserWithLanguage[] = await UserService.getAllUsers()
			const mappedUsers: UserMapped[] = users.map((user) => {
				let formattedRegistrationDate: string | null = null
				if (user.created_at) {
					if (user.created_at instanceof Date) {
						formattedRegistrationDate = user.created_at
							.toISOString()
							.replace('T', ' ')
							.substring(0, 19)
					} else {
						formattedRegistrationDate = String(user.created_at)
					}
				}
				return {
					user_id: user.id ?? null,
					name: user.name ?? null,
					email: user.email ?? null,
					phone_number: user.phone_number ?? null,
					farm_name: user.farm_name ?? null,
					address: user.address ?? null,
					pincode: user.pincode ?? null,
					taluka: user.taluka ?? null,
					district: user.district ?? null,
					state_name: user.state ?? null,
					country: user.country ?? null,
					payment_status: user.payment_status ?? null,
					expDate: null,
					registration_date: formattedRegistrationDate,
					Daily_record_update_count: null,
					total_days: null,
					answer_days_count: null,
					percentage: null,
					language_id: user.language_id ?? null,
					language_name: user.Language?.name ?? null,
				}
			})

			RESPONSE.SuccessResponse(res, 200, {
				data: mappedUsers,
				message: 'success',
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
			const { status, phone } = req.body as { status?: string; phone?: string }
			// Validation: Only one of status or phone must be provided
			if ((!status && !phone) || (status && phone)) {
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Invalid search',
					data: [],
					status: 200,
				})
			}

			const users: UserWithLanguage[] = await UserService.getFilteredUsers(
				status,
				phone,
			)
			const mappedUsers: UserMapped[] = users.map((user) => {
				let formattedRegistrationDate: string | null = null
				if (user.created_at) {
					if (user.created_at instanceof Date) {
						formattedRegistrationDate = user.created_at
							.toISOString()
							.replace('T', ' ')
							.substring(0, 19)
					} else {
						formattedRegistrationDate = String(user.created_at)
					}
				}
				return {
					user_id: user.id ?? null,
					name: user.name ?? null,
					email: user.email ?? null,
					phone_number: user.phone_number ?? null,
					farm_name: user.farm_name ?? null,
					address: user.address ?? null,
					pincode: user.pincode ?? null,
					taluka: user.taluka ?? null,
					district: user.district ?? null,
					state_name: user.state ?? null,
					country: user.country ?? null,
					payment_status: user.payment_status ?? null,
					expDate: null,
					registration_date: formattedRegistrationDate,
					Daily_record_update_count: null,
					total_days: null,
					answer_days_count: null,
					percentage: null,
					language_id: user.language_id ?? null,
					language_name: user.Language?.name ?? null,
				}
			})

			RESPONSE.SuccessResponse(res, 200, {
				data: mappedUsers,
				message: 'success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly sortUsers: RequestHandler = async (req, res, next) => {
		try {
			const { payment_status, sort_by, start_date, end_date, type } =
				req.body as {
					payment_status: string
					sort_by: string
					start_date?: string
					end_date?: string
					type?: string
				}

			if (!payment_status || !sort_by) {
				return RESPONSE.FailureResponse(res, 400, {
					message: 'payment_status and sort_by are required',
				})
			}

			const users = await UserService.sortUsers({
				payment_status,
				sort_by,
				start_date,
				end_date,
				type,
			})

			return RESPONSE.SuccessResponse(res, 200, {
				data: users,
				message: 'Success',
				status: 200,
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

			if (Number((req.user as User).id) !== Number(req.params.id)) {
				return RESPONSE.FailureResponse(res, 403, {
					message: 'Unauthorized action.',
				})
			}

			const user = await UserService.getUserById(Number(id))
			if (!user) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'User not found',
				})
			}

			let formattedRegistrationDate: string | null = null
			if (user.created_at) {
				if (user.created_at instanceof Date) {
					formattedRegistrationDate = user.created_at
						.toISOString()
						.replace('T', ' ')
						.substring(0, 19)
				} else {
					formattedRegistrationDate = String(user.created_at)
				}
			}

			const mappedUser: UserMapped = {
				user_id: user.id ?? null,
				name: user.name ?? null,
				email: user.email ?? null,
				phone_number: user.phone_number ?? null,
				farm_name: user.farm_name ?? null,
				address: user.address ?? null,
				pincode: user.pincode ?? null,
				taluka: user.taluka ?? null,
				district: user.district ?? null,
				state_name: user.state ?? null,
				country: user.country ?? null,
				payment_status: user.payment_status ?? null,
				expDate: null,
				registration_date: formattedRegistrationDate,
				Daily_record_update_count: null,
				total_days: null,
				answer_days_count: null,
				percentage: null,
				language_id: user.language_id ?? null,
				language_name: user.Language?.name ?? null,
			}

			return RESPONSE.SuccessResponse(res, 200, {
				data: mappedUser,
				message: 'success',
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
			// Uniqueness checks (excluding current user)
			const userId = Number(id)

			const user = await UserService.getUserById(userId)
			if (!user) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'User not found',
				})
			}
			const value = req.body as Partial<User>
			const existingFarm = await UserService.findByFarmName(
				value.farm_name ?? '',
			)
			if (existingFarm && existingFarm.get('id') !== userId) {
				return res.status(422).json({
					message: 'The given data was invalid.',
					errors: { farm_name: ['The farm name has already been taken.'] },
				})
			}
			if (value.email) {
				const existingEmail = await UserService.findByEmail(value.email)
				if (existingEmail && existingEmail.get('id') !== userId) {
					return res.status(422).json({
						message: 'The given data was invalid.',
						errors: { email: ['The email has already been taken.'] },
					})
				}
			}
			// Update user
			const updated = await UserService.updateUserProfile(userId, value)
			return RESPONSE.SuccessResponse(res, 200, {
				data: updated,
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
		try {
			const { user_id, payment_status, exp_date, amount } = req.body as {
				user_id: number
				payment_status: string
				exp_date: string
				amount?: number
			}
			const result = await UserService.updatePaymentStatus({
				user_id,
				payment_status,
				exp_date,
				amount,
			})
			if (result.success) {
				return RESPONSE.SuccessResponse(res, 200, {
					data: [],
					message: 'Success',
				})
			} else {
				return RESPONSE.FailureResponse(res, 400, {
					message: result.message || 'Failed to update payment status.',
				})
			}
		} catch (error) {
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
					message: result.message || 'Device details saved successfully',
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
			const data = await UserService.getUserAnswerCount(
				req.body as {
					type?: string
					start_date?: string
					end_date?: string
				},
			)
			return RESPONSE.SuccessResponse(res, 200, { data, message: 'Success' })
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
