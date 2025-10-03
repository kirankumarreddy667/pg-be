import * as admin from 'firebase-admin'

export function initializeFirebase(): void {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				// privateKey: process.env.FIREBASE_PRIVATE_KEY?.replaceAll('\\n', '\n'),
				privateKey: process.env.FIREBASE_PRIVATE_KEY
					? String.raw`${process.env.FIREBASE_PRIVATE_KEY}`
					: undefined,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			}),
		})
	}
}
