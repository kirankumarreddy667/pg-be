import bcrypt from 'bcryptjs'
import db from '@/config/database'
import type { User } from '@/models/user.model'
import type { Role } from '@/models/role.model'
import type { RoleUser } from '@/models/role_user.model'
import type { Pagination, UserWithLanguage } from '@/types'
import { Transaction, QueryTypes } from 'sequelize'
import { ValidationError, ValidationRequestError } from '@/utils/errors'
import moment from 'moment-timezone'

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
	percentage: number | string
}

export interface UserAnswerCountResult {
	user_id: number
	name: string
	phone_number: string
	registration_date: Date | string
	total_days: number
	answer_days_count: number
	percentage?: number | string
}

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
	state_name: string
	country: string
	payment_status: string
	expDate: string
	Daily_record_update_count: number
	language_id: number
	language_name: string
}

export interface FilteredUser {
	user_id: number
	name: string
	email: string
	phone_number: string
	farm_name: string
	address: string
	pincode: string
	taluka: string
	district: string
	state_name: string
	country: string
	payment_status: string
	expDate: string
	registration_date: string | null
	Daily_record_update_count: number
	total_days: number
	answer_days_count: number
	percentage: string
	language_id: number
	language_name: string
}

interface UserAttributes {
	id: number
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
	payment_status: string
	language_id: number
	created_at: string
	registration_date: Date
	Daily_record_update_count: number
	expDate: string
	Language: {
		name: string
	}
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
		const roleUsers: RoleUser[] = await db.RoleUser.findAll({
			where: { user_id },
		})

		const roleIds = roleUsers.map((ru: RoleUser) => ru.get('role_id'))
		if (roleIds.length === 0) return []

