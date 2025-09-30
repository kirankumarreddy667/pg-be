import * as admin from 'firebase-admin'
import { initializeFirebase } from '../config/firebase'

initializeFirebase()

export async function sendNotificationsByFCM(
	token: string,
	title: string,
	message: string,
	deviceType: string,
): Promise<boolean> {
	try {
		const baseMessage = {
			token: token,
			notification: {
				title: title,
				body: message,
			},
			data: {
				click_action: 'FLUTTER_NOTIFICATION_CLICK',
				moredata: 'dd',
			},
		}

		let firebaseMessage: admin.messaging.Message

		if (deviceType === 'iOS') {
			// iOS-specific configuration
			firebaseMessage = {
				...baseMessage,
				apns: {
					payload: {
						aps: {
							alert: {
								title: title,
								body: message,
							},
							sound: 'default',
							badge: 1,
							'content-available': 1,
						},
					},
					headers: {
						'apns-priority': '10',
						'apns-push-type': 'alert',
					},
				},
			}
		} else {
			// Android-specific configuration
			firebaseMessage = {
				...baseMessage,
				android: {
					priority: 'high',
					notification: {
						title: title,
						body: message,
						sound: 'default',
						channelId: 'default_channel',
						defaultSound: true,
						defaultVibrateTimings: true,
						defaultLightSettings: true,
					},
				},
			}
		}

		await admin.messaging().send(firebaseMessage)
		return true
	} catch {
		return false
	}
}
