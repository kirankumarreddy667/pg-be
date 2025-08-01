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
import CouponModel, { Coupon } from './coupon.model'
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
import planModel from './plan.model'
import plan_typeModel from './plan_type.model'

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
import DeletedAnimalDetailsModel, {
	DeletedAnimalDetails,
} from './deleted_animal_details.model'
import CommonQuestionsModel, { CommonQuestions } from './common_questions.model'
import VaccinationTypeModel, { VaccinationType } from './vaccination_type.model'
import VaccinationDetailModel, {
	VaccinationDetail,
} from './vaccination_detail.model'
import AnimalVaccinationModel, {
	AnimalVaccination,
} from './animal_vaccination.model'
import UserVaccinationTypeModel, {
	UserVaccinationType,
} from './user_vaccination_type.model'
import DailyRecordQuestionModel, {
	DailyRecordQuestion,
} from './daily_record_questions.model'
import QuestionTagMappingModel, {
	QuestionTagMapping,
} from './question_tag_mapping.model'
import DailyRecordQuestionLanguageModel, {
	DailyRecordQuestionLanguage,
} from './daily_record_question_language.model'
import DailyMilkRecordModel, {
	DailyMilkRecord,
} from './daily_milk_record.model'
import QuestionLanguageModel, {
	QuestionLanguage,
} from './question_language.model'
import AnimalQuestionsModel, { AnimalQuestions } from './animal_questions.model'
import AnimalLactationYieldHistoryModel, {
	AnimalLactationYieldHistory,
} from './animal_lactation_yield_history.model'
import NotificationModel, { Notification } from './notification.model'
import NotificationLanguageModel, {
	NotificationLanguage,
} from './notification_language.model'
import AnimalMotherCalfModel, {
	AnimalMotherCalf,
} from './animal_mother_calf.model'
import AnimalImageModel, { AnimalImage } from './animal_image.model'
import DailyRecordQuestionAnswerModel, {
	DailyRecordQuestionAnswer,
} from './daily_record_question_answer.model'

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
	Coupon: typeof Coupon
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
	Plan: ReturnType<typeof planModel>
	PlanType: ReturnType<typeof plan_typeModel>
	UserBusinessOutlet: typeof UserBusinessOutlet
	Animal: typeof Animal
	Type: typeof Type
	AnimalType: typeof AnimalType
	AnimalLanguage: typeof AnimalLanguage
	AnimalQuestionAnswer: typeof AnimalQuestionAnswer
	DeletedAnimalDetails: typeof DeletedAnimalDetails
	CommonQuestions: typeof CommonQuestions
	VaccinationType: typeof VaccinationType
	VaccinationDetail: typeof VaccinationDetail
	AnimalVaccination: typeof AnimalVaccination
	UserVaccinationType: typeof UserVaccinationType
	DailyRecordQuestion: typeof DailyRecordQuestion
	QuestionTagMapping: typeof QuestionTagMapping
	DailyRecordQuestionLanguage: typeof DailyRecordQuestionLanguage
	DailyMilkRecord: typeof DailyMilkRecord
	QuestionLanguage: typeof QuestionLanguage
	AnimalQuestions: typeof AnimalQuestions
	AnimalLactationYieldHistory: typeof AnimalLactationYieldHistory
	Notification: typeof Notification
	NotificationLanguage: typeof NotificationLanguage
	AnimalMotherCalf: typeof AnimalMotherCalf
	AnimalImage: typeof AnimalImage
	DailyRecordQuestionAnswer: typeof DailyRecordQuestionAnswer
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
	const Coupon = CouponModel(sequelize)
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
	const Plan = planModel(sequelize)
	const PlanType = plan_typeModel(sequelize)

	Plan.belongsTo(PlanType, { foreignKey: 'plan_type_id', as: 'PlanType' })
	PlanType.hasMany(Plan, { foreignKey: 'plan_type_id', as: 'Plans' })
	const UserBusinessOutlet = UserBusinessOutletModel(sequelize)
	const Animal = AnimalModel(sequelize)
	const Type = TypeModel(sequelize)
	const AnimalType = AnimalTypeModel(sequelize)
	const AnimalLanguage = AnimalLanguageModel(sequelize)
	const AnimalQuestionAnswer = AnimalQuestionAnswerModel(sequelize)
	const DeletedAnimalDetails = DeletedAnimalDetailsModel(sequelize)
	const CommonQuestions = CommonQuestionsModel(sequelize)
	const VaccinationType = VaccinationTypeModel(sequelize)
	const VaccinationDetail = VaccinationDetailModel(sequelize)
	const AnimalVaccination = AnimalVaccinationModel(sequelize)
	const UserVaccinationType = UserVaccinationTypeModel(sequelize)
	const DailyRecordQuestion = DailyRecordQuestionModel(sequelize)
	const QuestionTagMapping = QuestionTagMappingModel(sequelize)
	const DailyRecordQuestionLanguage =
		DailyRecordQuestionLanguageModel(sequelize)
	const DailyMilkRecord = DailyMilkRecordModel(sequelize)
	const QuestionLanguage = QuestionLanguageModel(sequelize)
	const AnimalQuestions = AnimalQuestionsModel(sequelize)
	const AnimalLactationYieldHistory =
		AnimalLactationYieldHistoryModel(sequelize)
	const Notification = NotificationModel(sequelize)
	const NotificationLanguage = NotificationLanguageModel(sequelize)
	const AnimalMotherCalf = AnimalMotherCalfModel(sequelize)
	const AnimalImage = AnimalImageModel(sequelize)
	const DailyRecordQuestionAnswer = DailyRecordQuestionAnswerModel(sequelize)

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
	User.hasMany(RoleUser, { foreignKey: 'user_id', as: 'role_users' })
	RoleUser.belongsTo(User, { foreignKey: 'user_id', as: 'User' })
	RoleUser.belongsTo(Role, { foreignKey: 'role_id', as: 'Role' })

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

	AnimalType.belongsTo(Animal, { foreignKey: 'animal_id', as: 'Animal' })
	AnimalType.belongsTo(Type, { foreignKey: 'type_id', as: 'Type' })
	Animal.hasMany(AnimalType, { foreignKey: 'animal_id' })
	Type.hasMany(AnimalType, { foreignKey: 'type_id' })

	CommonQuestions.belongsTo(Category, {
		foreignKey: 'category_id',
		as: 'Category',
	})
	CommonQuestions.belongsTo(Subcategory, {
		foreignKey: 'sub_category_id',
		as: 'Subcategory',
	})
	CommonQuestions.belongsTo(ValidationRule, {
		foreignKey: 'validation_rule_id',
		as: 'ValidationRule',
	})
	CommonQuestions.belongsTo(FormType, {
		foreignKey: 'form_type_id',
		as: 'FormType',
	})
	CommonQuestions.belongsTo(QuestionTag, {
		foreignKey: 'question_tag',
		as: 'QuestionTag',
	})
	CommonQuestions.belongsTo(QuestionUnit, {
		foreignKey: 'question_unit',
		as: 'QuestionUnit',
	})
	QuestionLanguage.belongsTo(CommonQuestions, {
		foreignKey: 'question_id',
		as: 'CommonQuestion',
	})

	// Add association between DailyRecordQuestion and AnimalQuestionAnswer
	DailyRecordQuestion.hasMany(AnimalQuestionAnswer, {
		foreignKey: 'question_id',
		as: 'Answers',
	})
	AnimalQuestionAnswer.belongsTo(DailyRecordQuestion, {
		foreignKey: 'question_id',
		as: 'DailyRecordQuestion',
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
		Unit,
		Offer,
		Subcategory,
		SubCategoryLanguage,
		QuestionUnit,
		QuestionTag,
		Advertisement,
		AdvertisementImage,
		BusinessOutlet,
		Coupon,
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
		Plan,
		PlanType,
		UserBusinessOutlet,
		Animal,
		Type,
		AnimalType,
		AnimalLanguage,
		AnimalQuestionAnswer,
		DeletedAnimalDetails,
		CommonQuestions,
		VaccinationType,
		VaccinationDetail,
		AnimalVaccination,
		UserVaccinationType,
		DailyRecordQuestion,
		QuestionTagMapping,
		DailyRecordQuestionLanguage,
		DailyMilkRecord,
		QuestionLanguage,
		AnimalQuestions,
		AnimalLactationYieldHistory,
		Notification,
		NotificationLanguage,
		AnimalMotherCalf,
		AnimalImage,
		DailyRecordQuestionAnswer,
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
export { DeletedAnimalDetails } from './deleted_animal_details.model'
export { CommonQuestions } from './common_questions.model'
export { VaccinationType } from './vaccination_type.model'
export { VaccinationDetail } from './vaccination_detail.model'
export { AnimalVaccination } from './animal_vaccination.model'
export { UserVaccinationType } from './user_vaccination_type.model'
export { DailyRecordQuestion } from './daily_record_questions.model'
export { QuestionTagMapping } from './question_tag_mapping.model'
export { DailyRecordQuestionLanguage } from './daily_record_question_language.model'
export { DailyMilkRecord } from './daily_milk_record.model'
export { QuestionLanguage } from './question_language.model'
export { AnimalQuestions } from './animal_questions.model'
export { AnimalLactationYieldHistory } from './animal_lactation_yield_history.model'
export { Notification } from './notification.model'
export { NotificationLanguage } from './notification_language.model'
export { AnimalMotherCalf } from './animal_mother_calf.model'
export { AnimalImage } from './animal_image.model'
export { DailyRecordQuestionAnswer } from './daily_record_question_answer.model'
