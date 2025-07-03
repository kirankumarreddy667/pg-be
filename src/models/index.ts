import { Sequelize } from 'sequelize'
import UserModel, { User } from './user.model'
import OtpModel, { Otp } from './otp.model'
import RoleModel, { Role } from './role.model'
import RoleUserModel, { RoleUser } from './role_user.model'
import LanguageModel, { Language } from './language.model'

interface Models {
	User: typeof User
	Otp: typeof Otp
	Role: typeof Role
	RoleUser: typeof RoleUser
	Language: typeof Language
}

export const initModels = (sequelize: Sequelize): Models => {
	const User = UserModel(sequelize)
	const Otp = OtpModel(sequelize)
	const Role = RoleModel(sequelize)
	const RoleUser = RoleUserModel(sequelize)
	const Language = LanguageModel(sequelize)

	// Associations
	User.belongsToMany(Role, {
		through: RoleUser,
		foreignKey: 'user_id',
		otherKey: 'role_id',
	})
	Role.belongsToMany(User, {
		through: RoleUser,
		foreignKey: 'role_id',
		otherKey: 'user_id',
	})
	Otp.belongsTo(User, { foreignKey: 'user_id' })
	User.hasMany(Otp, { foreignKey: 'user_id' })
	RoleUser.belongsTo(Role, { foreignKey: 'role_id', as: 'Role' })
	return { User, Otp, Role, RoleUser, Language }
}
