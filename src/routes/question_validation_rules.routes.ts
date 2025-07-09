import { Router } from 'express'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { ValidationRuleController } from '@/controllers/validation_rule.controller'
import { validationRuleSchema } from '@/validations/validation_rule.validation'

/**
 * @swagger
 * tags:
 *   name: QuestionValidationRule
 *   description: Question validation rule endpoints
 */

/**
 * @swagger
 * /validation:
 *   post:
 *     summary: Create a validation rule
 *     tags: [QuestionValidationRule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationRule'
 *     responses:
 *       201:
 *         description: Validation rule created
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

/**
 * @swagger
 * /validation/{id}:
 *   put:
 *     summary: Update a validation rule by ID
 *     tags: [QuestionValidationRule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Validation rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationRule'
 *     responses:
 *       200:
 *         description: Validation rule updated
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
 *         description: Validation rule not found
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

/**
 * @swagger
 * /validation:
 *   get:
 *     summary: Get all validation rules
 *     tags: [QuestionValidationRule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of validation rules
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

/**
 * @swagger
 * /validation/{id}:
 *   get:
 *     summary: Get validation rule by ID
 *     tags: [QuestionValidationRule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Validation rule ID
 *     responses:
 *       200:
 *         description: Validation rule details
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
 *         description: Validation rule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

/**
 * @swagger
 * /validation/{id}:
 *   delete:
 *     summary: Delete a validation rule by ID
 *     tags: [QuestionValidationRule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Validation rule ID
 *     responses:
 *       200:
 *         description: Validation rule deleted
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
 *         description: Validation rule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */

const router: Router = Router()

router.post(
	'/validation',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(validationRuleSchema),
	wrapAsync(ValidationRuleController.create),
)

router.put(
	'/validation/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(validationRuleSchema),
	wrapAsync(ValidationRuleController.update),
)

router.get(
	'/validation',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(ValidationRuleController.getAll),
)

router.get(
	'/validation/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(ValidationRuleController.getById),
)

router.delete(
	'/validation/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(ValidationRuleController.deleteById),
)

export default router
