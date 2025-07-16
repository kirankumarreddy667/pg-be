import { Router, type Router as ExpressRouter } from 'express'
import { FormTypeController } from '@/controllers/form_type.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { formTypeSchema } from '@/validations/form_type.validation'

const formTypeRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: FormType
 *   description: Form type management endpoints
 */

/**
 * @swagger
 * /form_type:
 *   post:
 *     summary: Create a new form type
 *     tags: [FormType]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormType'
 *     responses:
 *       201:
 *         description: Form type created successfully
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

formTypeRouter.post(
	'/form-type',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(formTypeSchema),
	wrapAsync(FormTypeController.createFormType),
)

/**
 * @swagger
 * /form_type:
 *   get:
 *     summary: Get all form types
 *     tags: [FormType]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of form types
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
formTypeRouter.get(
	'/form-type',
	authenticate,
	wrapAsync(FormTypeController.getAllFormTypes),
)

/**
 * @swagger
 * /form_type/{id}:
 *   put:
 *     summary: Update a form type by ID
 *     tags: [FormType]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Form type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormType'
 *     responses:
 *       200:
 *         description: Form type updated successfully
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
 *         description: Form type not found
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
formTypeRouter.put(
	'/form-type/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(formTypeSchema),
	wrapAsync(FormTypeController.updateFormType),
)

/**
 * @swagger
 * /form_type/{id}:
 *   get:
 *     summary: Get a form type by ID
 *     tags: [FormType]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Form type ID
 *     responses:
 *       200:
 *         description: Form type details
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
 *         description: Form type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
formTypeRouter.get(
	'/form-type/:id',
	authenticate,
	wrapAsync(FormTypeController.getFormTypeById),
)

/**
 * @swagger
 * /form_type/{id}:
 *   delete:
 *     summary: Delete a form type by ID
 *     tags: [FormType]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Form type ID
 *     responses:
 *       200:
 *         description: Form type deleted successfully
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
 *         description: Form type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
formTypeRouter.delete(
	'/form-type/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(FormTypeController.deleteFormTypeById),
)

export default formTypeRouter
