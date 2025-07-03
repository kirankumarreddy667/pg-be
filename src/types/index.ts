import { Request } from 'express'

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
	SuperAdmin = 'superAdmin',
	User = 'user',
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
