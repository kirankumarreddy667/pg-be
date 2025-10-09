import db from '../config/database'
import moment from 'moment'
import { Op, QueryTypes } from 'sequelize'
import { SmsService } from '../services/sms.service'
import { sendNotificationsByFCM } from '../utils/fcm'

interface NotificationRow {
	id: number
	user_id: number
	send_notification_date: string
	heading: string
	doctor_num: string
	message: string
	deleted_at: Date | null
}

export class SendUserNotifications {
	/**
	 * Map notification headings to DLT Template IDs
	 */
	private static getDLTTemplateId(
		heading: string,
		doctorNum?: string,
	): { userTemplate?: string; doctorTemplate?: string } {
		const normalizedHeading = heading.toLowerCase()
		const templates: Record<string, string> = {
			'pregnency detection test': '1207161534375093546',
			'update pregnency status': '1207161534379821134',
			'drying off the animal': '1207161534536347379',
			'delivery due': '1207161534384946999',
			'biosecurity spray': '1207161534545634398',
			deworming: '1207161534541971429',
		}

		const userTemplate =
			!doctorNum || normalizedHeading !== 'pregnency detection test'
				? templates[normalizedHeading]
				: undefined

		const doctorTemplate =
			doctorNum && normalizedHeading === 'pregnency detection test'
				? '1207161534368698597'
				: undefined

		return { userTemplate, doctorTemplate }
	}

	private static shouldSendNotification(
		notificationDate: moment.Moment,
		today: moment.Moment,
	): boolean {
		const daysDifference = notificationDate.diff(today, 'days')
		const shouldSendToday = notificationDate.isSame(today, 'day')
		const shouldSendIn7Days =
			notificationDate.isAfter(today) && daysDifference === 7
		const shouldSendIn2Days =
			notificationDate.isAfter(today) && daysDifference === 2

		return shouldSendToday || shouldSendIn7Days || shouldSendIn2Days
	}

	public static async sendUserNotifications(): Promise<void> {
		const today = moment()

		const notifications = (await db.Notification.findAll({
			where: { deleted_at: null },
			raw: true,
		})) as unknown as NotificationRow[]

		if (notifications.length === 0) {
			return
		}

		const userIds = notifications.map((notification) => notification.user_id)
		const users = (await db.User.findAll({
			where: {
				id: { [Op.in]: userIds },
				deleted_at: null,
			},
			attributes: ['id', 'phone_number'],
			raw: true,
		})) as Array<{ id: number; phone_number: string | null }>

		const userPhoneMap = new Map<number, string>()
		for (const user of users) {
			if (user.phone_number) {
				userPhoneMap.set(user.id, user.phone_number)
			}
		}

		const smsPromises: Array<Promise<unknown>> = []

		for (const notification of notifications) {
			const notificationDate = moment(notification.send_notification_date)

			if (!this.shouldSendNotification(notificationDate, today)) {
				continue
			}

			const phoneNumber = userPhoneMap.get(notification.user_id)
			const { userTemplate, doctorTemplate } = this.getDLTTemplateId(
				notification.heading,
				notification.doctor_num,
			)

			if (userTemplate && phoneNumber) {
				const userSmsPromise = SmsService.sendNotificationSMS(
					`91${phoneNumber}`,
					notification.message,
					userTemplate,
				).catch((error: Error) => {
					console.error(
						`Failed to send SMS to user ${notification.user_id}:`,
						error,
					)
				})
				smsPromises.push(userSmsPromise)
			}

			if (doctorTemplate && notification.doctor_num) {
				const doctorSmsPromise = SmsService.sendNotificationSMS(
					`91${notification.doctor_num}`,
					notification.message,
					doctorTemplate,
				).catch((error: Error) => {
					console.error(
						`Failed to send SMS to doctor for notification ${notification.id}:`,
						error,
					)
				})
				smsPromises.push(doctorSmsPromise)
			}
		}

		if (smsPromises.length > 0) {
			await Promise.all(smsPromises)
		}
	}

	public static async sendUserNotificationsByFCM(): Promise<void> {
		const today = moment()
		const notifications = (await db.Notification.findAll({
			where: {
				deleted_at: null,
				status: 0,
			},
			raw: true,
		})) as unknown as Array<{
			user_id: number
			send_notification_date: string
			heading: string
			doctor_num: string
			message: string
		}>

		for (const notification of notifications) {
			const notificationDate = moment(notification.send_notification_date)
			const dateDifference = Math.abs(today.diff(notificationDate, 'days'))

			if (
				notificationDate.isSame(today, 'day') ||
				(!notificationDate.isBefore(today) && dateDifference === 7) ||
				(!notificationDate.isBefore(today) && dateDifference === 2)
			) {
				const users = (await db.sequelize.query(
					`
				SELECT firebase_token , device_type
				FROM users
				WHERE id = ?
					AND firebase_token IS NOT NULL
					AND payment_status = 'premium'
					AND deleted_at IS NULL
				`,
					{
						replacements: [notification.user_id],
						type: QueryTypes.SELECT,
					},
				)) as unknown as Array<{ firebase_token: string; device_type: string }>

				const user = users[0]

				if (
					user &&
					user?.firebase_token &&
					notification?.heading &&
					notification?.message
				) {
					await sendNotificationsByFCM(
						user.firebase_token,
						notification.heading,
						notification.message,
						user.device_type,
					)
				}
			}
		}
	}
}
