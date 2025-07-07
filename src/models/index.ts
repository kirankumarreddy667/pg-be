import { Sequelize } from 'sequelize'
import UserModel, { User } from './user.model'
import OtpModel, { Otp } from './otp.model'
import RoleModel, { Role } from './role.model'
import RoleUserModel, { RoleUser } from './role_user.model'
import LanguageModel, { Language } from './language.model'
import ValidationRuleModel, { ValidationRule } from './validation_rule.model'
import FormTypeModel, { FormType } from './form_type.model'
import CategoryModel, { Category } from './category.model'
import CategoryLanguageModel, {
	CategoryLanguage,
} from './category_language.model'
import SubcategoryModel, { Subcategory } from './sub_category.model'
import SubCategoryLanguageModel, {
	SubCategoryLanguage,
} from './sub_category_language.model'
import QuestionUnitModel, { QuestionUnit } from './question_unit.model'
import QuestionTagModel, { QuestionTag } from './question_tag.model'
import AdvertisementModel, { Advertisement } from './advertisement.model'
import AdvertisementImageModel, {
	AdvertisementImage,
} from './advertisement_image.model'

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
	Subcategory: typeof Subcategory
	SubCategoryLanguage: typeof SubCategoryLanguage
	QuestionUnit: typeof QuestionUnit
	QuestionTag: typeof QuestionTag
	Advertisement: typeof Advertisement
	AdvertisementImage: typeof AdvertisementImage
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
	const Subcategory = SubcategoryModel(sequelize)
	const SubCategoryLanguage = SubCategoryLanguageModel(sequelize)
	const QuestionUnit = QuestionUnitModel(sequelize)
	const QuestionTag = QuestionTagModel(sequelize)
	const Advertisement = AdvertisementModel(sequelize)
	const AdvertisementImage = AdvertisementImageModel(sequelize)

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

	Advertisement.hasMany(AdvertisementImage, {
		foreignKey: 'advertisement_id',
		as: 'images',
	})
	AdvertisementImage.belongsTo(Advertisement, {
		foreignKey: 'advertisement_id',
		as: 'advertisement',
	})

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
		Subcategory,
		SubCategoryLanguage,
		QuestionUnit,
		QuestionTag,
		Advertisement,
		AdvertisementImage,
	}
}

export { Advertisement } from './advertisement.model'
export { AdvertisementImage } from './advertisement_image.model'
