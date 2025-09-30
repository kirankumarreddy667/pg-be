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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "MaxWeight"
 *               description:
 *                 type: string
 *                 example: "Maximum allowed weight"
 *               constant_value:
 *                 type: integer
 *                 example: 100
 *             required:
 *               - name
 *               - constant_value
 *               - description
 *     responses:
 *       200:
 *         description: Validation rule created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "MaxWeight"
 *               description:
 *                 type: string
 *                 example: "Maximum allowed weight"
 *               constant_value:
 *                 type: integer
 *                 example: 100
 *             required:
 *               - name
 *               - constant_value
 *               - description
 *     responses:
 *       200:
 *         description: Validation rule updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Validation rule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The given data was invalid."
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "MaxWeight"
 *                       description:
 *                         type: string
 *                         example: "Maximum allowed weight"
 *                       constant_value:
 *                         type: integer
 *                         example: 100
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-18 10:00:00"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-18 12:00:00"
 *                       deleted_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "MaxWeight"
 *                         description:
 *                           type: string
 *                           example: "Maximum allowed weight"
 *                         constant_value:
 *                           type: integer
 *                           example: 100
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-07-18 10:00:00"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-07-18 12:00:00"
 *                         deleted_at:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                     - type: 'null'
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Validation rule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Validation rule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
