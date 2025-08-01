import { CorsOptions } from 'cors'

// cors and session
export const options: CorsOptions = {
	origin: ['http://localhost:7777', 'http://143.244.132.143:8888'],
	credentials: true,
	exposedHeaders: [
		'sessionid',
		'resettoken',
		'logintoken',
		'ip',
		'content-disposition', // Add this for file downloads
		'content-type', // Add this for file downloads
		'content-length',
	],
	allowedHeaders: [
		'sessionid',
		'Content-Type',
		'Authorization',
		'Accept',
		'logintoken',
		'ip',
		'resettoken',
		'invitationtoken',
		'x-device-token',
	],
}
