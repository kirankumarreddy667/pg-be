import { Router, type Router as ExpressRouter } from 'express'
import { SubcategoryController } from '@/controllers/sub_category.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { subcategorySchema } from '@/validations/sub_category.validation'

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
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       201:
 *         description: Subcategory created successfully
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
const subcategoryRouter: ExpressRouter = Router()

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
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subcategories
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
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory details
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
 *         description: Subcategory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
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
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
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
 *         description: Subcategory not found
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
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
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
 *         description: Subcategory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
subcategoryRouter.delete(
	'/sub_category/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(SubcategoryController.delete),
)

export default subcategoryRouter
