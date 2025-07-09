import { Router, type Router as ExpressRouter } from 'express'
import { UnitController } from '@/controllers/unit.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createUnitSchema,
	updateUnitSchema,
} from '@/validations/unit.validation'

const unitRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Unit
 *   description: Unit management endpoints
 */

/**
 * @swagger
 * /unit:
 *   get:
 *     summary: Get all units
 *     tags: [Unit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of units
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

unitRouter.get('/unit', authenticate, wrapAsync(UnitController.getAllUnits))

/**
 * @swagger
 * /unit/{id}:
 *   get:
 *     summary: Get unit by ID
 *     tags: [Unit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit details
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
 *         description: Unit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
unitRouter.get('/unit/:id', authenticate, wrapAsync(UnitController.getUnitById))

/**
 * @swagger
 * /unit:
 *   post:
 *     summary: Create a new unit
 *     tags: [Unit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       201:
 *         description: Unit created successfully
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
unitRouter.post(
	'/unit',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createUnitSchema),
	wrapAsync(UnitController.createUnit),
)

/**
 * @swagger
 * /unit/{id}:
 *   put:
 *     summary: Update a unit
 *     tags: [Unit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       200:
 *         description: Unit updated successfully
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
 *         description: Unit not found
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
unitRouter.put(
	'/unit/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateUnitSchema),
	wrapAsync(UnitController.updateUnit),
)

/**
 * @swagger
 * /unit/{id}:
 *   delete:
 *     summary: Delete a unit
 *     tags: [Unit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit deleted successfully
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
 *         description: Unit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
unitRouter.delete(
	'/unit/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(UnitController.deleteUnit),
)

export default unitRouter
