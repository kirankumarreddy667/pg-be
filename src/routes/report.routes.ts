import { Router } from 'express'
import { ReportController } from '@/controllers/report.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { checkUserStatus } from '@/middlewares/checkUserStatus.middleware'
import { reportSchema } from '@/validations/report.validation'
import { validateRequest } from '@/middlewares/validateRequest'
import { wrapAsync } from '@/utils/asyncHandler'

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management endpoints
 */

const router: Router = Router()

/**
 * @swagger
 * /generate_pdf:
 *   post:
 *     summary: Generate PDF report and send via email
 *     description: Generates various types of PDF reports based on the report_type and sends them to the specified email address
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - report_type
 *               - email
 *             properties:
 *               report_type:
 *                 type: string
 *                 enum:
 *                   - health_report
 *                   - manure_production
 *                   - milk_production_quality
 *                   - profit_loss_with_purchase_selling_price
 *                   - profit_loss
 *                   - income_expense
 *                   - milk_production_quantity
 *                   - milk_output_report
 *                   - animal_profile_certificate
 *                   - animal_breeding_history_report
 *                 description: Type of report to generate
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to send the PDF report
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date for date-range reports (YYYY-MM-DD)
 *                 example: "2024-01-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date for date-range reports (YYYY-MM-DD)
 *                 example: "2024-12-31"
 *               animal_id:
 *                 type: integer
 *                 description: Animal ID for animal-specific reports
 *                 example: 123
 *               animal_number:
 *                 type: string
 *                 description: Animal number for animal-specific reports
 *                 example: "AN001"
 *             example:
 *               report_type: "health_report"
 *               email: "user@example.com"
 *               start_date: "2024-01-01"
 *               end_date: "2024-12-31"
 *     responses:
 *       200:
 *         description: PDF report generated and sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   example: []
 */
router.post(
	'/generate_pdf',
	authenticate,
	wrapAsync(checkUserStatus),
	validateRequest(reportSchema),
	wrapAsync(ReportController.generatePdf),
)

