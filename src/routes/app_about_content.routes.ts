import { Router, type Router as ExpressRouter } from 'express'
import { AppAboutContentController } from '@/controllers/app_about_content.controller'
import { wrapAsync } from '@/utils/asyncHandler'
import { authenticate } from '@/middlewares/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: AppAboutContent
 *   description: App about content endpoints
 */

const appAboutContentRouter: ExpressRouter = Router()

/**
 * @swagger
 * /about_app_data/{language_id}/{name}:
 *   get:
 *     summary: Get app about content by language and type
 *     tags: [AppAboutContent]
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
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Content type (e.g., 'about', 'privacy')
 *         example: "about"
 *     responses:
 *       200:
 *         description: App about content fetched successfully
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
 *                       type:
 *                         type: string
 *                         example: "about"
 *                       language_id:
 *                         type: integer
 *                         example: 2
 *                       content:
 *                         type: string
 *                         example: "<p>About app description...</p>"
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
appAboutContentRouter.get(
	'/about_app_data/:language_id/:name',
	authenticate,
	wrapAsync(AppAboutContentController.getAppAboutContents),
)

export default appAboutContentRouter
