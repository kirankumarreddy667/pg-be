import { Request } from 'express'

export interface User {
	id: number
	email: string
	password?: string
	role: UserRole
	createdAt?: Date
	updatedAt?: Date
}

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}

export interface AuthenticatedRequest extends Request {
	user?: User
}

export interface SuccessResponse<T = unknown> {
	success: true
	message: string
	data?: T
}

export interface ErrorResponse {
	success: false
	message: string
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
	role: UserRole
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
