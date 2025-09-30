import { randomBytes } from 'crypto'

export function generateRandomPassword(length: number): string {
	return randomBytes(length * 2)
		.toString('base64')
		.replace(/[^a-zA-Z0-9]/g, '')
		.slice(0, length)
}
