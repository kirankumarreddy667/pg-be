import { HelmetOptions } from 'helmet'

export const helmetOptions: HelmetOptions = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [
				"'self'",
				"'unsafe-inline'",
				"'unsafe-eval'",
				'https:',
				'http:',
			],
			styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
			imgSrc: ["'self'", 'data:', 'https:', 'http:'],
			connectSrc: ["'self'", 'https:', 'http:'],
			fontSrc: ["'self'", 'https:', 'http:'],
			objectSrc: ["'none'"],
		},
	},
	crossOriginEmbedderPolicy: false,
	crossOriginOpenerPolicy: false,
	crossOriginResourcePolicy: false,
	xssFilter: true,
	noSniff: true,
	referrerPolicy: { policy: 'same-origin' },
	hsts: false,
}
