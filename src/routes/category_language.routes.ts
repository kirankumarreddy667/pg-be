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

const categoryLanguageRouter: ExpressRouter = Router()

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
 *           example:
 *             category_id: 2
 *             language_id: 1
 *             category_language_name: "Breeding Details"
 *     responses:
 *       200:
 *         description: Category language added successfully
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "success"
 *               status: 200
 *       404:
 *         description: Category or Language not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Category not found."
 *               status: 404
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       422:
 *         description: Validation error (duplicate translation)
 *         content:
 *           application/json:
 *             example:
 *               message: "The given data was invalid."
 *               errors:
 *                 category_id: ["This category already has a translation in this language."]
 *               status: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *               status: 500
 */
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
 *     responses:
 *       200:
 *         description: List of categories by language
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - category_id: 2
 *                   category_language_name: "Breeding Details"
 *                   category_name: "Breeding Details"
 *                   category_language_id: 2
 *                   created_at: "2018-11-02 11:43:05"
 *                   updated_at: "2018-11-02 11:43:05"
 *                   deleted_at: null
 *               message: "success"
 *               status: 200
 *       401:
 *         description : Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *               data: []
 *               status: 401
 *       404:
 *         description: Language not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Not found."
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *               status: 500
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Category details by language
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 category_id: 2
 *                 category_language_name: "Breeding Details"
 *                 category_name: null
 *                 created_at: "2018-11-02 11:43:05"
 *                 updated_at: "2018-11-02 11:43:05"
 *                 deleted_at: null
 *               message: "success"
 *               status: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *               data: []
 *               status: 401
 *    
 *       404:
 *         description: Category or Language not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Not found."
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *               status: 500
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
 *             example:
 *               data: []
 *               message: "success"
 *               status: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *            application/json:
 *              example:
 *                message: "Unauthorized"
 *                data: []
 *                status: 401
 *       404:
 *         description: Category language not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Not found."
 *               status: 404
 *       422:
 *         description: Validation error (duplicate name)
 *         content:
 *           application/json:
 *             example:
 *               message: "The given data was invalid."
 *               errors:
 *                 category_language_name: ["This name already exists for this language."]
 *               status: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *               status: 500
 */
categoryLanguageRouter.put(
  '/update_category_in_other_language/:id',
  authenticate,
  wrapAsync(authorize(['SuperAdmin'])),
  validateRequest(updateCategoryLanguageSchema),
  wrapAsync(CategoryLanguageController.update),
)

export default categoryLanguageRouter
