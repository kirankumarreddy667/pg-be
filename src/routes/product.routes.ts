import { Router } from 'express'
import { ProductController } from '@/controllers/product.controller'
import { productSchema } from '@/validations/product.validation'
import { validateRequest } from '@/middlewares/validateRequest'
import { wrapAsync } from '@/utils/asyncHandler'

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add new products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_category_id
 *                     - language
 *                     - product_title
 *                     - product_images
 *                     - thumbnail
 *                   properties:
 *                     product_category_id:
 *                       type: integer
 *                       example: 1
 *                     language:
 *                       type: integer
 *                       example: 2
 *                     product_title:
 *                       type: string
 *                       example: "iPhone 16 Pro"
 *                     product_images:
 *                       type: string
 *                       example: "iphone1.png,iphone2.png"
 *                     product_amount:
 *                       type: number
 *                       example: 1299.99
 *                     product_description:
 *                       type: string
 *                       example: "Latest Apple iPhone with titanium design"
 *                     product_variants:
 *                       type: string
 *                       example: "128GB,256GB,512GB"
 *                     product_delivery_to:
 *                       type: string
 *                       example: "Worldwide"
 *                     product_specifications:
 *                       type: string
 *                       example: "6.7-inch OLED, A18 Pro chip"
 *                     thumbnail:
 *                       type: string
 *                       example: "iphone-thumb.png"
 *     responses:
 *       200:
 *         description: Product(s) added successfully
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

/**
 * @swagger
 * /products/{category_id}/{language_id}:
 *   get:
 *     summary: Get products by category and language
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product category ID
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of products
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
 *                       product_id:
 *                         type: integer
 *                         example: 10
 *                       product_category_id:
 *                         type: integer
 *                         example: 1
 *                       language:
 *                         type: integer
 *                         example: 2
 *                       product_title:
 *                         type: string
 *                         example: "iPhone 16 Pro"
 *                       product_images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "https://dev.dosen.io/Images/iphone1.png"
 *                           - "https://dev.dosen.io/Images/iphone2.png"
 *                       product_amount:
 *                         type: number
 *                         example: 1299.99
 *                       product_description:
 *                         type: string
 *                         example: "Latest Apple iPhone with titanium design"
 *                       product_variants:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["128GB", "256GB", "512GB"]
 *                       product_delivery_to:
 *                         type: string
 *                         example: "Worldwide"
 *                       product_specifications:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["6.7-inch OLED", "A18 Pro chip"]
 *                       thumbnail:
 *                         type: string
 *                         example: "https://dev.dosen.io/Images/iphone-thumb.png"
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
 *         description: Products not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Products not found"
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

const router: Router = Router()

router.post(
	'/products',
	validateRequest(productSchema),
	ProductController.addProducts,
)

router.get(
	'/products/:category_id/:language_id',
	wrapAsync(ProductController.getProducts),
)

export default router
