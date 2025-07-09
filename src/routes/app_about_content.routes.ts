import { Router } from 'express'
import { AppAboutContentController } from '@/controllers/app_about_content.controller'

const router: Router = Router()

/**
 * @swagger
 * tags:
 *   name: AppAboutContent
 *   description: App about content endpoints
 */

/**
 * @swagger
 * /about_app_data/{language_id}/{name}:
 *   get:
 *     summary: Get app about content by language and type
 *     tags: [AppAboutContent]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Content type (e.g., 'about', 'privacy', etc.)
 *     responses:
 *       200:
 *         description: App about content fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/about_app_data/:language_id/:name',
	AppAboutContentController.getAppAboutContents,
)

export default router
