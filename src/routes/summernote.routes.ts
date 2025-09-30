import { Router, Response, Request } from 'express'
import { SummernoteController } from '@/controllers/summernote.controller'
import { wrapAsync } from '@/utils/asyncHandler'

const router: Router = Router()
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
 *     summary: Submit Summernote content
 *     tags: [Summernote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summernoteInput:
 *                 type: string
 *                 description: HTML content from Summernote editor
 *                 example: "<p>Hello <b>World</b></p>"
 *     responses:
 *       200:
 *         description: Rendered Summernote content display page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html><body><p>Hello World</p></body></html>"
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

router.post('/summernote', wrapAsync(SummernoteController.store))

/**
 * @swagger
 * /summernote:
 *   get:
 *     summary: Render Summernote editor
 *     tags: [Summernote]
 *     responses:
 *       200:
 *         description: Summernote editor HTML page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html><body>...</body></html>"
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
router.get('/summernote', (req: Request, res: Response) =>
	res.render('summernote'),
)

/**
 * @swagger
 * /profitable_farming_article/{category_id}/{language_id}:
 *   get:
 *     summary: Get profitable farming articles by category and language
 *     tags: [Summernote]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *       - in: path
 *         name: language_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
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
 *                       article_id:
 *                         type: integer
 *                         example: 1
 *                       article_thumb:
 *                         type: string
 *                         example: "http://localhost:8888/Images/thumb.jpg"
 *                       article_header:
 *                         type: string
 *                         example: "उच्च प्रतीचं स्वच्छ दर्जेदार दूध-उत्पादन कसे करावे !"
 *                       article_summary:
 *                         type: string
 *                         example: "दुध धंद्याला वलय आणि नफा मिळवून देण्यासाठी..."
 *                       article_images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             img:
 *                               type: string
 *                               example: "http://localhost:8888/Images/Dairy_2.jpg"
 *                             name:
 *                               type: string
 *                               example: "पारंपरिक गोठा"
 *                       article_body:
 *                         type: string
 *                         example: "<p>HTML article content...</p>"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: No articles found
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
 *         description: Articles retrieved successfully
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
 *                       article_id:
 *                         type: integer
 *                         example: 2
 *                       article_thumb:
 *                         type: string
 *                         example: "http://localhost:8888/Images/thumb2.jpg"
 *                       article_header:
 *                         type: string
 *                         example: "दुसरी हेडलाईन"
 *                       article_summary:
 *                         type: string
 *                         example: "दुसरी समरी"
 *                       article_images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             img:
 *                               type: string
 *                               example: "http://localhost:8888/Images/Dairy_4.jpg"
 *                             name:
 *                               type: string
 *                               example: "मुक्त संचार गोठा"
 *                       article_body:
 *                         type: string
 *                         example: "<p>Another article body...</p>"
 *                       article_category_id:
 *                         type: integer
 *                         example: 1
 *                       language_id:
 *                         type: integer
 *                         example: 19
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
router.get(
	'/profitable_farming_article_all',
	wrapAsync(SummernoteController.index),
)

export default router
