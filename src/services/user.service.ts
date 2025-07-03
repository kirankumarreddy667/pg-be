import bcrypt from 'bcryptjs'
import db from '@/config/database'
import type { User } from '@/models/user.model'
import type { Role } from '@/models/role.model'
import type { RoleUser } from '@/models/role_user.model'
import type { UserWithLanguage } from '@/types'

export interface UserSortResult {
	user_id: number
	name: string
	email?: string
	phone_number?: string
	farm_name?: string
	address?: string
	pincode?: string
	taluka?: string
	district?: string
	state?: string
	country?: string
	payment_status?: string
	expDate?: string
	Daily_record_update_count: number
	registration_date?: Date | string
	total_days: number
	answer_days_count: number
	percentage: number
}

export class UserService {
	static async comparePassword(
		candidatePassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		if (!hashedPassword) return false
		return bcrypt.compare(candidatePassword, hashedPassword)
	}

	static async getUserRoles(user_id: number): Promise<Role[]> {
		// Get all role_user entries for the user
		const roleUsers: RoleUser[] = await db.RoleUser.findAll({
			where: { user_id },
		})

		// Extract role_ids
		const roleIds = roleUsers.map((ru: RoleUser) => ru.get('role_id'))
		if (roleIds.length === 0) return []

		// Fetch roles from Role table
		const roles: Role[] = await db.Role.findAll({
			where: { id: roleIds },
		})
		return roles
	}

	static async findUserByPhone(phone_number: string): Promise<User | null> {
		return db.User.findOne({
			where: {
				phone_number: phone_number,
			},
		})
	}

	static async updatePassword(
		userId: number,
		newPassword: string,
	): Promise<void> {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(newPassword, salt)
		await db.User.update(
			{ password: hashedPassword },
			{ where: { id: userId } },
		)
	}

	static async updateUserLanguage(
		userId: number,
		language_id: number,
	): Promise<User | null> {
		const user = await db.User.findByPk(userId)
		if (!user) return null
		await user.update({ language_id })
		return user
	}

	static async getAllUsers(): Promise<User[]> {
		return db.User.findAll({
			attributes: [
				'id',
				'name',
				'email',
				'phone_number',
				'farm_name',
				'address',
				'pincode',
				'taluka',
				'district',
				'state',
				'country',
				'payment_status',
				'record_milk_refresh',
				'language_id',
				'created_at',
				'updated_at',
			],
			include: [
				{
					model: db.Language,
					attributes: ['name'],
					as: 'Language',
				},
			],
			raw: true,
			nest: true,
		})
	}

	static async getFilteredUsers(
		status?: string,
		phone?: string,
	): Promise<UserWithLanguage[]> {
		const where: Record<string, unknown> = {}
		if (status) where.payment_status = status
		if (phone) where.phone_number = phone
		return db.User.findAll({
			where,
			attributes: [
				'id',
				'name',
				'email',
				'phone_number',
				'farm_name',
				'address',
				'pincode',
				'taluka',
				'district',
				'state',
				'country',
				'payment_status',
				'record_milk_refresh',
				'language_id',
				'created_at',
				'updated_at',
			],
			include: [
				{
					model: db.Language,
					attributes: ['name'],
					as: 'Language',
				},
			],
			raw: true,
			nest: true,
		})
	}