/**
 * @swagger
 * /profit_loss_report_graph/{start_date}/{end_date}:
 *   get:
 *     summary: Get profit/loss report for graph
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Profit/loss report data retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       profitWithoutSellingAndPurchasePrice:
 *                         type: string
 *                         example: "1500.50"
 *                       lossWithoutSellingAndPurchasePrice:
 *                         type: string
 *                         example: "0.00"
 *                       breedingExpense:
 *                         type: string
 *                         example: "250.00"
 *                   example: [
 *                     {
 *                       "date": "2024-01-15",
 *                       "profitWithoutSellingAndPurchasePrice": "1500.50",
 *                       "lossWithoutSellingAndPurchasePrice": "0.00",
 *                       "breedingExpense": "250.00"
 *                     }
 *                   ]
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid date format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format. Use YYYY-MM-DD"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
	'/profit_loss_report_graph/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.profitLossGraphReport),
)

/**
 * @swagger
 * /milk_production_quantity_graph_data/{start_date}/{end_date}:
 *   get:
 *     summary: Get milk production quantity graph data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Milk production quantity data retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       milkProdMorning:
 *                         type: string
 *                         example: "15.50"
 *                         description: Morning milk production in litres
 *                       milkProdEvening:
 *                         type: string
 *                         example: "12.75"
 *                         description: Evening milk production in litres
 *                   example: [
 *                     {
 *                       "date": "2024-01-15",
 *                       "milkProdMorning": "15.50",
 *                       "milkProdEvening": "12.75"
 *                     }
 *                   ]
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid date format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format. Use YYYY-MM-DD"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
	'/milk_production_quantity_graph_data/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.milkProductionQuantityGraphData),
)

/**
 * @swagger
 * /fat_percentage_graph_data/{start_date}/{end_date}:
 *   get:
 *     summary: Get fat percentage graph data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Fat percentage data retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       totalMorningFat:
 *                         type: string
 *                         example: "4.25"
 *                         description: Total morning fat percentage
 *                       totaleveningFat:
 *                         type: string
 *                         example: "4.50"
 *                         description: Total evening fat percentage
 *                   example: [
 *                     {
 *                       "date": "2024-01-15",
 *                       "totalMorningFat": "4.25",
 *                       "totaleveningFat": "4.50"
 *                     }
 *                   ]
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid date format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format. Use YYYY-MM-DD"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
	'/fat_percentage_graph_data/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.fatPercentageGraphData),
)

/**
 * @swagger
 * /SNF_percentage_graph_data/{start_date}/{end_date}:
 *   get:
 *     summary: Get SNF percentage graph data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: SNF percentage data retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       totalMorningSNF:
 *                         type: string
 *                         example: "8.75"
 *                         description: Total morning SNF percentage
 *                       totaleveningSNF:
 *                         type: string
 *                         example: "8.90"
 *                         description: Total evening SNF percentage
 *                   example: [
 *                     {
 *                       "date": "2024-01-15",
 *                       "totalMorningSNF": "8.75",
 *                       "totaleveningSNF": "8.90"
 *                     }
 *                   ]
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid date format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format. Use YYYY-MM-DD"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
	'/SNF_percentage_graph_data/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.snfPercentageGraphData),
)

/**
 * @swagger
 * /profit_loss_report_graph_with_selling_and_purcahse_price/{start_date}/{end_date}:
 *   get:
 *     summary: Get profit/loss report for graph with selling and purchase price
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Profit/loss report with selling and purchase price retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       profitWithSellingAndPurchasePrice:
 *                         type: string
 *                         example: "1750.25"
 *                         description: Profit including selling and purchase price
 *                       lossWithSellingAndPurchasePrice:
 *                         type: string
 *                         example: "0.00"
 *                         description: Loss including selling and purchase price
 *                   example: [
 *                     {
 *                       "date": "2024-01-15",
 *                       "profitWithSellingAndPurchasePrice": "1750.25",
 *                       "lossWithSellingAndPurchasePrice": "0.00"
 *                     }
 *                   ]
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid date format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format. Use YYYY-MM-DD"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
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
	'/profit_loss_report_graph_with_selling_and_purcahse_price/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.profitLossGraphWithSellingAndPurchasePrice),
)

/**
 * @swagger
 * /milk_aggregate_average/{start_date}/{end_date}:
 *   get:
 *     summary: Get milk aggregate average
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Milk aggregate average retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     aggregate:
 *                       type: object
 *                       properties:
 *                         milkProdQtyMorning: { type: string, example: "12.50" }
 *                         milkProdQtyEvening: { type: string, example: "10.25" }
 *                         milkProdQtyTotal: { type: string, example: "22.75" }
 *                         milkProdCostMorning: { type: string, example: "250.00" }
 *                         milkProdCostEvening: { type: string, example: "200.00" }
 *                         milkProdCostTotal: { type: string, example: "450.00" }
 *                     average:
 *                       type: object
 *                       properties:
 *                         milkProdQtyMorning: { type: string, example: "6.25" }
 *                         milkProdQtyEvening: { type: string, example: "5.12" }
 *                         milkProdQtyTotal: { type: string, example: "11.37" }
 *                         milkProdCostMorning: { type: string, example: "125.00" }
 *                         milkProdCostEvening: { type: string, example: "100.00" }
 *                         milkProdCostTotal: { type: string, example: "225.00" }
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
 *                 message: { type: string, example: "Unauthorized" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 401 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 500 }
 */

router.get(
	'/milk_aggregate_average/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.milkAggregateAverage),
)

