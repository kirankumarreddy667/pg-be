import { Router } from 'express'
import { OfferController } from '@/controllers/offer.controller' // ✅ correct instance
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { createOfferSchema } from '@/validations/offer.validation'
import { wrapAsync } from '@/utils/asyncHandler'

const offerRouter: Router = Router()

/**
 * @swagger
 * tags:
 *   name: Offer
 *   description: Offer management endpoints
 */

/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get all offers
 *     tags: [Offer]
 *     responses:
 *       200:
 *         description: List of offers
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
offerRouter.get('/offers', wrapAsync(OfferController.getAllOffers))

/**
 * @swagger
 * /offers/{language_id}:
 *   get:
 *     summary: Get offers by language
 *     tags: [Offer]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of offers by language
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
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
offerRouter.get(
	'/offers/:language_id',
	wrapAsync(OfferController.getOffersByLanguage),
)

/**
 * @swagger
 * /offers:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Offer'
 *     responses:
 *       201:
 *         description: Offer created successfully
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
offerRouter.post(
	'/offers',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createOfferSchema),
	wrapAsync(OfferController.createOffer),
)

export default offerRouter
