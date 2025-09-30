import { RequestHandler } from 'express'
import RESPONSE from '@/utils/response'
import { User } from '@/models/user.model'
import { AppError } from '@/utils/errors'
import { FcmNotificationService } from '@/services/fcm_notification.service'

export class FcmNotificationController {
	public static readonly getNotifications: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			const { language_id } = req.params
			if (!user) throw new AppError('Unauthorized', 401)
			const notifications = await FcmNotificationService.getNotifications(
				user.id,
				Number(language_id),
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: notifications,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly notificationsCount: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const user = req.user as User
			if (!user) throw new AppError('Unauthorized', 401)

			const user_id = user.id
			const { language_id } = req.params

			const count = await FcmNotificationService.notificationsCount(
				Number(user_id),
				Number(language_id),
			)
			return RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: count,
			})
		} catch (error) {
			next(error)
		}
	}
}
