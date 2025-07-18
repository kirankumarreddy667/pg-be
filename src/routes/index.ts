import { Router, type Router as ExpressRouter } from 'express'
import authRoutes from './auth.routes'
import languageRouter from './language.routes'
import userRouter from './user.routes'
import questionValidationRoutes from './question_validation_rules.routes'
import formTypeRouter from './form_type.routes'
import categoryRouter from './category.routes'
import categoryLanguageRouter from './category_language.routes'
import unitRouter from './unit.routes'
import offerRouter from './offer.routes'
import subCategoryRouter from './sub_category.routes'
import subCategoryLanguageRouter from './sub_category_language.routes'
import questionUnitRouter from './question_unit.routes'
import questionTagRouter from './question_tag.routes'
import advertisementRouter from './advertisement.routes'
import businessOutletRouter from './business_outlet.routes'
import couponRouter from './coupons.route'
import summernoteRouter from './summernote.routes'
import sliderArticleRouter from './slider_article.routes'
import appAboutContentRouter from './app_about_content.routes'
import contactRouter from './contact_us.routes'
import productRouter from './product.routes'
import farmManagementRoutes from './farm_management.routes'
import planRouter from './plan.routes'
import animalRoutes from './animal.routes'
import vaccinationRoutes from './vaccination.routes'
import dailyRecordQuestionRouter from './daily_record_question.routes'
import dailyMilkRecordRouter from './daily_milk_record.routes'
import commonQuestionRoutes from './common_question.routes'
import animalQuestionAnswerRoutes from './animal_question_answer.routes'
import deliveryRecordRoutes from './delivery_record.routes'
import pedigreeRoutes from './pedigree.routes'

const v1Router: ExpressRouter = Router()

//Routes
v1Router.use(authRoutes)
v1Router.use(languageRouter)
v1Router.use(userRouter)
v1Router.use(questionValidationRoutes)
v1Router.use(formTypeRouter)
v1Router.use(categoryRouter)
v1Router.use(categoryLanguageRouter)
v1Router.use(unitRouter)
v1Router.use(offerRouter)
v1Router.use(subCategoryRouter)
v1Router.use(subCategoryLanguageRouter)
v1Router.use(questionUnitRouter)
v1Router.use(questionTagRouter)
v1Router.use(advertisementRouter)
v1Router.use(businessOutletRouter)
v1Router.use(couponRouter)
v1Router.use(summernoteRouter)
v1Router.use(sliderArticleRouter)
v1Router.use(appAboutContentRouter)
v1Router.use(contactRouter)
v1Router.use(productRouter)
v1Router.use(farmManagementRoutes)
v1Router.use(planRouter)
v1Router.use(animalRoutes)
v1Router.use(vaccinationRoutes)
v1Router.use(dailyRecordQuestionRouter)
v1Router.use(dailyMilkRecordRouter)
v1Router.use(commonQuestionRoutes)
v1Router.use(animalQuestionAnswerRoutes)
v1Router.use(deliveryRecordRoutes)
v1Router.use(pedigreeRoutes)

export default v1Router
