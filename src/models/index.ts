import { Sequelize } from 'sequelize'
import UserModel, { User } from './user.model'
import OtpModel, { Otp } from './otp.model'
import RoleModel, { Role } from './role.model'
import RoleUserModel, { RoleUser } from './role_user.model'
import LanguageModel, { Language } from './language.model'
import ValidationRuleModel, { ValidationRule } from './validation_rule.model'
import FormTypeModel, { FormType } from './form_type.model'
import CategoryModel, { Category } from './category.model'
import UnitModel, { Unit } from './unit.model'
import OfferModel, { Offer } from './offer.model'
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
import BusinessOutletModel, { BusinessOutlet } from './business_outlet.model'
import summernoteModel, { Summernote } from './summernote.model'
import SliderArticleModel, { SliderArticle } from './slider_article.model'
import AppAboutContentModel, {
	AppAboutContent,
} from './app_about_content.model'
import ContactModel, { ContactUs } from './contact_us.model'
import productModel, { Product } from './product.model'
import ProductsCategoryFactory, {
	ProductsCategory,
} from './products_category.model'
import ProductPaymentFactory, { ProductPayment } from './product_payment.model'
import UserFarmDetailsFactory, {
	UserFarmDetails,
} from './user_farm_details.model'
import FarmTypesLanguageFactory, {
	FarmTypesLanguage,
} from './farm_types_language.model'
import FixedInvestmentDetailsFactory, {
	FixedInvestmentDetails,
} from './fixed_investment_details.model'
import InvestmentTypesFactory, {
	InvestmentTypes,
} from './investment_types.model'
import InvestmentTypesLanguageFactory, {
	InvestmentTypesLanguage,
} from './investment_types_language.model'
import UserBusinessOutletModel, {
	UserBusinessOutlet,
} from './user_business_outlet.model'
import AnimalModel, { Animal } from './animal.model'
import TypeModel, { Type } from './type.model'
import AnimalTypeModel, { AnimalType } from './animal_type.model'
import AnimalLanguageModel, { AnimalLanguage } from './animal_language.model'
import AnimalQuestionAnswerModel, {
	AnimalQuestionAnswer,
} from './animal_question_answers.model'

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
	Offer: typeof Offer
	Subcategory: typeof Subcategory
	SubCategoryLanguage: typeof SubCategoryLanguage
	QuestionUnit: typeof QuestionUnit
	QuestionTag: typeof QuestionTag
	Advertisement: typeof Advertisement
	AdvertisementImage: typeof AdvertisementImage
	BusinessOutlet: typeof BusinessOutlet
	Summernote: typeof Summernote
	SliderArticle: typeof SliderArticle
	AppAboutContent: typeof AppAboutContent
	ContactUs: typeof ContactUs
	Product: typeof Product
	ProductsCategory: typeof ProductsCategory
	ProductPayment: typeof ProductPayment
	UserFarmDetails: typeof UserFarmDetails
	FarmTypesLanguage: typeof FarmTypesLanguage
	FixedInvestmentDetails: typeof FixedInvestmentDetails
	InvestmentTypes: typeof InvestmentTypes
	InvestmentTypesLanguage: typeof InvestmentTypesLanguage
	UserBusinessOutlet: typeof UserBusinessOutlet
	Animal: typeof Animal
	Type: typeof Type
	AnimalType: typeof AnimalType
	AnimalLanguage: typeof AnimalLanguage
	AnimalQuestionAnswer: typeof AnimalQuestionAnswer
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
	const Offer = OfferModel(sequelize)
	const Subcategory = SubcategoryModel(sequelize)
	const SubCategoryLanguage = SubCategoryLanguageModel(sequelize)
	const QuestionUnit = QuestionUnitModel(sequelize)
	const QuestionTag = QuestionTagModel(sequelize)
	const Advertisement = AdvertisementModel(sequelize)
	const AdvertisementImage = AdvertisementImageModel(sequelize)
	const BusinessOutlet = BusinessOutletModel(sequelize)
	const Summernote = summernoteModel(sequelize)
	const SliderArticle = SliderArticleModel(sequelize)
	const AppAboutContent = AppAboutContentModel(sequelize)
	const ContactUs = ContactModel(sequelize)
	const Product = productModel(sequelize)
	const ProductsCategory = ProductsCategoryFactory(sequelize)
	const ProductPayment = ProductPaymentFactory(sequelize)
	const UserFarmDetails = UserFarmDetailsFactory(sequelize)
	const FarmTypesLanguage = FarmTypesLanguageFactory(sequelize)
	const FixedInvestmentDetails = FixedInvestmentDetailsFactory(sequelize)
	const InvestmentTypes = InvestmentTypesFactory(sequelize)
	const InvestmentTypesLanguage = InvestmentTypesLanguageFactory(sequelize)
	const UserBusinessOutlet = UserBusinessOutletModel(sequelize)
	const Animal = AnimalModel(sequelize)
	const Type = TypeModel(sequelize)
	const AnimalType = AnimalTypeModel(sequelize)
	const AnimalLanguage = AnimalLanguageModel(sequelize)
	const AnimalQuestionAnswer = AnimalQuestionAnswerModel(sequelize)

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

	BusinessOutlet.belongsTo(User, { foreignKey: 'user_id' })
	User.hasMany(BusinessOutlet, { foreignKey: 'user_id' })

	AnimalType.belongsTo(Animal, { foreignKey: 'animal_id' })
	AnimalType.belongsTo(Type, { foreignKey: 'type_id' })
	Animal.hasMany(AnimalType, { foreignKey: 'animal_id' })
	Type.hasMany(AnimalType, { foreignKey: 'type_id' })

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
		Unit,
		Offer,
		Subcategory,
		SubCategoryLanguage,
		QuestionUnit,
		QuestionTag,
		Advertisement,
		AdvertisementImage,
		BusinessOutlet,
		Summernote,
		SliderArticle,
		AppAboutContent,
		ContactUs,
		Product,
		ProductsCategory,
		ProductPayment,
		UserFarmDetails,
		FarmTypesLanguage,
		FixedInvestmentDetails,
		InvestmentTypes,
		InvestmentTypesLanguage,
		UserBusinessOutlet,
		Animal,
		Type,
		AnimalType,
		AnimalLanguage,
		AnimalQuestionAnswer,
	}
}

export { Advertisement } from './advertisement.model'
export { AdvertisementImage } from './advertisement_image.model'
export { BusinessOutlet } from './business_outlet.model'
export { User } from './user.model'
export { Role } from './role.model'
export { RoleUser } from './role_user.model'
export { Otp } from './otp.model'
export { Language } from './language.model'
export { ValidationRule } from './validation_rule.model'
export { FormType } from './form_type.model'
export { Category } from './category.model'
export { CategoryLanguage } from './category_language.model'
export { Subcategory } from './sub_category.model'
export { SubCategoryLanguage } from './sub_category_language.model'
export { QuestionUnit } from './question_unit.model'
export { QuestionTag } from './question_tag.model'
export { UserBusinessOutlet } from './user_business_outlet.model'
export { Animal } from './animal.model'
export { AnimalType } from './animal_type.model'
export { AnimalQuestionAnswer } from './animal_question_answers.model'
