/**
 * @swagger
 * tags:
 *   name: Summernote
 *   description: Summernote content endpoints
 */

/**
 * @swagger
 * /summernote:
 *   post:
 *     summary: Create summernote content
 *     tags: [Summernote]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Summernote'
 *     responses:
 *       201:
 *         description: Summernote content created
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
import { Router, Response, Request } from 'express'
import { SummernoteController } from '@/controllers/summernote.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import { summernoteSchema } from '@/validations/summernote.validation'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate } from '@/middlewares/auth.middleware'

const router: Router = Router()

router.post(
	'/summernote',
	authenticate,
	validateRequest(summernoteSchema),
	wrapAsync(SummernoteController.store),
)

/**
 * @swagger
 * /summernote:
 *   get:
 *     summary: Render summernote view (HTML)
 *     tags: [Summernote]
 *     responses:
 *       200:
 *         description: HTML view
 */
router.get('/summernote', (req: Request, res: Response) =>
	res.render('summernote'),
)

// router.get('/summernote_display', wrapAsync(SummernoteController.show))

/**
 * @swagger
 * /summernote/{category_id}/{language_id}:
 *   get:
 *     summary: Get summernote by category and language
 *     tags: [Summernote]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Summernote content
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
	'/summernote/:category_id/:language_id',
	wrapAsync(SummernoteController.show),
)

/**
 * @swagger
 * /profitable_farming_article/{category_id}/{language_id}:
 *   get:
 *     summary: Get profitable farming article by category and language
 *     tags: [Summernote]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Profitable farming article
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
	'/profitable_farming_article/:category_id/:language_id',
	wrapAsync(SummernoteController.show),
)

/**
 * @swagger
 * /profitable_farming_article_all:
 *   get:
 *     summary: Get all profitable farming articles
 *     tags: [Summernote]
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get(
	'/profitable_farming_article_all',
	wrapAsync(SummernoteController.index),
)

export default router
