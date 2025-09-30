import { Router, type Router as ExpressRouter } from 'express'
import { SliderArticleController } from '@/controllers/slider_article.controller'
import { sliderArticleSchema } from '@/validations/slider_article.validation'
import { validateRequest } from '@/middlewares/validateRequest'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate } from '@/middlewares/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: SliderArticle
 *   description: Slider article management endpoints
 */

const sliderArticleRouter: ExpressRouter = Router()

/**
 * @swagger
 * /slider_article:
 *   post:
 *     summary: Add a slider article
 *     tags: [SliderArticle]
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
 *                   required:
 *                     - language_id
 *                     - name
 *                     - image
 *                     - web_url
 *                     - thumbnail
 *                   properties:
 *                     language_id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Exciting New Feature"
 *                     image:
 *                       type: string
 *                       example: "slider1.jpg"
 *                     web_url:
 *                       type: string
 *                       example: "https://example.com/article"
 *                     subtitle:
 *                       type: string
 *                       example: "A short description of the article"
 *                     thumbnail:
 *                       type: string
 *                       example: "slider1-thumb.jpg"
 *             required:
 *               - data
 *     responses:
 *       200:
 *         description: Slider article(s) added successfully
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
sliderArticleRouter.post(
	'/slider_article',
	authenticate,
	validateRequest(sliderArticleSchema),
	wrapAsync(SliderArticleController.addArticle),
)

/**
 * @swagger
 * /slider_article/{language_id}:
 *   get:
 *     summary: Get slider articles by language
 *     tags: [SliderArticle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *         example: 2
 *     responses:
 *       200:
 *         description: List of slider articles
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
 *                       sliderArticleId:
 *                         type: integer
 *                         example: 1
 *                       language_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Exciting New Feature"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/Images/slider1.jpg"
 *                       web_url:
 *                         type: string
 *                         example: "https://example.com/article"
 *                       subtitle:
 *                         type: string
 *                         example: "A short description of the article"
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/Images/thumbnail/slider1-thumb.jpg"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-14T10:00:00Z"
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
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No articles found for the given language"
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
sliderArticleRouter.get(
	'/slider_article/:language_id',
	authenticate,
	wrapAsync(SliderArticleController.getArticle),
)

export default sliderArticleRouter
