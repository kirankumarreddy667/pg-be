import { sign, verify } from 'jsonwebtoken'
import { env } from '@/config/env'
import { TokenPayload, User } from '@/types/index'

export class TokenService {
	private static tokenBlacklist = new Set<string>()

	static isTokenBlacklisted(token: string): boolean {
		return this.tokenBlacklist.has(token)
	}

	static blacklistToken(token: string): void {
		this.tokenBlacklist.add(token)
	}

	static revokeToken(token: string): void {
		this.blacklistToken(token)
	}

	static async generateAccessToken(
		payload: Omit<User, 'type'>,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{ ...payload, type: 'access' },
				env.JWT_ACCESS_SECRET,
				{
					expiresIn: '15m',
				},
				(err, token) => {
					if (err) reject(err)
					else resolve(token as string)
				},
			)
		})
	}

	static async generateRefreshToken(
		payload: Omit<User, 'type'>,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{ ...payload, type: 'refresh' },
				env.JWT_REFRESH_SECRET,
				{
					expiresIn: '7d',
				},
				(err, token) => {
					if (err) reject(err)
					else resolve(token as string)
				},
			)
		})
	}

	static async verifyAccessToken(token: string): Promise<TokenPayload> {
		return new Promise((resolve, reject) => {
			verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
				if (err) reject(err)
				else resolve(decoded as TokenPayload)
			})
		})
	}

	static async verifyRefreshToken(token: string): Promise<TokenPayload> {
		return new Promise((resolve, reject) => {
			verify(token, env.JWT_REFRESH_SECRET, (err, decoded) => {
				if (err) reject(err)
				else resolve(decoded as TokenPayload)
			})
		})
	}
}
