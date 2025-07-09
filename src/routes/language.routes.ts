import { Router, type Router as ExpressRouter } from 'express'
import { LanguageController } from '@/controllers/language.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createLanguageSchema,
	updateLanguageSchema,
	updateUserLanguageSchema,
} from '@/validations/language.validation'

/**
 * @swagger
 * tags:
 *   name: Language
 *   description: Language management endpoints
 */

/**
 * @swagger
 * /language:
 *   get:
 *     summary: Get all languages
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of languages
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
const languageRouter: ExpressRouter = Router()

languageRouter.get(
	'/language',
	authenticate,
	wrapAsync(LanguageController.getAllLanguages),
)
/**
 * @swagger
 * /language:
 *   post:
 *     summary: Create a new language
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       201:
 *         description: Language created successfully
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
languageRouter.post(
	'/language',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createLanguageSchema),
	wrapAsync(LanguageController.createLanguage),
)
/**
 * @swagger
 * /language/{id}:
 *   put:
 *     summary: Update a language
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       200:
 *         description: Language updated successfully
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
 *         description: Language not found
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
languageRouter.put(
	'/language/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(updateLanguageSchema),
	wrapAsync(LanguageController.updateLanguage),
)
/**
 * @swagger
 * /user_language:
 *   put:
 *     summary: Update user language
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserLanguage'
 *     responses:
 *       200:
 *         description: User language updated
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
languageRouter.put(
	'/user_language',
	authenticate,
	validateRequest(updateUserLanguageSchema),
	wrapAsync(LanguageController.updateUserLanguage),
)

export default languageRouter
