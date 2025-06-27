import { HelmetOptions } from 'helmet'

export const helmetOptions: HelmetOptions = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-inline'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", 'data:', 'https:'],
			connectSrc: ["'self'"],
			fontSrc: ["'self'"],
			objectSrc: ["'none'"],
			mediaSrc: ["'self'"],
			frameSrc: ["'none'"],
		},
	},
	crossOriginEmbedderPolicy: false,
	crossOriginOpenerPolicy: false,
	crossOriginResourcePolicy: false,
	xssFilter: true,
	noSniff: true,
	referrerPolicy: { policy: 'same-origin' },
}
