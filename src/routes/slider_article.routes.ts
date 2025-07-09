/**
 * @swagger
 * tags:
 *   name: SliderArticle
 *   description: Slider article endpoints
 */

/**
 * @swagger
 * /slider_article:
 *   post:
 *     summary: Add a slider article
 *     tags: [SliderArticle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SliderArticle'
 *     responses:
 *       201:
 *         description: Slider article added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
import { Router } from 'express'
import { SliderArticleController } from '@/controllers/slider_article.controller'
import { sliderArticleSchema } from '@/validations/slider_article.validation'
import { validateRequest } from '@/middlewares/validateRequest'

const router: Router = Router()

router.post(
	'/slider_article',
	validateRequest(sliderArticleSchema),
	SliderArticleController.addArticle,
)

/**
 * @swagger
 * /slider_article/{language_id}:
 *   get:
 *     summary: Get slider articles by language
 *     tags: [SliderArticle]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of slider articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/slider_article/:language_id',
	SliderArticleController.getArticle,
)

export default router
