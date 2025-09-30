import db from '@/config/database'
import { AppError } from '@/utils/errors'
import { QueryTypes } from 'sequelize'
import moment from 'moment'

interface NotificationLanguageRecord {
	id: number
	user_id: number
	language_id: number
	heading: string
	animal_number: string
	langauge_message: string
	send_notification_date: string
	days_before: number
	status: number
}

interface NotificationResponse {
	notification_id: number
	notification_header: string
	animal_number: string
	message: string
	send_notification_date: string
	date: string
	days_before: number
}

export class FcmNotificationService {
	static async getNotifications(
		user_id: number,
		language_id: number,
	): Promise<
		{
			notification_id: number
			notification_header: string
			animal_number: string
			message: string
			send_notification_date: string
			date: string
			days_before: number
		}[]
	> {
		const user = await db.User.findOne({
			where: {
				id: user_id,
				payment_status: 'premium',
				deleted_at: null,
			},
		})
		if (!user) throw new AppError('Unauthorized', 401)
		const today = moment()
		const resData: NotificationResponse[] = []

		// Get notification data from notification_language table
		const notificationData = (await db.sequelize.query(
			`
				SELECT id, user_id, language_id, heading, animal_number, 
				       langauge_message, send_notification_date, days_before, status
				FROM notification_language
				WHERE user_id = ? 
				  AND language_id = ?
				  AND status != 1
				ORDER BY send_notification_date DESC
				`,
			{
				replacements: [user_id, language_id],
				type: QueryTypes.SELECT,
			},
		)) as unknown as NotificationLanguageRecord[]

		// Process each notification
		for (const notification of notificationData) {
			const notificationDate = moment(notification.send_notification_date)
			const dateDifference = Math.abs(today.diff(notificationDate, 'days'))

			const dayDiff = notification.days_before === 2 ? 2 : 7

			if (
				notificationDate.isBefore(today, 'day') ||
				dateDifference <= dayDiff ||
				dateDifference === 0
			) {
				let sendDate: moment.Moment
				if (notification.days_before === 7) {
					sendDate = notificationDate.clone().subtract(7, 'days')
				} else {
					sendDate = notificationDate.clone().subtract(2, 'days')
				}

				resData.push({
					notification_id: notification.id,
					notification_header: notification.heading,
					animal_number: notification.animal_number,
					message: notification.langauge_message,
					send_notification_date: notification.send_notification_date,
					date: sendDate.format('YYYY-MM-DD'),
					days_before: notification.days_before,
				})
			}
		}

		if (resData.length > 0) {
			const notificationIds = resData.map(
				(item) => item.notification_id && item.days_before === 0,
			)

			await db.sequelize.query(
				`UPDATE notification SET status = 1 WHERE id IN (${notificationIds.map(() => '?').join(',')})`,
				{
					replacements: notificationIds,
					type: QueryTypes.UPDATE,
				},
			)

			// Update notification_language table
			for (const item of resData) {
				await db.sequelize.query(
					`
						UPDATE notification_language 
						SET status = 1, send_notification_date = ?
						WHERE id = ?
						`,
					{
						replacements: [item.send_notification_date, item.notification_id],
						type: QueryTypes.UPDATE,
					},
				)
			}
		}

		return resData
	}

	static async notificationsCount(
		user_id: number,
		language_id: number,
	): Promise<{ count: number }> {
		const today = moment()
		const resData: NotificationResponse[] = []

		// Get notification data where status != 1
		const notificationData = (await db.sequelize.query(
			`
				SELECT id, user_id, language_id, heading, animal_number,
				       langauge_message, send_notification_date, days_before, status
				FROM notification_language
				WHERE user_id = ? 
				  AND status != 1
				  AND language_id = ?
				`,
			{
				replacements: [user_id, language_id],
				type: QueryTypes.SELECT,
			},
		)) as unknown as NotificationLanguageRecord[]

		// Process each notification
		for (const notification of notificationData) {
			const notificationDate = moment(notification.send_notification_date)
			const dateDifference = Math.abs(today.diff(notificationDate, 'days'))

			const dayDiff = notification.days_before === 7 ? 7 : 2
			if (
				notificationDate.isBefore(today, 'day') ||
				dateDifference <= dayDiff ||
				dateDifference === 0
			) {
				resData.push({
					notification_id: notification.id,
					notification_header: notification.heading,
					animal_number: notification.animal_number,
					message: notification.langauge_message,
					send_notification_date: notification.send_notification_date,
					date: today.format('YYYY-MM-DD'),
					days_before: notification.days_before,
				})
			}
		}

		const count = { count: resData.length }

		return count
	}
}
