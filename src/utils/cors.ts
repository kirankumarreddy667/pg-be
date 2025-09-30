import { CorsOptions } from 'cors'

// cors and session
export const options: CorsOptions = {
	origin: [
		'http://localhost:8888',
		'http://143.244.132.143:8888',
		'http://localhost:4200',
		'http://128.199.21.237:9192',
		'http://128.199.21.237:9193',
		'http://128.199.21.237:4352',
	],
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
