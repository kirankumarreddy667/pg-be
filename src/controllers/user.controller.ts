import { RequestHandler } from 'express'
import { UserService } from '@/services/user.service'
import RESPONSE from '@/utils/response'
import type { UserWithLanguage } from '@/types'

export interface UserMapped {
	user_id: number | null;
	name: string | null;
	email: string | null;
	phone_number: string | null;
	farm_name: string | null;
	address: string | null;
	pincode: string | null;
	taluka: string | null;
	district: string | null;
	state_name: string | null;
	country: string | null;
	payment_status: string | null;
	expDate: string | null;
	registration_date: string | null;
	Daily_record_update_count: number | null;
	total_days: number | null;
	answer_days_count: number | null;
	percentage: number | null;
	language_id: number | null;
	language_name: string | null;
}

export class UserController {
	static getAllUsers: RequestHandler = async (req, res, next) => {
		try {
			const users: UserWithLanguage[] = await UserService.getAllUsers()
			const mappedUsers: UserMapped[] = users.map((user) => ({
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
				registration_date: user.created_at
					? (user.created_at instanceof Date
						? user.created_at.toISOString().replace('T', ' ').substring(0, 19)
						: String(user.created_at))
					: null,
				Daily_record_update_count: null,
				total_days: null,
				answer_days_count: null,
				percentage: null,
				language_id: user.language_id ?? null,
				language_name: user.Language?.name ?? null,
			}))

			RESPONSE.SuccessResponse(res, 200, {
				data: mappedUsers,
				message: 'success',
			})
		} catch (error) {
			next(error)
		}
	}

	static getFilteredUsers: RequestHandler = async (req, res, next) => {
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
					registration_date: user.created_at
						? (user.created_at instanceof Date
							? user.created_at.toISOString().replace('T', ' ').substring(0, 19)
							: String(user.created_at))
						: null,
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

	static sortUsers: RequestHandler = async (req, res, next) => {
		try {
            const { payment_status, sort_by, start_date, end_date, type } = req.body as {
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
                status: 200
			})
		} catch (error) {
			next(error)
		}
	}
}
