import { Request } from 'express'
import type { LanguageAttributes } from '@/models/language.model'
import type { UserAttributes } from '@/models/user.model'

export interface User {
	id: number
	email?: string
	password?: string
	role?: UserRole
	roles?: string[]
	createdAt?: Date
	updatedAt?: Date
	phone_number?: string
}

export enum UserRole {
	SuperAdmin = 'SuperAdmin',
	User = 'User',
}

export interface SuccessResponse<T = unknown> {
	message: string
	data?: T
	status?: number
}

export interface ErrorResponse {
	message: string
	data?: unknown
	status?: number
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse

export interface ValidationError {
	field: string
	message: string
}

export interface AuditLog {
	userId: string
	action: string
	details: Record<string, unknown>
	timestamp: Date
	ipAddress?: string
	userAgent?: string
}

export interface TokenPayload {
	userId: number
	email: string
	role: string
	type: 'access' | 'refresh'
}

export interface RequestWithUser extends Request {
	user?: User
}

export interface TokenAttributes {
	id: string
	userId: string
	token: string
	type: 'access' | 'refresh'
	expiresAt: Date
	isRevoked: boolean
	createdAt: Date
	updatedAt: Date
}

export type TokenCreationAttributes = Omit<
	TokenAttributes,
	'id' | 'createdAt' | 'updatedAt'
>

export interface UserWithLanguage extends UserAttributes {
	Language?: LanguageAttributes | null
}
