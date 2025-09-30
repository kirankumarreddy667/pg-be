import { Router, type Router as ExpressRouter } from 'express'
import { SubcategoryController } from '@/controllers/sub_category.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { subcategorySchema } from '@/validations/sub_category.validation'

const subcategoryRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: SubCategory
 *   description: Subcategory management endpoints
 */

/**
 * @swagger
 * /sub_category:
 *   post:
 *     summary: Create a new subcategory
 *     description: Creates a new subcategory with the provided name and parent category ID.
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subcategory
 *                 example: "Milk Products"
 *             required: [name]
 *     responses:
 *       200:
 *         description: Subcategory created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: {}
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *             example:
 *               data: []
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request — Invalid data provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Bad request"
 *               status: 400
 *       401:
 *         description: Unauthorized — Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       403:
 *         description: Forbidden — User does not have required permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Access denied"
 *               status: 403
 *       422:
 *         description: Unprocessable entity.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "The subcategory name has already been taken."
 *               status: 422
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
subcategoryRouter.post(
	'/sub_category',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subcategorySchema),
	wrapAsync(SubcategoryController.create),
)

/**
 * @swagger
 * /sub_category:
 *   get:
 *     summary: Get all subcategories
 *     description: Retrieves all active (non-deleted) subcategories.
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subcategories retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, description: "Subcategory ID", example: 1 }
 *                       name: { type: string, description: "Subcategory name", example: "Milk Products" }
 *                       category_id: { type: integer, description: "Parent category ID", example: 1 }
 *                       created_at: { type: string, format: date-time, example: "2024-01-15T10:30:00.000Z" }
 *                       updated_at: { type: string, format: date-time, example: "2024-01-15T10:30:00.000Z" }
 *                       deleted_at: { type: string, format: date-time, nullable: true, example: null }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data:
 *                 - id: 1
 *                   name: "Milk Products"
 *                   category_id: 1
 *                   created_at: "2024-01-15T10:30:00.000Z"
 *                   updated_at: "2024-01-15T10:30:00.000Z"
 *                   deleted_at: null
 *                 - id: 2
 *                   name: "Cheese Products"
 *                   category_id: 1
 *                   created_at: "2024-01-15T11:00:00.000Z"
 *                   updated_at: "2024-01-15T11:00:00.000Z"
 *                   deleted_at: null
 *               message: "Success"
 *               status: 200
 *       401:
 *         description: Unauthorized — Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
subcategoryRouter.get(
	'/sub_category',
	authenticate,
	wrapAsync(SubcategoryController.getAll),
)

/**
 * @swagger
 * /sub_category/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     description: Retrieves a specific subcategory by its ID.
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Subcategory ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Subcategory details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     name: { type: string, example: "Milk Products" }
 *                     created_at: { type: string, format: date-time, example: "2024-01-15T10:30:00.000Z" }
 *                     updated_at: { type: string, format: date-time, example: "2024-01-15T10:30:00.000Z" }
 *                     deleted_at: { type: string, format: date-time, nullable: true, example: null }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data:
 *                 id: 1
 *                 name: "Milk Products"
 *                 created_at: "2024-01-15T10:30:00.000Z"
 *                 updated_at: "2024-01-15T10:30:00.000Z"
 *                 deleted_at: null
 *               message: "Success"
 *               status: 200
 *       401:
 *         description: Unauthorized — Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
subcategoryRouter.get(
	'/sub_category/:id',
	authenticate,
	wrapAsync(SubcategoryController.getById),
)

/**
 * @swagger
 * /sub_category/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     description: Updates an existing subcategory with new data.
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         description: Subcategory ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated subcategory name
 *                 example: "Updated Milk Products"
 *     responses:
 *       200:
 *         description: Subcategory updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request — Invalid data or ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Bad request"
 *               status: 400
 *       401:
 *         description: Unauthorized — Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       403:
 *         description: Forbidden — User does not have required permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Access denied"
 *               status: 403
 *       404:
 *         description: Not found — Subcategory or parent category does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Subcategory not found"
 *               status: 404
 *       422:
 *         description: Unprocessable entity.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "The subcategory name has already been taken."
 *               status: 422
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
subcategoryRouter.put(
	'/sub_category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(subcategorySchema),
	wrapAsync(SubcategoryController.update),
)

/**
 * @swagger
 * /sub_category/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     description: Soft deletes a subcategory (sets deleted_at timestamp).
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Subcategory ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request — Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Invalid subcategory ID"
 *               status: 400
 *       401:
 *         description: Unauthorized — Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Unauthorized"
 *               status: 401
 *       403:
 *         description: Forbidden — User does not have required permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Access denied"
 *               status: 403
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: array, items: {} }
 *                 message: { type: string }
 *                 status: { type: integer }
 *             example:
 *               data: []
 *               message: "Internal server error"
 *               status: 500
 */
subcategoryRouter.delete(
	'/sub_category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(SubcategoryController.delete),
)

export default subcategoryRouter