/**
 * @swagger
 * /expense_aggregate_average/{start_date}/{end_date}:
 *   get:
 *     summary: Get expense aggregate average
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Expense aggregate average retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Success" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     aggregate:
 *                       type: object
 *                       properties:
 *                         greenFeedQty: { type: string, example: "100.00" }
 *                         dryFeedQty: { type: string, example: "50.00" }
 *                         cattleFeedQty: { type: string, example: "75.00" }
 *                         supplementQty: { type: string, example: "20.00" }
 *                         greenFeedCost: { type: string, example: "500.00" }
 *                         dryFeedCost: { type: string, example: "250.00" }
 *                         cattleFeedCost: { type: string, example: "375.00" }
 *                         supplementCost: { type: string, example: "100.00" }
 *                         otherExpense: { type: string, example: "200.00" }
 *                         totalExpense: { type: string, example: "1425.00" }
 *                     average:
 *                       type: object
 *                       properties:
 *                         greenFeedQty: { type: string, example: "10.00" }
 *                         dryFeedQty: { type: string, example: "5.00" }
 *                         cattleFeedQty: { type: string, example: "7.50" }
 *                         supplementQty: { type: string, example: "2.00" }
 *                         greenFeedCost: { type: string, example: "50.00" }
 *                         dryFeedCost: { type: string, example: "25.00" }
 *                         cattleFeedCost: { type: string, example: "37.50" }
 *                         supplementCost: { type: string, example: "10.00" }
 *                         otherExpense: { type: string, example: "20.00" }
 *                         totalExpense: { type: string, example: "142.50" }
 *                 status: { type: integer, example: 200 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Unauthorized" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 401 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 500 }
 */

router.get(
	'/expense_aggregate_average/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.expenseAggregateAverage),
)

/**
 * @swagger
 * /income_aggregate_average/{start_date}/{end_date}:
 *   get:
 *     summary: Get income aggregate average
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Income aggregate average retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Success" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     aggregate:
 *                       type: object
 *                       properties:
 *                         milkIncome: { type: string, example: "1200.00" }
 *                         manureIncome: { type: string, example: "150.00" }
 *                         sellingIncome: { type: string, example: "300.00" }
 *                         otherIncome: { type: string, example: "100.00" }
 *                         totalIncome: { type: string, example: "1750.00" }
 *                     average:
 *                       type: object
 *                       properties:
 *                         milkIncome: { type: string, example: "120.00" }
 *                         manureIncome: { type: string, example: "15.00" }
 *                         sellingIncome: { type: string, example: "30.00" }
 *                         otherIncome: { type: string, example: "10.00" }
 *                         totalIncome: { type: string, example: "175.00" }
 *                 status: { type: integer, example: 200 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Unauthorized" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 401 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 500 }
 */

router.get(
	'/income_aggregate_average/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.incomeAggregateAverage),
)

/**
 * @swagger
 * /income_expense_on_sale_purchase_animal/{start_date}/{end_date}:
 *   get:
 *     summary: Get income/expense on sale/purchase animal
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Income/expense on sale/purchase animal retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Success" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     income_for_sale_animals: { type: string, example: "5000.00" }
 *                     expense_for_purchase_animals: { type: string, example: "3500.00" }
 *                 status: { type: integer, example: 200 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Unauthorized" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 401 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 500 }
 */
router.get(
	'/income_expense_on_sale_purchase_animal/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.incomeExpenseOnSalePurchaseAnimal),
)

/**
 * @swagger
 * /milk_average_aggregate_record/{start_date}/{end_date}:
 *   get:
 *     summary: Get milk average aggregate record
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Milk average aggregate record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Success" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     aggregate:
 *                       type: object
 *                       properties:
 *                         morning: { type: string, example: "150.00" }
 *                         evening: { type: string, example: "180.00" }
 *                         total: { type: string, example: "330.00" }
 *                     average:
 *                       type: object
 *                       properties:
 *                         morning: { type: string, example: "15.00" }
 *                         evening: { type: string, example: "18.00" }
 *                         total: { type: string, example: "33.00" }
 *                     total:
 *                       type: object
 *                       properties:
 *                         cow_total: { type: string, example: "200.00" }
 *                         buffalo_total: { type: string, example: "130.00" }
 *                         total: { type: string, example: "330.00" }
 *                 status: { type: integer, example: 200 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Unauthorized" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 401 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Internal server error" }
 *                 data: { type: array, items: {}, example: [] }
 *                 status: { type: integer, example: 500 }
 */
router.get(
	'/milk_average_aggregate_record/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.getMilkAverageAggregateRecord),
)

export default router
