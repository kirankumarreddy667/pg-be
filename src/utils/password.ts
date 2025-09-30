import { randomBytes } from 'node:crypto'

export function generateRandomPassword(length: number): string {
	return randomBytes(length * 2)
		.toString('base64')
		.replaceAll(/[^a-zA-Z0-9]/g, '')
		.slice(0, length)
}
