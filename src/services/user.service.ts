import bcrypt from 'bcryptjs'
import db from '@/config/database'
import type { User } from '@/models/user.model'
import type { Role } from '@/models/role.model'
import type { RoleUser } from '@/models/role_user.model'

export class UserService {
	static async comparePassword(
		candidatePassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		if (!hashedPassword) return false
		return bcrypt.compare(candidatePassword, hashedPassword)
	}

	static async getUserRoles(user_id: number): Promise<Role[]> {
		// Get all role_user entries for the user
		const roleUsers: RoleUser[] = await db.RoleUser.findAll({
			where: { user_id },
		})

		// Extract role_ids
		const roleIds = roleUsers.map((ru: RoleUser) => ru.get('role_id'))
		if (roleIds.length === 0) return []

		// Fetch roles from Role table
		const roles: Role[] = await db.Role.findAll({
			where: { id: roleIds },
		})
		return roles
	}

	static async findUserByPhone(phone_number: string): Promise<User | null> {
		return db.User.findOne({
			where: {
				phone_number: phone_number,
			},
			include: [
				{
					model: db.Role,
					as: 'roles',
					where: { id: 2 }, // Role 'User'
					attributes: ['name'],
				},
			],
		})
	}

	static async updatePassword(
		userId: number,
		newPassword: string,
	): Promise<void> {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(newPassword, salt)
		await db.User.update(
			{ password: hashedPassword },
			{ where: { id: userId } },
		)
	}
}
