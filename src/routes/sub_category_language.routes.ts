import { Router, type Router as ExpressRouter } from 'express'
import { SubCategoryLanguageController } from '@/controllers/sub_category_language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	subCategoryLanguageSchema,
	updateSubCategoryLanguageSchema,
} from '@/validations/sub_category_language.validation'

/**
 * @swagger
 * tags:
 *   name: SubCategoryLanguage
 *   description: Subcategory language management endpoints
 */

const subCategoryLanguageRouter: ExpressRouter = Router()

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
 *             type: object
 *             properties:
 *               sub_category_id:
 *                 type: integer
 *                 example: 2
 *               language_id:
 *                 type: integer
 *                 example: 2
 *               sub_category_language_name:
 *                 type: string
 *                 example: "Provide details of animals in your farm using questions below"
 *             required:
 *               - sub_category_id
 *               - language_id
 *               - sub_category_language_name
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   example: []
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   example: []
 */
subCategoryLanguageRouter.post(
	'/add_sub_category_in_other_language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subCategoryLanguageSchema),
	wrapAsync(SubCategoryLanguageController.add),
)

/**
 * @swagger
 * /get_all_sub_category_details_by_language/{language_id}:
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
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example:
 *                     - sub_category_id: 2
 *                       sub_category_name: Provide details of animals
 *                       sub_category_language_name: "खालील प्रश्नांची उत्तरे द्या"
 *                       sub_category_language_id: 10
 *                 message:
 *                   type: string
 *                   example: Success
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   example: []
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not found.
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   example: []
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
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example:
 *                     sub_category_id: 2
 *                     sub_category_name: Provide details of animals
 *                     sub_category_language_name: "खालील प्रश्नांची उत्तरे द्या"
 *                 message:
 *                   type: string
 *                   example: Success
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   example: []
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: Not found.
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   example: []
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
 *             type: object
 *             properties:
 *               sub_category_language_name:
 *                 type: string
 *                 example: "Provide details of animals in your farm using questions below"
 *               language_id:
 *                 type: integer
 *                 example: 2
 *             required:
 *               - sub_category_language_name
 *               - language_id
 *     responses:
 *       200:
 *         description: Subcategory language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: Success
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   example: []
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example: []
 *                 message:
 *                   type: string
 *                   example: Not found.
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   example: []
 */
subCategoryLanguageRouter.put(
	'/update_sub_category_in_other_language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateSubCategoryLanguageSchema),
	wrapAsync(SubCategoryLanguageController.update),
)

export default subCategoryLanguageRouter
