/**
 * @swagger
 * tags:
 *   name: SubCategoryLanguage
 *   description: Subcategory language management endpoints
 */

/**
 * @swagger
 * /add_sub_category_in_other_language:
 *   post:
 *     summary: Add a subcategory in another language
 *     tags: [SubCategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategoryLanguage'
 *     responses:
 *       201:
 *         description: Subcategory language added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
import { Router, type Router as ExpressRouter } from 'express'
import { SubCategoryLanguageController } from '@/controllers/sub_category_language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	subCategoryLanguageSchema,
	updateSubCategoryLanguageSchema,
} from '@/validations/sub_category_language.validation'

const subCategoryLanguageRouter: ExpressRouter = Router()

subCategoryLanguageRouter.post(
	'/add_sub_category_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subCategoryLanguageSchema),
	wrapAsync(SubCategoryLanguageController.add),
)

/**
 * @swagger
 * /all_sub_category_details_by_language/{language_id}:
 *   get:
 *     summary: Get all subcategories by language
 *     tags: [SubCategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of subcategories by language
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
subCategoryLanguageRouter.get(
	'/get_all_sub_category_details_by_language/:language_id',
	authenticate,
	wrapAsync(SubCategoryLanguageController.getAll),
)

/**
 * @swagger
 * /get_sub_category_details_by_language/{sub_category_id}/{language_id}:
 *   get:
 *     summary: Get subcategory details by language
 *     tags: [SubCategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sub_category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subcategory ID
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Subcategory details by language
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Subcategory language not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
subCategoryLanguageRouter.get(
	'/get_sub_category_details_by_language/:sub_category_id/:language_id',
	authenticate,
	wrapAsync(SubCategoryLanguageController.getById),
)

/**
 * @swagger
 * /update_sub_category_in_other_language/{id}:
 *   put:
 *     summary: Update a subcategory language by ID
 *     tags: [SubCategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subcategory language ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategoryLanguage'
 *     responses:
 *       200:
 *         description: Subcategory language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Subcategory language not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
subCategoryLanguageRouter.put(
	'/update_sub_category_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateSubCategoryLanguageSchema),
	wrapAsync(SubCategoryLanguageController.update),
)

export default subCategoryLanguageRouter
