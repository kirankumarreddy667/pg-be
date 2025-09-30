import { Router, type Router as ExpressRouter } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { ReportsController } from '@/controllers/reports.controller'

const router: ExpressRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     AnimalHealthReportResult:
 *       type: object
 *       properties:
 *         total_cost_of_treatment:
 *           type: number
 *           example: 2500.50
 *         total_animal:
 *           type: integer
 *           example: 5
 *
 *     MilkProductionQuantityResult:
 *       type: object
 *       properties:
 *         morning:
 *           type: object
 *         evening:
 *           type: object
 *         morningTotal:
 *           type: string
 *           example: "450.25"
 *         eveningTotal:
 *           type: string
 *           example: "380.75"
 *         TotalLitresInMorning:
 *           type: string
 *           example: "25.50"
 *         TotalLitresInEvening:
 *           type: string
 *           example: "22.75"
 *
 *     ProfitLossReportResult:
 *       type: object
 *       properties:
 *         totalIncomeWithSellingPrice:
 *           type: string
 *           example: "15000.00"
 *         totalExpenseWithPurchasePrice:
 *           type: string
 *           example: "12000.00"
 *         profitWithSellingAndPurchasePrice:
 *           type: string
 *           example: "3000.00"
 *         lossWithSellingAndPurchasePrice:
 *           type: string
 *           example: "0.00"
 *         totalbreedingExpense:
 *           type: number
 *           example: 500
 *
 *     SummaryReportResult:
 *       type: object
 *       properties:
 *         Expense:
 *           type: string
 *           example: "12000.00"
 *         Income:
 *           type: string
 *           example: "15000.00"
 *         Profit:
 *           type: string
 *           example: "3000.00"
 *         GreenFeed:
 *           type: string
 *           example: "2000.00"
 *         CattleFeed:
 *           type: string
 *           example: "3000.00"
 *         DryFeed:
 *           type: string
 *           example: "1500.00"
 *         OtherExpense:
 *           type: string
 *           example: "5500.00"
 *         supplement:
 *           type: string
 *           example: "800.00"
 *         breediingExpense:
 *           type: string
 *           example: "500.00"
 */