	static async sortUsers({
		payment_status,
		sort_by,
		start_date,
		end_date,
		type,
	}: {
		payment_status: string
		sort_by: string
		start_date?: string
		end_date?: string
		type?: string
	}): Promise<UserSortResult[]> {
		const status = payment_status.toLowerCase()
		const sortBy = sort_by.toLowerCase()
		const roleId = 2
		let users: UserWithLanguage[] = []

		if (
			sortBy === 'registered_date' &&
			(status === 'premium' || status === 'free')
		) {
			users = (await db.User.findAll({
				include: [
					{
						model: db.RoleUser,
						where: { role_id: roleId },
						attributes: [],
					},
				],
				where: { payment_status: status },
				order: [['created_at', 'DESC']],
				attributes: [
					'id',
					'name',
					'email',
					'phone_number',
					'farm_name',
					'address',
					'pincode',
					'taluka',
					'district',
					'state',
					'country',
					'payment_status',
					'created_at',
				],
				raw: true,
				nest: true,
			})) as UserWithLanguage[]
		} else if (sortBy === 'validity_exp_date' && status === 'premium') {
			users = (await db.User.findAll({
				include: [
					{
						model: db.RoleUser,
						where: { role_id: roleId },
						attributes: [],
					},
					// {
					// 	model: db.UserPayment,
					// 	attributes: ['plan_exp_date'],
					// 	required: true,
					// },
				],
				where: { payment_status: status },
				// order: [[db.UserPayment, 'plan_exp_date', 'DESC']],
				attributes: [
					'id',
					'name',
					'email',
					'phone_number',
					'farm_name',
					'address',
					'pincode',
					'taluka',
					'district',
					'state',
					'country',
					'payment_status',
					'created_at',
				],
				raw: true,
				nest: true,
			})) as UserWithLanguage[]
		} else {
			return []
		}

		const now = new Date()
		const result: UserSortResult[] = []
		for (const user of users) {
			// const userId = user.id
			const expDate = ''
			// if (
			// 	status === 'premium'
			// 	user.UserPayment &&
			// 	user.UserPayment.plan_exp_date
			// ) {
			// 	expDate = user.UserPayment.plan_exp_date
			// }

			const registrationDate = user.created_at
			let date1: Date,
				date2: Date,
				diffDays = 0
			if (type === 'all_time') {
				date1 = new Date(registrationDate as Date)
				date2 = now
				diffDays =
					Math.floor(
						(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
					) + 1
			} else if (start_date && end_date) {
				const regDate = new Date(registrationDate as Date)
				const startDate = new Date(start_date)
				const endDate = new Date(end_date)
				if (regDate <= new Date(end_date)) {
					if (regDate <= new Date(start_date)) {
						date1 = startDate
						date2 = endDate
						diffDays =
							Math.floor(
								(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
							) + 1
					} else {
						date1 = regDate
						date2 = endDate
						diffDays =
							Math.floor(
								(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
							) + 1
					}
				} else {
					diffDays = 0
				}
			} else {
				date1 = new Date(registrationDate as Date)
				date2 = now
				diffDays =
					Math.floor(
						(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
					) + 1
			}

			// Daily record answer count (stub, replace with real query if model exists)
			const answerDaysCount = 0
			// TODO: Replace with actual query to count distinct answer days for the user
			// let answerDaysCount = await db.DailyRecordAnswer.count({ ... })

			// Daily record update count (stub, replace with real query if model exists)
			const dailyRecordUpdateCount = 0
			// TODO: Replace with actual query to count distinct answer days for the user

			const percentage =
				diffDays > 0
					? Number(((answerDaysCount / diffDays) * 100).toFixed(2))
					: 0

			result.push({
				user_id: user.id ?? 0,
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
				payment_status: user.payment_status ?? '',
				expDate,
				Daily_record_update_count: dailyRecordUpdateCount,
				registration_date: registrationDate,
				total_days: diffDays,
				answer_days_count: answerDaysCount,
				percentage,
			})
		}
		return result
	}

	static async getUserById(id: number): Promise<UserWithLanguage | null> {
		return db.User.findOne({
			where: { id },
			attributes: [
				'id',
				'name',
				'email',
				'phone_number',
				'farm_name',
				'address',
				'pincode',
				'taluka',
				'district',
				'state',
				'country',
				'payment_status',
				'record_milk_refresh',
				'language_id',
				'created_at',
				'updated_at',
			],
			include: [
				{
					model: db.Language,
					attributes: ['name'],
					as: 'Language',
				},
			],
			raw: true,
			nest: true,
		})
	}

	static async findByFarmName(farm_name: string): Promise<User | null> {
		return db.User.findOne({ where: { farm_name } })
	}

	static async findByEmail(email: string): Promise<User | null> {
		return db.User.findOne({ where: { email } })
	}

	static async updateUserProfile(
		id: number,
		fields: Partial<User>,
	): Promise<User | null> {
		const user = await db.User.findByPk(id)
		if (!user) return null
		await user.update(fields)
		return user
	}

	static async updatePaymentStatus({
		user_id,
		payment_status
	}: {
		user_id: number
		payment_status: string
		exp_date: string
		amount?: number
	}): Promise<{ success: boolean; message?: string }> {
		const status = payment_status.toLowerCase();
		if (status !== 'free' && status !== 'premium') {
			return { success: false, message: 'Invalid payment status. Must be "free" or "premium".' };
		}
		await db.User.update({ payment_status: status }, { where: { id: user_id } });
		// Premium plan logic is commented out until UserPlanPayment model is available
		/*
		if (status === 'premium') {
			let userPlan = await db.UserPlanPayment.findOne({ where: { user_id }, order: [['created_at', 'DESC']] });
			if (userPlan) {
				await userPlan.update({ plan_exp_date: exp_date, payment_history_id: 0, amount: amount ?? 0 });
			} else {
				await db.UserPlanPayment.create({
					user_id,
					plan_id: 1,
					amount: amount ?? 0,
					num_of_valid_years: 1,
					plan_exp_date: exp_date,
					payment_history_id: 0,
					created_at: new Date()
				});
			}
		}
		*/
		return { success: true };
	}
}
