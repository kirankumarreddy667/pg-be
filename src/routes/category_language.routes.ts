import { Router, type Router as ExpressRouter } from 'express'
import { CategoryLanguageController } from '@/controllers/category_language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	categoryLanguageSchema,
	updateCategoryLanguageSchema,
} from '@/validations/category_language.validation'

/**
 * @swagger
 * tags:
 *   name: CategoryLanguage
 *   description: Category language management endpoints
 */

/**
 * @swagger
 * /add_category_in_other_language:
 *   post:
 *     summary: Add a category in another language
 *     tags: [CategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               language_id:
 *                 type: integer
 *               category_language_name:
 *                 type: string
 *             required:
 *               - category_id
 *               - language_id
 *               - category_language_name
 *     responses:
 *       201:
 *         description: Category language added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
const categoryLanguageRouter: ExpressRouter = Router()

categoryLanguageRouter.post(
	'/add_category_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(categoryLanguageSchema),
	wrapAsync(CategoryLanguageController.add),
)

/**
 * @swagger
 * /all_category_by_language/{language_id}:
 *   get:
 *     summary: Get all categories by language
 *     tags: [CategoryLanguage]
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
 *         description: List of categories by language
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
categoryLanguageRouter.get(
	'/all_category_by_language/:language_id',
	authenticate,
	wrapAsync(CategoryLanguageController.getAll),
)

/**
 * @swagger
 * /get_category_details_by_language/{category_id}/{language_id}:
 *   get:
 *     summary: Get category details by language
 *     tags: [CategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Category details by language
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Category language not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
categoryLanguageRouter.get(
	'/get_category_details_by_language/:category_id/:language_id',
	authenticate,
	wrapAsync(CategoryLanguageController.getById),
)

/**
 * @swagger
 * /update_category_in_other_language/{id}:
 *   put:
 *     summary: Update a category language by ID
 *     tags: [CategoryLanguage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category language ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_language_name:
 *                 type: string
 *               language_id:
 *                 type: integer
 *             required:
 *               - category_language_name
 *               - language_id
 *     responses:
 *       200:
 *         description: Category language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Category language not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
categoryLanguageRouter.put(
	'/update_category_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateCategoryLanguageSchema),
	wrapAsync(CategoryLanguageController.update),
)

export default categoryLanguageRouter
