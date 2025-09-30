import { FcmNotificationController } from '@/controllers/fcm_notification.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { Router, type Router as ExpressRouter } from 'express'

/**
 * @swagger
 * tags:
 *   name: FCMNotifications
 *   description: FCM notification management endpoints
 */

const fcmNotificationRouter: ExpressRouter = Router()

/**
 * @swagger
 * /notification/{language_id}:
 *   get:
 *     summary: Get notifications for the authenticated user in specified language
 *     tags: [FCMNotifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID for notification messages
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       notification_id:
 *                         type: integer
 *                         example: 1
 *                       notification_header:
 *                         type: string
 *                         example: "Vaccination Reminder"
 *                       animal_number:
 *                         type: string
 *                         example: "A001"
 *                       message:
 *                         type: string
 *                         example: "Your animal A001 needs vaccination in 2 days"
 *                       send_notification_date:
 *                         type: string
 *                         example: "2024-12-20"
 *                       date:
 *                         type: string
 *                         example: "2024-12-18"
 *                       days_before:
 *                         type: integer
 *                         example: 2
 *                         description: "Number of days before the event (2 or 7)"
 *       401:
 *         description: Unauthorized - User not found or not premium
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
fcmNotificationRouter.get(
	'/notification/:language_id',
	authenticate,
	wrapAsync(FcmNotificationController.getNotifications),
)

/**
 * @swagger
 * /notification_count/{language_id}:
 *   get:
 *     summary: Get count of unread notifications for the authenticated user
 *     tags: [FCMNotifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID for notification messages
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 5
 *                       description: "Number of unread notifications"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
fcmNotificationRouter.get(
	'/notification_count/:language_id',
	authenticate,
	wrapAsync(FcmNotificationController.notificationsCount),
)

export default fcmNotificationRouter
