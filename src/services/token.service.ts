import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { env } from '@/config/env'
import { v4 as uuidv4 } from 'uuid'

interface UserPayload {
	id: number
}

export class TokenService {
	private static readonly tokenBlacklist = new Set<string>()

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
		payload: UserPayload,
		issuer?: string,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const now = Math.floor(Date.now() / 1000)
			const expiresIn = 259200
			const tokenPayload = {
				iss: issuer || env.APP_URL,
				iat: now,
				exp: now + expiresIn,
				nbf: now,
				jti: uuidv4(),
				sub: payload.id,
				type: 'access',
			}
			sign(
				tokenPayload,
				env.JWT_ACCESS_SECRET,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) reject(err instanceof Error ? err : new Error(String(err)))
					else resolve(token as string)
				},
			)
		})
	}

	static async verifyAccessToken(token: string): Promise<JwtPayload> {
		return new Promise((resolve, reject) => {
			verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
				if (err) reject(err instanceof Error ? err : new Error(String(err)))
				else resolve(decoded as JwtPayload)
			})
		})
	}

	static async generateRefreshToken(payload: UserPayload, expiresInSec: number = 30 * 24 * 60 * 60): Promise<string> {
		return new Promise((resolve, reject) => {
			const now = Math.floor(Date.now() / 1000)
			const tokenPayload = {
				jti: uuidv4(),
				sub: payload.id,
				iat: now,
				nbf: now,
				exp: now + expiresInSec,
				type: 'refresh',
			}
			sign(tokenPayload, env.JWT_REFRESH_SECRET, { algorithm: 'HS256' }, (err, token) => {
				if (err) reject(err instanceof Error ? err : new Error(String(err)))
				else resolve(token as string)
			})
		})
	}

	static async verifyRefreshToken(token: string): Promise<JwtPayload> {
		return new Promise((resolve, reject) => {
			verify(token, env.JWT_REFRESH_SECRET, (err, decoded) => {
				if (err) reject(err instanceof Error ? err : new Error(String(err)))
				else {
					const payload = decoded as JwtPayload
					if (payload.type !== 'refresh') reject(new Error('Invalid token type'))
					else resolve(payload)
				}
			})
		})
	}

	static revokeRefreshToken(token: string): void {
		this.blacklistToken(token)
	}

}