		const roles: Role[] = await db.Role.findAll({
			where: { id: roleIds, deleted_at: null },
		})
		return roles
	}

	static async findUserByPhone(phone_number: string): Promise<User | null> {
		return db.User.findOne({
			where: {
				phone_number: phone_number,
				deleted_at: null,
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
		const user = await db.User.findOne({
			where: { id: userId, deleted_at: null },
		})
		if (!user) return null
		await user.update({ language_id })
		return user
	}

	private static calculatePagination(
		page: number,
		limit: number,
		totalItems: number,
	): Pagination {
		const totalPages = Math.ceil(totalItems / limit)
		const hasNextPage = page < totalPages
		const hasPrevPage = page > 1

		return {
			currentPage: page,
			totalPages,
			totalItems,
			itemsPerPage: limit,
			hasNextPage,
			hasPrevPage,
		}
	}

	private static normalizePaginationParams(
		page?: number,
		limit?: number,
	): { page: number; limit: number; offset: number } {
		const normalizedPage = Math.max(1, page || 1)
		const normalizedLimit = Math.min(Math.max(1, limit || 10), 1000)
		const offset = (normalizedPage - 1) * normalizedLimit

		return { page: normalizedPage, limit: normalizedLimit, offset }
	}

	static async getAllUsers(
		page_number: number,
		limit_number: number,
	): Promise<{
		data: UserMapped[]
		pagination: {
			currentPage: number
			totalPages: number
			totalItems: number
			itemsPerPage: number
			hasNextPage: boolean
			hasPrevPage: boolean
		}
	}> {
		const { page, limit, offset } = this.normalizePaginationParams(
			page_number,
			limit_number,
		)
		const users = (await db.User.findAll({
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
				'language_id',
				'created_at',
				[
					db.Sequelize.fn(
						'COUNT',
						db.Sequelize.fn(
							'DISTINCT',
							db.Sequelize.col('UserDailyRecordQuestionAnswer.answer_date'),
						),
					),
					'Daily_record_update_count',
				],
				[
					db.Sequelize.fn('MAX', db.Sequelize.col('UserPayment.plan_exp_date')),
					'expDate',
				],
			],
			include: [
				{
					model: db.Language,
					attributes: ['name'],
					where: { deleted_at: null },
					as: 'Language',
				},
				{
					model: db.RoleUser,
					attributes: ['role_id'],
					where: { role_id: 2 },
					as: 'role_users',
					required: true,
				},
				{
					model: db.UserPayment,
					where: { deleted_at: null },
					attributes: ['plan_exp_date'],
					as: 'UserPayment',
				},
				{
					model: db.DailyRecordQuestionAnswer,
					where: { deleted_at: null },
					attributes: ['answer_date'],
					as: 'UserDailyRecordQuestionAnswer',
				},
			],
			group: ['User.id', 'Language.id', 'Language.name'],
			limit,
			offset,
			raw: true,
			nest: true,
		})) as unknown as UserAttributes[]

		const mappedUsers: UserMapped[] = users.map((user) => {
			let expDate = user.expDate
			if (user.payment_status?.toLowerCase() === 'free') {
				expDate = ''
			}
			return {
				user_id: user.id ?? '',
				name: user.name ?? '',
				email: user.email ?? '',
				phone_number: user.phone_number ?? '',
				farm_name: user.farm_name ?? '',
				address: user.address ?? '',
				pincode: user.pincode ?? '',
				taluka: user.taluka ?? '',
				district: user.district ?? '',
				state_name: user.state ?? '',
				country: user.country ?? '',
				payment_status: user.payment_status ?? '',
				expDate,
				Daily_record_update_count: Number(user.Daily_record_update_count) || 0,
				language_id: user.language_id ?? '',
				language_name: user.Language?.name ?? '',
			}
		})

		return {
			data: mappedUsers,
			pagination: this.calculatePagination(page, limit, mappedUsers.length),
		}
	}

	static async getFilteredUsers({
		status,
		phone,
		type,
		start_date,
		end_date,
		page_number,
		limit_number,
	}: {
		status?: string
		phone?: string
		type?: string
		start_date?: string
		end_date?: string
		page_number: number
		limit_number: number
	}): Promise<{
		data: FilteredUser[]
		pagination: Pagination
	}> {
		const { page, limit, offset } = this.normalizePaginationParams(
			page_number,
			limit_number,
		)

		if ((status && phone) || (!status && !phone)) {
			return {
				data: [],
				pagination: this.calculatePagination(page, limit, 0),
			}
		}

		const now = moment.tz(new Date(), 'Asia/Kolkata')
		let filterStartDate: string
		let filterEndDate: string

		if (type === 'all_time' || (!start_date && !end_date)) {
			filterStartDate = '1970-01-01'
			filterEndDate = now.format('YYYY-MM-DD')
		} else if (start_date && end_date) {
			filterStartDate = start_date
			filterEndDate = end_date
		} else {
			filterStartDate = '1970-01-01'
			filterEndDate = now.format('YYYY-MM-DD')
		}

		const countQuery = `
		SELECT COUNT(*) as total_count
		FROM users u
		INNER JOIN role_user ru ON ru.user_id = u.id AND ru.role_id = 2
		WHERE 1=1
			AND u.deleted_at IS NULL
			${status ? 'AND u.payment_status = ?' : ''}
			${phone ? 'AND u.phone_number = ?' : ''}
	`

		const countParams: (string | number)[] = []
		if (status) {
			countParams.push(status.toLowerCase())
		}
		if (phone) {
			countParams.push(phone)
		}

		const countResult = (await db.sequelize.query(countQuery, {
			type: QueryTypes.SELECT,
			replacements: countParams,
			raw: true,
			nest: false,
			logging: false,
		})) as unknown as { total_count: number }[]

		const totalCount = Number(countResult[0]?.total_count || 0)

		if (totalCount === 0) {
			return {
				data: [],
				pagination: this.calculatePagination(page, limit, 0),
			}
		}

		const query = `
	    WITH user_base AS (
		SELECT
			u.id,
			u.name,
			u.email,
			u.phone_number,
			u.farm_name,
			u.address,
			u.pincode,
			u.taluka,
			u.district,
			u.state,
			u.country,
			u.payment_status,
			u.language_id,
			u.created_at,
			l.name as language_name
		FROM users u
		INNER JOIN role_user ru ON ru.user_id = u.id AND ru.role_id = 2
		LEFT JOIN languages l ON l.id = u.language_id AND l.deleted_at IS NULL
		WHERE 1=1
			AND u.deleted_at IS NULL
			${status ? 'AND u.payment_status = ?' : ''}
			${phone ? 'AND u.phone_number = ?' : ''}
		LIMIT ? OFFSET ?
		),
		latest_payments AS (
			SELECT DISTINCT
				up.user_id,
				FIRST_VALUE(up.plan_exp_date) OVER (
					PARTITION BY up.user_id
					ORDER BY up.created_at DESC
					ROWS UNBOUNDED PRECEDING
				) as plan_exp_date
			FROM user_payment up
			WHERE up.user_id IN (SELECT id FROM user_base)
			AND up.deleted_at IS NULL
		),
		answer_stats AS (
			SELECT
				dra.user_id,
				COUNT(DISTINCT DATE(dra.answer_date)) as total_answer_days,
				COUNT(DISTINCT CASE
					WHEN ${type === 'all_time' ? 'dra.answer_date >= ub.created_at' : 'dra.answer_date BETWEEN ? AND ?'}
					THEN DATE(dra.answer_date)
				END) as filtered_answer_days
			FROM daily_record_question_answer dra
			INNER JOIN user_base ub ON ub.id = dra.user_id
			WHERE dra.deleted_at IS NULL
			AND DATE(dra.answer_date) >= GREATEST(
				DATE(ub.created_at),
				${type === 'all_time' ? 'DATE(ub.created_at)' : '?'}
			)
			${type !== 'all_time' && start_date && end_date ? 'AND DATE(dra.answer_date) <= ?' : ''}
			GROUP BY dra.user_id
		)
		SELECT
			ub.*,
			COALESCE(lp.plan_exp_date, '') as latest_exp_date,
			COALESCE(ans.total_answer_days, 0) as daily_record_update_count,
			COALESCE(ans.filtered_answer_days, 0) as answer_days_count
		FROM user_base ub
		LEFT JOIN latest_payments lp ON lp.user_id = ub.id
		LEFT JOIN answer_stats ans ON ans.user_id = ub.id
		ORDER BY ub.id ASC
	`

		const queryParams: (string | number)[] = []

		if (status) {
			queryParams.push(status.toLowerCase())
		}
		if (phone) {
			queryParams.push(phone)
		}
		queryParams.push(limit, offset)
		if (type !== 'all_time' && start_date && end_date) {
			queryParams.push(
				filterStartDate,
				filterEndDate,
				filterStartDate,
				filterEndDate,
			)
		}

		const users = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: queryParams,
			raw: true,
			nest: false,
			logging: false,
		})) as unknown as (UserAttributes & {
			language_name: string
			latest_exp_date: string
			daily_record_update_count: number
			answer_days_count: number
		})[]

		const nowMoment = moment.tz(now, 'Asia/Kolkata')
		const startDateMoment = start_date
			? moment.tz(start_date, 'Asia/Kolkata')
			: null
		const endDateMoment = end_date ? moment.tz(end_date, 'Asia/Kolkata') : null
		const endDateForComparison = end_date ? new Date(end_date) : null

		if (endDateForComparison) {
			endDateForComparison.setHours(0, 0, 0, 0)
		}

		const results = users.map((user) => {
			const expDate =
				user.payment_status?.toLowerCase() === 'free'
					? ''
					: user.latest_exp_date || ''
			const answerDaysCount = Number(user.answer_days_count) || 0

			let totalDays = 0
			let finalAnswerCount = answerDaysCount

			const userCreatedMoment = moment.tz(user.created_at, 'Asia/Kolkata')

			if (type === 'all_time' || (!start_date && !end_date)) {
				const diff = nowMoment.diff(userCreatedMoment, 'days')
				totalDays = diff === 0 ? 1 : diff + 1
			} else if (startDateMoment && endDateMoment) {
				if (userCreatedMoment.isSameOrBefore(endDateMoment)) {
					const startPoint = userCreatedMoment.isSameOrBefore(startDateMoment)
						? startDateMoment
						: userCreatedMoment
					const diff = endDateMoment.diff(startPoint, 'days')
					totalDays = diff === 0 ? 1 : diff + 1
				}
			}

			let finalTotalDays = totalDays

			if (endDateForComparison) {
				const userCreatedAt = new Date(user.created_at)
				userCreatedAt.setHours(0, 0, 0, 0)

				if (userCreatedAt > endDateForComparison) {
					finalTotalDays = 0
					finalAnswerCount = 0
				}
			}

			const divisor = finalTotalDays === 0 ? 1 : finalTotalDays
			const percentage = (finalAnswerCount / divisor) * 100

			return {
				user_id: Number(user.id),
				name: String(user.name || ''),
				email: String(user.email || ''),
				phone_number: String(user.phone_number || ''),
				farm_name: String(user.farm_name || ''),
				address: String(user.address || ''),
				pincode: String(user.pincode || ''),
				taluka: String(user.taluka || ''),
				district: String(user.district || ''),
				state_name: String(user.state || ''),
				country: String(user.country || ''),
				payment_status: String(user.payment_status || ''),
				expDate,
				registration_date: user.created_at || null,
				Daily_record_update_count: Number(user.daily_record_update_count) || 0,
				total_days: finalTotalDays,
				answer_days_count: finalAnswerCount,
				percentage: percentage.toFixed(2),
				language_id: Number(user.language_id) || 0,
				language_name: String(user.language_name || ''),
			}
		})

		return {
			data: results,
			pagination: this.calculatePagination(page, limit, totalCount),
		}
	}

	static async sortUsers({
		payment_status,
		sort_by,
		start_date,
		end_date,
		type,
		page_number,
		limit_number,
	}: {
		payment_status: string
		sort_by: string
		start_date?: string
		end_date?: string
		type?: string
		page_number: number
		limit_number: number
	}): Promise<{
		data: UserSortResult[]
		pagination: Pagination
	}> {
		const status = payment_status.toLowerCase()
		const sortBy = sort_by.toLowerCase()
		const { page, limit, offset } = this.normalizePaginationParams(
			page_number,
			limit_number,
		)

		if (
			sortBy === 'registered_date' &&
			(status === 'premium' || status === 'free')
		) {
			return await this.sortByRegisteredDate(
				page,
				limit,
				offset,
				status,
				type,
				start_date,
				end_date,
			)
		} else if (sortBy === 'validity_exp_date' && status === 'premium') {
			return await this.sortByValidityExpDate(
				page,
				limit,
				offset,
				status,
				type,
				start_date,
				end_date,
			)
		} else {
			throw new ValidationError('Invalid sorting option given')
		}
	}

	private static async sortByRegisteredDate(
		page: number,
		limit: number,
		offset: number,
		status: string,
		type?: string,
		start_date?: string,
		end_date?: string,
	): Promise<{
		data: UserSortResult[]
		pagination: Pagination
	}> {
		let answerDateCondition = ''
		if (type === 'all_time') {
			answerDateCondition = `AND dra.answer_date BETWEEN u2.created_at AND NOW()`
		} else if (start_date && end_date) {
			answerDateCondition = `AND dra.answer_date BETWEEN '${start_date}' AND '${end_date}'`
		} else {
			answerDateCondition = `AND dra.answer_date BETWEEN u2.created_at AND NOW()`
		}

		// Get total count first
		const countQuery = `
			SELECT COUNT(*) as total
			FROM users u
			INNER JOIN role_user ru ON ru.user_id = u.id
			WHERE ru.role_id = 2 AND u.payment_status = '${status}' 
			    AND u.deleted_at IS NULL
		`

		const countResult = (await db.sequelize.query(countQuery, {
			type: QueryTypes.SELECT,
		})) as unknown as { total: number }[]

		const totalCount = countResult[0]?.total || 0
		const query = `
		SELECT 
			u.id,
			u.name,
			u.email,
			u.phone_number,
			u.farm_name,
			u.address,
			u.pincode,
			u.taluka,
			u.district,
			u.state,
			u.country,
			u.payment_status,
			u.created_at,
			COALESCE(latest_payment.plan_exp_date, '') as latest_exp_date,
			COALESCE(all_distinct_dates.total_count, 0) as daily_record_update_count,
			COALESCE(filtered_answers.answer_count, 0) as answer_days_count
		FROM users u
		INNER JOIN role_user ru ON ru.user_id = u.id
		LEFT JOIN (
			SELECT 
				up1.user_id, 
				up1.plan_exp_date
			FROM user_payment up1
			WHERE deleted_at IS NULL
			INNER JOIN (
				SELECT user_id, MAX(created_at) as max_created_at
				FROM user_payment
				WHERE deleted_at IS NULL
				GROUP BY user_id
			) up2 ON up1.user_id = up2.user_id AND up1.created_at = up2.max_created_at
		) latest_payment ON latest_payment.user_id = u.id
		LEFT JOIN (
			SELECT 
				user_id, 
				COUNT(DISTINCT answer_date) as total_count
			FROM daily_record_question_answer
			WHERE deleted_at IS NULL
			GROUP BY user_id
		) all_distinct_dates ON all_distinct_dates.user_id = u.id
		LEFT JOIN (
			SELECT 
				dra.user_id, 
				COUNT(DISTINCT DATE(dra.answer_date)) as answer_count
			FROM daily_record_question_answer dra
			INNER JOIN users u2 ON u2.id = dra.user_id
			WHERE 1=1 ${answerDateCondition.replaceAll(/u\./g, 'u2.')}
			AND deleted_at IS NULL
			GROUP BY dra.user_id
		) filtered_answers ON filtered_answers.user_id = u.id
		WHERE ru.role_id = 2 AND u.payment_status = '${status}'
		AND u.deleted_at IS NULL
		ORDER BY u.created_at DESC
		LIMIT ${limit} OFFSET ${offset}
	`

		const users = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
		})) as unknown as (UserAttributes & {
			latest_exp_date: string
			daily_record_update_count: number
			answer_days_count: number
		})[]

		const processedUsers = this.processUsersData(
			users,
			type,
			start_date,
			end_date,
		)

		return {
			data: processedUsers,
			pagination: this.calculatePagination(page, limit, totalCount),
		}
	}

	private static async sortByValidityExpDate(
		page: number,
		limit: number,
		offset: number,
		status: string,
		type?: string,
		start_date?: string,
		end_date?: string,
	): Promise<{
		data: UserSortResult[]
		pagination: Pagination
	}> {
		let answerDateCondition = ''
		if (type === 'all_time') {
			answerDateCondition = `AND dra.answer_date BETWEEN u2.created_at AND NOW()`
		} else if (start_date && end_date) {
			answerDateCondition = `AND dra.answer_date BETWEEN '${start_date}' AND '${end_date}'`
		} else {
			answerDateCondition = `AND dra.answer_date BETWEEN u2.created_at AND NOW()`
		}
		// Get total count first
		const countQuery = `
			SELECT COUNT(DISTINCT u.id) as total
			FROM users u
			INNER JOIN role_user ru ON ru.user_id = u.id
			INNER JOIN user_payment up ON up.user_id = u.id
			WHERE ru.role_id = 2 AND u.payment_status = '${status}
			AND u.deleted_at IS NULL
		`

		const countResult = (await db.sequelize.query(countQuery, {
			type: QueryTypes.SELECT,
		})) as unknown as { total: number }[]

		const totalCount = countResult[0]?.total || 0

		const query = `
		SELECT 
			u.id,
			u.name,
			u.email,
			u.phone_number,
			u.farm_name,
			u.address,
			u.pincode,
			u.taluka,
			u.district,
			u.state,
			u.country,
			u.payment_status,
			u.created_at,
			up.plan_exp_date,
			COALESCE(all_distinct_dates.total_count, 0) as daily_record_update_count,
			COALESCE(filtered_answers.answer_count, 0) as answer_days_count
		FROM users u
		INNER JOIN role_user ru ON ru.user_id = u.id
		INNER JOIN user_payment up ON up.user_id = u.id AND up.deleted_at IS NULL
		LEFT JOIN (
			SELECT 
				user_id, 
				COUNT(DISTINCT answer_date) as total_count
			FROM daily_record_question_answer
			WHERE deleted_at IS NULL
			GROUP BY user_id
		) all_distinct_dates ON all_distinct_dates.user_id = u.id
		LEFT JOIN (
			SELECT 
				dra.user_id, 
				COUNT(DISTINCT DATE(dra.answer_date)) as answer_count
			FROM daily_record_question_answer dra
			INNER JOIN users u2 ON u2.id = dra.user_id
			WHERE 1=1 ${answerDateCondition.replaceAll(/u\./g, 'u2.')}
			AND deleted_at IS NULL
			GROUP BY dra.user_id
		) filtered_answers ON filtered_answers.user_id = u.id
		WHERE ru.role_id = 2 AND u.payment_status = '${status}'
		AND u.deleted_at IS NULL
		ORDER BY up.plan_exp_date DESC
		LIMIT ${limit} OFFSET ${offset}
	`

		const users = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
		})) as unknown as (UserAttributes & {
			plan_exp_date: string
			daily_record_update_count: number
			answer_days_count: number
		})[]

		const processedUsers = this.processUsersDataWithExpDate(
			users,
			type,
			start_date,
			end_date,
		)

		return {
			data: processedUsers,
			pagination: this.calculatePagination(page, limit, totalCount),
		}
	}

	private static processUsersData(
		users: (UserAttributes & {
			latest_exp_date: string
			daily_record_update_count: number
			answer_days_count: number
		})[],
		type?: string,
		start_date?: string,
		end_date?: string,
	): UserSortResult[] {
		const now = new Date()

		return users.map((user): UserSortResult => {
			let expDate: string
			if (user.payment_status && user.payment_status.toLowerCase() === 'free') {
				expDate = ''
			} else {
				expDate = user.latest_exp_date || ''
			}

			const answer = Number.parseInt(user.answer_days_count.toString()) || 0

			const calcTotalDaysAllTime = (
				created_at: Date | string,
				now: Date | string,
			): number => {
				const start = moment.tz(created_at, 'Asia/Kolkata')
				const end = moment.tz(now, 'Asia/Kolkata')

				const diff = end.diff(start, 'days')
				return diff === 0 ? 1 : diff + 1
			}

			let total_days = 0

			if (type === 'all_time') {
				total_days = calcTotalDaysAllTime(user.created_at, now)
			} else if (start_date && end_date) {
				const userCreatedAt = moment.tz(user.created_at, 'Asia/Kolkata')
				const startDate = moment.tz(start_date, 'Asia/Kolkata')
				const endDate = moment.tz(end_date, 'Asia/Kolkata')

				if (userCreatedAt.isSameOrBefore(endDate)) {
					let diff: number

					if (userCreatedAt.isSameOrBefore(startDate)) {
						diff = endDate.diff(startDate, 'days')
					} else {
						diff = endDate.diff(userCreatedAt, 'days')
					}

					if (diff === 0) {
						total_days = 1
					} else {
						total_days = diff + 1
					}
				} else {
					total_days = 0
				}
			} else {
				total_days = calcTotalDaysAllTime(user.created_at, now)
			}

			let finalTotalDays = total_days
			let finalAnswer = answer

			if (start_date && end_date) {
				const userCreatedAt = new Date(user.created_at)
				const endDate = new Date(end_date)
				userCreatedAt.setHours(0, 0, 0, 0)
				endDate.setHours(0, 0, 0, 0)

				if (userCreatedAt > endDate) {
					finalTotalDays = 0
					finalAnswer = 0
				}
			}

			const difference1 = finalTotalDays === 0 ? 1 : finalTotalDays
			const percentage = (finalAnswer / difference1) * 100

			return {
				user_id: Number(user.id),
				name: String(user.name || ''),
				email: String(user.email || ''),
				phone_number: String(user.phone_number || ''),
				farm_name: String(user.farm_name || ''),
				address: String(user.address || ''),
				pincode: String(user.pincode || ''),
				taluka: String(user.taluka || ''),
				district: String(user.district || ''),
				state: String(user.state || ''),
				country: String(user.country || ''),
				payment_status: String(user.payment_status || ''),
				expDate: String(expDate),
				Daily_record_update_count: Number(
					Number.parseInt(user.daily_record_update_count.toString()) || 0,
				),
				registration_date: user.created_at || null,
				total_days: Number(finalTotalDays),
				answer_days_count: Number(finalAnswer),
				percentage: percentage.toFixed(2),
			} as UserSortResult
		})
	}

	private static processUsersDataWithExpDate(
		users: (UserAttributes & {
			plan_exp_date: string
			daily_record_update_count: number
			answer_days_count: number
		})[],
		type?: string,
		start_date?: string,
		end_date?: string,
	): UserSortResult[] {
		const now = new Date()

		return users.map((user): UserSortResult => {
			const answer = Number.parseInt(user.answer_days_count.toString()) || 0

			const calcTotalDaysAllTime = (
				created_at: Date | string,
				now: Date | string,
			): number => {
				const start = moment.tz(created_at, 'Asia/Kolkata')
				const end = moment.tz(now, 'Asia/Kolkata')

				const diff = end.diff(start, 'days')
				return diff === 0 ? 1 : diff + 1
			}

			let total_days = 0

			if (type === 'all_time' || (!start_date && !end_date)) {
				total_days = calcTotalDaysAllTime(user.created_at, now)
			} else if (start_date && end_date) {
				const userCreatedAt = moment.tz(user.created_at, 'Asia/Kolkata')
				const startDate = moment.tz(start_date, 'Asia/Kolkata')
				const endDate = moment.tz(end_date, 'Asia/Kolkata')

				if (userCreatedAt.isSameOrBefore(endDate)) {
					let diff: number

					if (userCreatedAt.isSameOrBefore(startDate)) {
						diff = endDate.diff(startDate, 'days')
					} else {
						diff = endDate.diff(userCreatedAt, 'days')
					}

					if (diff === 0) {
						total_days = 1
					} else {
						total_days = diff + 1
					}
				} else {
					total_days = 0
				}
			}

			let finalTotalDays = total_days
			let finalAnswer = answer

			if (start_date && end_date) {
				const userCreatedAt = new Date(user.created_at)
				const endDate = new Date(end_date)
				userCreatedAt.setHours(0, 0, 0, 0)
				endDate.setHours(0, 0, 0, 0)

				if (userCreatedAt > endDate) {
					finalTotalDays = 0
					finalAnswer = 0
				}
			}

			const difference1 = finalTotalDays === 0 ? 1 : finalTotalDays
			const percentage = (finalAnswer / difference1) * 100

			return {
				user_id: Number(user.id),
				name: String(user.name || ''),
				email: String(user.email || ''),
				phone_number: String(user.phone_number || ''),
				farm_name: String(user.farm_name || ''),
				address: String(user.address || ''),
				pincode: String(user.pincode || ''),
				taluka: String(user.taluka || ''),
				district: String(user.district || ''),
				state: String(user.state || ''),
				country: String(user.country || ''),
				payment_status: String(user.payment_status || ''),
				expDate: String(user.plan_exp_date || ''),
				Daily_record_update_count: Number(
					Number.parseInt(user.daily_record_update_count.toString()) || 0,
				),
				registration_date: user.created_at || null,
				total_days: Number(finalTotalDays),
				answer_days_count: Number(finalAnswer),
				percentage: percentage.toFixed(2),
			} as UserSortResult
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

		let userDateCondition = ''
		let answerDateCondition = ''

		if (start_date && end_date && type !== 'all_time') {
			userDateCondition = `AND u.created_at BETWEEN '${start_date}' AND '${end_date}'`
			answerDateCondition = `AND answer_date BETWEEN '${start_date}' AND '${end_date}'`
		}

		const query = `
        SELECT 
            u.id as user_id,
            u.name,
            u.phone_number,
            u.created_at as registration_date,
            COALESCE(answer_counts.answer_days_count, 0) as answer_days_count
        FROM users u
        INNER JOIN role_user ru ON ru.user_id = u.id
        LEFT JOIN (
            SELECT 
                user_id,
                COUNT(DISTINCT DATE(answer_date)) as answer_days_count
            FROM daily_record_question_answer
            WHERE 1=1 ${answerDateCondition}
			AND deleted_at IS NULL
            GROUP BY user_id
        ) answer_counts ON answer_counts.user_id = u.id
        WHERE ru.role_id = ${roleId} ${userDateCondition}
        AND u.deleted_at IS NULL
        ORDER BY u.id ASC
    `

		const users = (await db.sequelize.query(query, {
			type: QueryTypes.SELECT,
		})) as unknown as {
			user_id: number
			name: string
			phone_number: string
			registration_date: Date
			answer_days_count: string
			percentage?: number | string
			total_days: number
		}[]

		const calcTotalDaysAllTime = (
			created_at: Date | string,
			now: Date,
		): number => {
			if (!created_at) return 1
			const createdDate = new Date(created_at)
			const currentDate = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
			)
			const createdDateNorm = new Date(
				createdDate.getFullYear(),
				createdDate.getMonth(),
				createdDate.getDate(),
			)
			return Math.floor(
				(currentDate.getTime() - createdDateNorm.getTime()) /
					(1000 * 60 * 60 * 24),
			)
		}

		const calcTotalDaysRange = (start: string, end: string): number => {
			const startDate = new Date(start)
			const endDate = new Date(end)
			const startNorm = new Date(
				startDate.getFullYear(),
				startDate.getMonth(),
				startDate.getDate(),
			)
			const endNorm = new Date(
				endDate.getFullYear(),
				endDate.getMonth(),
				endDate.getDate(),
			)
			return Math.floor(
				(endNorm.getTime() - startNorm.getTime()) / (1000 * 60 * 60 * 24),
			)
		}

		return users.map((user) => {
			const registration_date = user.registration_date ?? ''
			let total_days = 0
			const answer_days_count = Number.parseInt(user.answer_days_count) || 0

			if (type === 'all_time') {
				total_days = calcTotalDaysAllTime(user.registration_date, now)
			} else if (start_date && end_date) {
				total_days = calcTotalDaysRange(start_date, end_date)
			}

			let percentage: number | string = 0
			if (total_days > 0) {
				if (type === 'all_time') {
					percentage = (answer_days_count / total_days) * 100
				} else {
					percentage = ((answer_days_count / total_days) * 100).toFixed(2)
				}
			}

			return {
				user_id: user.user_id ?? 0,
				name: user.name ?? '',
				phone_number: user.phone_number ?? '',
				registration_date,
				total_days,
				answer_days_count: answer_days_count ?? 0,
				percentage,
			}
		})
	}

	static async getUserById(id: number): Promise<UserWithLanguage | null> {
		return db.User.findOne({
			where: { id, deleted_at: null },
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
				'village',
				'payment_status',
				'record_milk_refresh',
				'language_id',
				'created_at',
				'updated_at',
			],
			raw: true,
		})
	}

	static async findByFarmName(farm_name: string): Promise<User | null> {
		return db.User.findOne({ where: { farm_name, deleted_at: null } })
	}

	static async findByEmail(email: string): Promise<User | null> {
		return db.User.findOne({ where: { email, deleted_at: null } })
	}

	static async updateUserProfile(
		id: number,
		fields: Partial<User>,
	): Promise<User | null> {
		const user = await db.User.findOne({ where: { id, deleted_at: null } })
		if (!user) return null
		await user.update(fields)
		return user
	}

	static async updatePaymentStatus({
		user_id,
		payment_status,
		exp_date,
		amount,
		transaction,
	}: {
		user_id: number
		payment_status: string
		exp_date: Date
		amount?: number
		transaction?: Transaction
	}): Promise<{ success: boolean; message?: string }> {
		const status = payment_status.toLowerCase()
		if (status !== 'free' && status !== 'premium') {
			throw new ValidationRequestError({
				payment_status: [
					'Invalid payment status. Must be "free" or "premium".',
				],
			})
		}
		await db.User.update(
			{ payment_status: status },
			{ where: { id: user_id }, transaction },
		)
		if (status === 'premium') {
			const userPlan = await db.UserPayment.findOne({
				where: { user_id, deleted_at: null },
				order: [['created_at', 'DESC']],
				transaction,
			})
			if (userPlan) {
				await db.UserPayment.update(
					{
						plan_exp_date: exp_date,
						payment_history_id: 0,
						amount: amount ?? 0,
					},
					{ where: { id: userPlan.get('id') }, transaction },
				)
			} else {
				await db.UserPayment.create(
					{
						user_id,
						plan_id: 1,
						amount: 0,
						num_of_valid_years: 1,
						plan_exp_date: exp_date,
						payment_history_id: 0,
						created_at: new Date(),
					},
					{ transaction },
				)
			}
		}

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
		return { success: true, message: 'Success' }
	}

	static async hideAddUpdateSection(user_id: number): Promise<{
		profile_details: boolean
		animal_details: boolean
		farm_details: boolean
	}> {
		let userProfile = false
		let animalDetails = false
		let farmDetails = false

		const profileData = await db.User.findOne({
			where: { id: user_id, deleted_at: null },
		})
		if (
			profileData?.get('email') ||
			profileData?.get('farm_name') ||
			profileData?.get('address') ||
			profileData?.get('pincode') ||
			profileData?.get('taluka') ||
			profileData?.get('district') ||
			profileData?.get('state') ||
			profileData?.get('country') ||
			profileData?.get('village')
		) {
			userProfile = true
		}

		const animalData = await db.AnimalQuestionAnswer.findOne({
			where: { user_id, deleted_at: null },
		})
		if (animalData) {
			animalDetails = true
		}

		const farmData = await db.UserFarmDetails.findOne({
			where: { user_id, deleted_at: null },
		})
		if (farmData) {
			farmDetails = true
		}

		const resData = {
			profile_details: userProfile,
			animal_details: animalDetails,
			farm_details: farmDetails,
		}
		return resData
	}
}