/**
 * @swagger
 * /animal_health_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal health report
 *     description: Retrieves health report data for animals within the specified date range
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
 *         description: Animal health report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/AnimalHealthReportResult'
 *       400:
 *         description: Bad Request
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
 *                   example: Something went wrong. Please try again
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/animal_health_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.animalHealthReport),
)

/**
 * @swagger
 * /animal_milk_production_quantity_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal milk production quantity report
 *     description: Retrieves milk production quantity data for animals within the specified date range
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
 *         description: Milk production quantity report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/MilkProductionQuantityResult'
 *       400:
 *         description: Bad Request
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
 *                   example: Something went wrong. Please try again
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/animal_milk_production_quantity_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.animalMilkProductionQuantityReport),
)

/**
 * @swagger
 * /animal_milk_production_quality_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal milk production quality report
 *     description: Retrieves milk production quality data including fat and SNF content for animals within the specified date range
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
 *         description: Milk production quality report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                     totalMorningFat:
 *                       type: string
 *                       example: "3.85"
 *                     totalMorningSNF:
 *                       type: string
 *                       example: "8.50"
 *                     totaleveningFat:
 *                       type: string
 *                       example: "4.20"
 *                     totaleveningSNF:
 *                       type: string
 *                       example: "8.75"
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/animal_milk_production_quality_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.animalMilkProductionQualityReport),
)

/**
 * @swagger
 * /manure_production_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get manure production report
 *     description: Retrieves manure production data for the specified date range
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
 *         description: Manure production report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                     "Total manure production amount":
 *                       type: string
 *                       example: "5000.00"
 *                     "Total manure production":
 *                       type: string
 *                       example: "250.50"
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/manure_production_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.manureProductionReport),
)

/**
 * @swagger
 * /profit_loss_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get profit/loss report
 *     description: Retrieves profit and loss calculations for the specified date range
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
 *         description: Profit/loss report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/ProfitLossReportResult'
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/profit_loss_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.profitLossReport),
)

/**
 * @swagger
 * /expense_report/{start_date}/{end_date}:
 *   get:
 *     summary: Get expense summary report
 *     description: Retrieves comprehensive expense and income summary for the specified date range
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
 *         description: Expense summary report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/SummaryReportResult'
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/expense_report/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.summaryReport),
)

/**
 * @swagger
 * /farm_investment_report/{language_id}:
 *   get:
 *     summary: Get farm investment report
 *     description: Retrieves farm investment details in the specified language
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID for localization
 *         example: 1
 *     responses:
 *       200:
 *         description: Farm investment report retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     reportData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           type_of_investment:
 *                             type: string
 *                           amount_in_rs:
 *                             type: number
 *                           date_of_installation_or_purchase:
 *                             type: string
 *                             format: date
 *                           age_in_year:
 *                             type: string
 *                     total_investment:
 *                       type: string
 *                       example: "50000.00"
 *                     number_of_investments:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/farm_investment_report/:language_id',
	authenticate,
	wrapAsync(ReportsController.farmInvestmentReport),
)

/**
 * @swagger
 * /total_expense_aggregate_average/{start_date}/{end_date}:
 *   get:
 *     summary: Get total expense aggregate and average
 *     description: Retrieves aggregate totals and daily averages of expenses for the specified date range
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
 *         description: Expense aggregate and average retrieved successfully
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     aggregate:
 *                       type: object
 *                       properties:
 *                         greenFeedQty:
 *                           type: string
 *                         dryFeedQty:
 *                           type: string
 *                         cattleFeedQty:
 *                           type: string
 *                         supplementQty:
 *                           type: string
 *                         totalExpense:
 *                           type: string
 *                     average:
 *                       type: object
 *                       properties:
 *                         greenFeedQty:
 *                           type: string
 *                         dryFeedQty:
 *                           type: string
 *                         cattleFeedQty:
 *                           type: string
 *                         supplementQty:
 *                           type: string
 *                         totalExpense:
 *                           type: string
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/total_expense_aggregate_average/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.totalExpenseAggregateAverage),
)

/**
 * @swagger
 * /health_report_details/{start_date}/{end_date}:
 *   get:
 *     summary: Get detailed health report
 *     description: Retrieves detailed health information for animals within the specified date range
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
 *         description: Health report details retrieved successfully
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
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     animal_count:
 *                       type: integer
 *                       example: 5
 *                     total_cost_of_treatment:
 *                       type: number
 *                       example: 2500.50
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             nullable: true
 *                           diseasName:
 *                             type: string
 *                             nullable: true
 *                           details_of_treatment:
 *                             type: string
 *                             nullable: true
 *                           milk_loss_in_litres:
 *                             type: string
 *                             nullable: true
 *                           animal_number:
 *                             type: string
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/health_report_details/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.healthReportDetails),
)

/**
 * @swagger
 * /latest_profit_loss_report:
 *   get:
 *     summary: Get latest profit/loss report
 *     description: Retrieves the most recent profit/loss report for the authenticated user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest profit/loss report retrieved successfully
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
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2024-08-01T00:00:00.000Z"
 *                     profit_loss:
 *                       type: string
 *                       example: "1500.75"
 *                     key:
 *                       type: string
 *                       enum: [profit, loss, null]
 *                       example: profit
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/latest_profit_loss_report',
	authenticate,
	wrapAsync(ReportsController.latestProfitLossReport),
)

/**
 * @swagger
 * /animal_milk_details/{start_date}/{end_date}:
 *   get:
 *     summary: Get animal milk details
 *     description: Retrieves detailed milk report information for animals within the specified date range
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
 *         description: Animal milk report details retrieved successfully
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
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2024-01-05"
 *                       animalNumber:
 *                         type: string
 *                         example: "A123"
 *                       morningFat:
 *                         type: string
 *                         nullable: true
 *                       morningSNF:
 *                         type: string
 *                         nullable: true
 *                       eveningFat:
 *                         type: string
 *                         nullable: true
 *                       eveningSNF:
 *                         type: string
 *                         nullable: true
 *                       bacterialCount:
 *                         type: string
 *                         nullable: true
 *                       somaticCellCount:
 *                         type: string
 *                         nullable: true
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/animal_milk_details/:start_date/:end_date',
	authenticate,
	wrapAsync(ReportsController.animalMilkReportDetails),
)

/**
 * @swagger
 * /pregnant_non_pregnant_animals_count:
 *   get:
 *     summary: Get count of pregnant and non-pregnant animals by type
 *     description: Retrieves count of pregnant and non-pregnant animals grouped by animal type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
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
 *                   example: success
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       pregnant_animal:
 *                         type: integer
 *                         example: 12
 *                       non_pregnant_animal:
 *                         type: integer
 *                         example: 8
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/pregnant_non_pregnant_animals_count',
	authenticate,
	wrapAsync(ReportsController.pregnantNonPregnantAnimals),
)

/**
 * @swagger
 * /pregnant_non_pregnant_animals_list:
 *   get:
 *     summary: Get list of pregnant and non-pregnant animals by type
 *     description: Retrieves detailed lists of pregnant and non-pregnant animals grouped by type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lists retrieved successfully
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
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     pregnant:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             animal_id:
 *                               type: integer
 *                             animal_number:
 *                               type: string
 *                             animal_name:
 *                               type: string
 *                     non_pregnant:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             animal_id:
 *                               type: integer
 *                             animal_number:
 *                               type: string
 *                             animal_name:
 *                               type: string
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/pregnant_non_pregnant_animals_list',
	authenticate,
	wrapAsync(ReportsController.pregnantNonPregnantAnimalsList),
)

/**
 * @swagger
 * /lactating_non_lactating_animals_count:
 *   get:
 *     summary: Get count of lactating and non-lactating animals by type
 *     description: Retrieves count of lactating and non-lactating animals grouped by animal type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
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
 *                   example: success
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       lactating_animal:
 *                         type: integer
 *                         example: 10
 *                       non_lactating_animal:
 *                         type: integer
 *                         example: 15
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
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
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.get(
	'/lactating_non_lactating_animals_count',
	authenticate,
	wrapAsync(ReportsController.lactatingNonLactatingAnimals),
)

export default router
