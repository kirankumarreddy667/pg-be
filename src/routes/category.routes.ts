import { Router, type Router as ExpressRouter } from 'express'
import { CategoryController } from '@/controllers/category.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { categorySchema } from '@/validations/category.validation'

const categoryRouter: ExpressRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the category
 *         name:
 *           type: string
 *           description: Name of the category
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Soft delete timestamp
 *       required:
 *         - name
 *
 *     CategoryCreateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the category
 *           example: "Dairy Products"
 *       required:
 *         - name
 *
 *     CategoryUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated name of the category
 *           example: "Updated Dairy Products"
 *       required:
 *         - name
 *
 *     SuccessResponse:
 *       type: object
 *       properties:

 *         data:
 *           type: object
 *           description: Response data
 *         message:
 *           type: string
 *           example: "Success"
 *         status:
 *           type: integer
 *           example: 200
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "name"
 *               message:
 *                 type: string
 *                 example: "Name is required"
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category with the provided name
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Dairy Products"
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Bad request"
 *               status: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Access denied"
 *               status: 403
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Category name already exists"
 *               status: 409
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Validation failed"
 *               status: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
categoryRouter.post(
	'/category',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(categorySchema),
	wrapAsync(CategoryController.create),
)

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves all active categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 1
 *                   name: "Dairy Products"
 *                   sequence_number: 1
 *                   created_at: "2024-01-15T10:30:00.000Z"
 *                   updated_at: "2024-01-15T10:30:00.000Z"
 *                   deleted_at: null
 *                 - id: 2
 *                   name: "Meat Products"
 *                   sequence_number: 2
 *                   created_at: "2024-01-15T11:00:00.000Z"
 *                   updated_at: "2024-01-15T11:00:00.000Z"
 *                   deleted_at: null
 *               message: "Success"
 *               status: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */

categoryRouter.get(
	'/category',
	authenticate,
	wrapAsync(CategoryController.getAll),
)

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieves a category by its ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 107
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: 1
 *                 name: "Dairy Products"
 *                 sequence_number: 1
 *                 created_at: "2024-01-15T10:30:00.000Z"
 *                 updated_at: "2024-01-15T10:30:00.000Z"
 *                 deleted_at: null
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Invalid category ID"
 *               status: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Category not found"
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */

categoryRouter.get(
	'/category/:id',
	authenticate,
	wrapAsync(CategoryController.getById),
)

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update category by ID
 *     description: Updates an existing category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 106
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Milk Collection Record"
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Bad request"
 *               status: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Access denied"
 *               status: 403
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Category not found"
 *               status: 404
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Category name already exists"
 *               status: 409
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Validation failed"
 *               status: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
categoryRouter.put(
	'/category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(categorySchema),
	wrapAsync(CategoryController.update),
)
/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     description: Soft deletes a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       200:
 *         description: Category deleted
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Invalid category ID"
 *               status: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Access denied"
 *               status: 403
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Category not found"
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
categoryRouter.delete(
	'/category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(CategoryController.delete),
)

export default categoryRouter
