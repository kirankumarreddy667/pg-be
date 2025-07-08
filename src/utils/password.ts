import { randomBytes } from 'crypto'

export function generateRandomPassword(length = 8): string {
	return randomBytes(Math.ceil(length * 0.75))
		.toString('base64')
		.replace(/[^a-zA-Z0-9]/g, '')
		.slice(0, length)
}
