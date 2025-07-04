import { Sequelize } from 'sequelize'
import UserModel, { User } from './user.model'
import OtpModel, { Otp } from './otp.model'
import RoleModel, { Role } from './role.model'
import RoleUserModel, { RoleUser } from './role_user.model'
import LanguageModel, { Language } from './language.model'
import ValidationRuleModel, { ValidationRule } from './validation_rule.model'
import FormTypeModel, { FormType } from './form_type.model'
import CategoryModel, { Category } from './category.model'
import CategoryLanguageModel, { CategoryLanguage } from './category_language.model'
import UnitModel, { Unit } from './unit.model'

interface Models {
	User: typeof User
	Otp: typeof Otp
	Role: typeof Role
	RoleUser: typeof RoleUser
	Language: typeof Language
	ValidationRule: typeof ValidationRule
	FormType: typeof FormType
	Category: typeof Category
	CategoryLanguage: typeof CategoryLanguage
	Unit: typeof Unit
}

export const initModels = (sequelize: Sequelize): Models => {
	const User = UserModel(sequelize)
	const Otp = OtpModel(sequelize)
	const Role = RoleModel(sequelize)
	const RoleUser = RoleUserModel(sequelize)
	const Language = LanguageModel(sequelize)
	const ValidationRule = ValidationRuleModel(sequelize)
	const FormType = FormTypeModel(sequelize)
	const Category = CategoryModel(sequelize)
	const CategoryLanguage = CategoryLanguageModel(sequelize)
	const Unit = UnitModel(sequelize)

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

	// Add User-Language association
	User.belongsTo(Language, { foreignKey: 'language_id', as: 'Language' })
	Language.hasMany(User, { foreignKey: 'language_id', as: 'Users' })

	return {
		User,
		Otp,
		Role,
		RoleUser,
		Language,
		ValidationRule,
		FormType,
		Category,
		CategoryLanguage,
		Unit
	}
}
