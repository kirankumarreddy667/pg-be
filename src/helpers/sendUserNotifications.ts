import db from '../config/database'
import moment from 'moment'
import { Op, QueryTypes } from 'sequelize'
import { SmsService } from '../services/sms.service'
import { sendNotificationsByFCM } from '../utils/fcm'

export class SendUserNotifications {
	public static async sendUserNotifications(): Promise<void> {
		const today = moment()
		const notifications = (await db.Notification.findAll({
			where: {
				deleted_at: null,
			},
			raw: true,
		})) as unknown as Array<{
			user_id: number
			send_notification_date: string
			heading: string
			doctor_num: string
			message: string
		}>
		if (!notifications.length) {
			return
		}
		const userIds = notifications.map((notification) => notification.user_id)
		const users = await db.User.findAll({
			where: {
				id: { [Op.in]: userIds },
				deleted_at: null,
			},
			attributes: ['id', 'phone_number'],
		})

		const userPhoneMap = new Map()
		for (const user of users) {
			userPhoneMap.set(user.get('id'), user.get('phone_number'))
		}

		for (const notification of notifications) {
			const notificationDate = moment(notification.send_notification_date)
			const daysDifference = notificationDate.diff(today, 'days')
			const shouldSendToday = notificationDate.isSame(today, 'day')
			const shouldSendIn7Days =
				notificationDate.isAfter(today) && daysDifference === 7
			const shouldSendIn2Days =
				notificationDate.isAfter(today) && daysDifference === 2

			if (!(shouldSendToday || shouldSendIn7Days || shouldSendIn2Days)) {
				continue
			}

			const phoneNumber = userPhoneMap.get(notification.user_id) as string

			if (!phoneNumber) {
				continue
			}

			let DLT_Template_Id = ''
			const heading = notification.heading?.toLowerCase()

			if (!notification.doctor_num && heading === 'pregnency detection test') {
				DLT_Template_Id = '1207161534375093546'
			} else if (heading === 'update pregnency status') {
				DLT_Template_Id = '1207161534379821134'
			} else if (heading === 'drying off the animal') {
				DLT_Template_Id = '1207161534536347379'
			} else if (heading === 'delivery due') {
				DLT_Template_Id = '1207161534384946999'
			} else if (heading === 'biosecurity spray') {
				DLT_Template_Id = '1207161534545634398'
			} else if (heading === 'deworming') {
				DLT_Template_Id = '1207161534541971429'
			}

			if (DLT_Template_Id && phoneNumber) {
				await SmsService.sendNotificationSMS(
					`91${phoneNumber}`,
					notification.message,
					DLT_Template_Id,
				)
			}

			if (notification.doctor_num && heading === 'pregnency detection test') {
				const DLT_TE_Id = '1207161534368698597'
				await SmsService.sendNotificationSMS(
					`91${notification.doctor_num}`,
					notification.message,
					DLT_TE_Id,
				)
			}
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
					// user &&
					user?.firebase_token &&
					notification.heading &&
					notification.message
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
