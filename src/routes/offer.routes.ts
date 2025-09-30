import { Router } from 'express'
import { OfferController } from '@/controllers/offer.controller'
import { authenticate } from '@/middlewares/auth.middleware'
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       offer_id:
 *                         type: integer
 *                         example: 1
 *                       offer_name:
 *                         type: string
 *                         example: "Summer Discount"
 *                       offer_type:
 *                         type: string
 *                         example: "product"
 *                       plan_id:
 *                         type: integer
 *                         example: 3
 *                       product_id:
 *                         type: integer
 *                         example: 5
 *                       offer_title:
 *                         type: string
 *                         example: "Limited Time Offer"
 *                       offer_description:
 *                         type: string
 *                         example: "Get 20% off"
 *                       original_amount:
 *                         type: number
 *                         example: 500
 *                       offer_amount:
 *                         type: number
 *                         example: 400
 *                       image_url:
 *                         type: string
 *                         example: "https://example.com/Images/offer.png"
 *                 status:
 *                   type: integer
 *                   example: 200
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
 *         description: List of offers for the specified language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       offer_id:
 *                         type: integer
 *                         example: 1
 *                       offer_name:
 *                         type: string
 *                         example: "Winter Deal"
 *                       offer_type:
 *                         type: string
 *                         example: "plan"
 *                       plan_id:
 *                         type: integer
 *                         example: 2
 *                       product_id:
 *                         type: integer
 *                         example: null
 *                       offer_title:
 *                         type: string
 *                         example: "Exclusive Plan Discount"
 *                       offer_description:
 *                         type: string
 *                         example: "Save 15%"
 *                       original_amount:
 *                         type: number
 *                         example: 1000
 *                       offer_amount:
 *                         type: number
 *                         example: 850
 *                       image_url:
 *                         type: string
 *                         example: "https://example.com/Images/offer2.png"
 *                       language_id:
 *                         type: integer
 *                         example: 1
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Not found
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
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Festive Sale"
 *                     amount:
 *                       type: number
 *                       example: 50
 *                     plan_id:
 *                       type: integer
 *                       example: null
 *                     product_id:
 *                       type: integer
 *                       example: 3
 *                     title:
 *                       type: string
 *                       example: "Special Product Discount"
 *                     description:
 *                       type: string
 *                       example: "Flat ₹50 off"
 *                     offer_type:
 *                       type: string
 *                       example: "product"
 *               language_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - data
 *               - language_id
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 201
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
offerRouter.post(
	'/offers',
	authenticate,
	validateRequest(createOfferSchema),
	wrapAsync(OfferController.createOffer),
)

export default offerRouter
