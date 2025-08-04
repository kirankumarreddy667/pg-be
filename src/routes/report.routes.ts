import { Router } from 'express'
import { ReportController } from '@/controllers/report.controller'
import { authenticate } from '@/middlewares/auth.middleware'

import { reportSchema } from '@/validations/report.validation'
import { validateRequest } from '@/middlewares/validateRequest'
import { wrapAsync } from '@/utils/asyncHandler'

const router: Router = Router()

/**
 * @swagger
 * /generate-pdf:
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "PDF generated and sent successfully"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
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
 *                 success:
 *                   type: boolean
 *                   example: false
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
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   example: []
 */
router.post(
	'/generate-pdf',
	authenticate,
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/milk_average_aggregate_record/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.getMilkAverageAggregateRecord),
)

/**
 * @swagger
 * /animal_health_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal health report
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/animal_health_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.animalHealthReport),
)

/**
 * @swagger
 * /animal_milk_production_quantity_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal milk production quantity report
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/animal_milk_production_quantity_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.animalMilkProductionQuantityReport),
)

/**
 * @swagger
 * /animal_milk_production_quality_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal milk production quality report
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/animal_milk_production_quality_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.animalMilkProductionQualityReport),
)

/**
 * @swagger
 * /manure_production_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get manure production report
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/manure_production_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.manureProductionReport),
)

/**
 * @swagger
 * /profit_loss_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get profit/loss report
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/profit_loss_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.profitLossReport),
)

/**
 * @swagger
 * /expense_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get expense report
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/expense_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.summaryReport),
)

/**
 * @swagger
 * /farm_investment_report/{language_id}:
 *   get:
 *     summary: Get farm investment report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Language ID
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/farm_investment_report/:language_id',
	authenticate,
	wrapAsync(ReportController.farmInvestmentReport),
)

/**
 * @swagger
 * /total_expense_aggregate_average/{start_date}/{end_date}:
 *   get:
 *     summary: Get total expense aggregate average
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/total_expense_aggregate_average/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.totalExpenseAggregateAverage),
)

/**
 * @swagger
 * /health_report_details/{start_date}/{end_date}:
 *   get:
 *     summary: Get health report details
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/health_report_details/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.healthReportDetails),
)

/**
 * @swagger
 * /latest_profit_loss_report:
 *   get:
 *     summary: Get latest profit/loss report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/latest_profit_loss_report',
	authenticate,
	wrapAsync(ReportController.latestProfitLossReport),
)

/**
 * @swagger
 * /animal_milk_details/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal milk details
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
 *       - in: path
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
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
router.get(
	'/animal_milk_details/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportController.animalMilkReportDetails),
)

export default router
