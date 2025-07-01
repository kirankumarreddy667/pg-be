import { config } from 'dotenv'
import { JWT_EXPIRATION, COOKIE_EXPIRATION } from '@/constants/time'

config()

export const authConfig = {
	jwt: {
		accessToken: {
			secret: process.env.JWT_ACCESS_SECRET,
			expiresIn: JWT_EXPIRATION.ACCESS_TOKEN,
		},
	},
	session: {
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: COOKIE_EXPIRATION.SESSION,
		},
	},
} as const
