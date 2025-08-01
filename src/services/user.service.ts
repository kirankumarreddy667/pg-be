import bcrypt from 'bcryptjs'
import db from '@/config/database'
import type { User } from '@/models/user.model'
import type { Role } from '@/models/role.model'
import type { RoleUser } from '@/models/role_user.model'
import type { UserWithLanguage } from '@/types'
import { Op, fn, col, Transaction} from 'sequelize'
import { AnimalQuestionAnswer } from '@/models/animal_question_answers.model'

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

export interface UserAnswerCountResult {
	user_id: number
	name: string
	phone_number: string
	registration_date: Date | string
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
		transaction?: Transaction,
	): Promise<void> {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(newPassword, salt)
		await db.User.update(
			{ password: hashedPassword },
			{ where: { id: userId }, transaction },
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

	private static async fetchSortedUsers(
		sortBy: string,
		status: string,
		roleId: number,
	): Promise<UserWithLanguage[]> {
		if (
			sortBy === 'registered_date' &&
			(status === 'premium' || status === 'free')
		) {
			return db.User.findAll({
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
			}) as Promise<UserWithLanguage[]>
		} else if (sortBy === 'validity_exp_date' && status === 'premium') {
			return db.User.findAll({
				include: [
					{
						model: db.RoleUser,
						where: { role_id: roleId },
						attributes: [],
					},
					// {
					//  model: db.UserPayment,
					//  attributes: ['plan_exp_date'],
					//  required: true,
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
			}) as Promise<UserWithLanguage[]>
		}
		return []
	}

	private static calculateDiffDays(
		registrationDate: Date,
		now: Date,
		type?: string,
		start_date?: string,
		end_date?: string,
	): number {
		if (type === 'all_time' || (!start_date && !end_date)) {
			return (
				Math.floor(
					(now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24),
				) + 1
			)
		}

		if (start_date && end_date) {
			const regDate = registrationDate
			const startDate = new Date(start_date)
			const endDate = new Date(end_date)
			if (regDate > endDate) return 0
			const from = regDate <= startDate ? startDate : regDate
			return (
				Math.floor(
					(endDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
				) + 1
			)
		}
		return (
			Math.floor(
				(now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24),
			) + 1
		)
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
		const users = await this.fetchSortedUsers(sortBy, status, roleId)
		if (!users.length) return []

		const now = new Date()
		return users.map((user) => {
			const expDate = ''
			const registrationDate = user.created_at as Date
			const diffDays = this.calculateDiffDays(
				registrationDate,
				now,
				type,
				start_date,
				end_date,
			)
			const answerDaysCount = 0 // TODO: Replace with actual query
			const dailyRecordUpdateCount = 0 // TODO: Replace with actual query
			const percentage =
				diffDays > 0
					? Number(((answerDaysCount / diffDays) * 100).toFixed(2))
					: 0
			return {
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
			}
		})
	}

	static async getUserAnswerCount({
		type,
		start_date,
		end_date,
	}: {
		type?: string
		start_date?: string
		end_date?: string
	}): Promise<UserAnswerCountResult[]> {
		const roleId = 2
		const now = new Date()
		const whereUser: Record<string, unknown> = {}
		if (type !== 'all_time' && start_date && end_date) {
			whereUser['created_at'] = { [Op.lte]: end_date }
		}
		const users: Pick<User, 'id' | 'name' | 'phone_number' | 'created_at'>[] =
			await db.User.findAll({
				include: [
					{
						model: db.RoleUser,
						where: { role_id: roleId },
						attributes: [],
					},
				],
				where: whereUser,
				attributes: ['id', 'name', 'phone_number', 'created_at'],
				order: [['id', 'ASC']],
				raw: true,
			})

		function calcTotalDaysAllTime(
			created_at: Date | string | undefined,
			now: Date,
		): number {
			if (!created_at) return 1
			return Math.max(
				1,
				Math.ceil(
					(now.getTime() - new Date(created_at).getTime()) /
						(1000 * 60 * 60 * 24),
				),
			)
		}

		function calcTotalDaysRange(start: string, end: string): number {
			const startDate = new Date(start)
			const endDate = new Date(end)
			return Math.max(
				1,
				Math.ceil(
					(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
				) + 1,
			)
		}

		async function getAnswerDaysCount(
			userId: number,
			start?: string,
			end?: string,
		): Promise<number> {
			const where: Record<string, unknown> = { user_id: userId }
			if (start && end) {
				where['created_at'] = { [Op.between]: [start, end] }
			}
			const answerDays = await AnimalQuestionAnswer.findAll({
				where,
				attributes: [[fn('DATE', col('created_at')), 'answer_date']],
				group: [fn('DATE', col('created_at'))],
				raw: true,
			})
			return answerDays.length
		}

		return Promise.all(
			users.map(async (user) => {
				const registration_date = user.created_at ?? ''
				let total_days = 0
				let answer_days_count = 0
				if (type === 'all_time') {
					total_days = calcTotalDaysAllTime(user.created_at, now)
					answer_days_count = await getAnswerDaysCount(user.id)
				} else if (start_date && end_date) {
					total_days = calcTotalDaysRange(start_date, end_date)
					answer_days_count = await getAnswerDaysCount(
						user.id,
						start_date,
						end_date,
					)
				}
				return {
					user_id: user.id ?? 0,
					name: user.name ?? '',
					phone_number: user.phone_number ?? '',
					registration_date,
					total_days,
					answer_days_count,
					percentage: total_days
						? Number(((answer_days_count / total_days) * 100).toFixed(2))
						: 0,
				}
			}),
		)
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
		payment_status,
	}: {
		user_id: number
		payment_status: string
		exp_date: string
		amount?: number
	}): Promise<{ success: boolean; message?: string }> {
		const status = payment_status.toLowerCase()
		if (status !== 'free' && status !== 'premium') {
			return {
				success: false,
				message: 'Invalid payment status. Must be "free" or "premium".',
			}
		}
		await db.User.update({ payment_status: status }, { where: { id: user_id } })
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
		return { success: true }
	}

	static async saveUserDevice(
		userId: number,
		data: {
			firebase_token: string
			device_id: string
			deviceType: string
		},
	): Promise<{ success: boolean; message?: string }> {
		await db.User.update(
			{
				firebase_token: data.firebase_token,
				device_id: data.device_id,
				device_type: data.deviceType,
			},
			{ where: { id: userId } },
		)
		return { success: true, message: 'Device details saved successfully' }
	}
}
