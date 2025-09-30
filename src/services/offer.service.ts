import db from '@/config/database'
import { ValidationRequestError } from '@/utils/errors'
import { Transaction } from 'sequelize'

export interface OfferListRow {
	offer_id: number
	offer_name: string | null
	offer_type: string | null
	plan_id: number | null
	product_id: number | null
	offer_title: string | null
	offer_description: string | null
	amount: number
	image: string | null
}

export interface OfferByLanguageRow {
	offer_id: number
	offer_name: string | null
	offer_type: string | null
	plan_id: number | null
	product_id: number | null
	offer_title: string | null
	offer_description: string | null
	amount: number
	image: string | null
	language_id: number
}

export interface OfferByLanguageResult {
	offer_id: number
	offer_name: string | null
	offer_type: string | null
	plan_id: number | null
	product_id: number | null
	offer_title: string | null
	offer_description: string | null
	original_amount: number
	offer_amount: number
	image_url: string | null
	language_id: number
}

export class OfferService {
	static async listAll(): Promise<
		Array<{
			offer_id: number
			offer_name: string | null
			offer_type: string | null
			plan_id: number | null
			product_id: number | null
			offer_title: string | null
			offer_description: string | null
			original_amount: number
			offer_amount: number
			image_url: string | null
		}>
	> {
		const offers = (await db.UserOffers.findAll({
			attributes: [
				[db.sequelize.col('Offer.id'), 'offer_id'],
				[db.sequelize.col('Offer.name'), 'offer_name'],
				'offer_type',
				'plan_id',
				'product_id',
				[db.sequelize.col('Offer.title'), 'offer_title'],
				[db.sequelize.col('Offer.description'), 'offer_description'],
				[db.sequelize.col('Offer.amount'), 'amount'],
				[db.sequelize.col('Offer.image'), 'image'],
			],
			include: [
				{
					model: db.Offer,
					as: 'Offer',
					attributes: [],
					required: true,
					where: { deleted_at: null },
				},
			],
			where: { deleted_at: null },
			raw: true,
		})) as unknown as OfferListRow[]

		const results: Array<{
			offer_id: number
			offer_name: string | null
			offer_type: string | null
			plan_id: number | null
			product_id: number | null
			offer_title: string | null
			offer_description: string | null
			original_amount: number
			offer_amount: number
			image_url: string | null
		}> = []

		for (const offer of offers) {
			const planId = offer.plan_id ?? null
			const productId = offer.product_id ?? null

			let originalAmount = 0
			let offerAmount = 0

			if (planId) {
				const plan = await db.Plan.findOne({
					attributes: ['amount'],
					where: { id: planId, deleted_at: null },
				})
				originalAmount = plan ? Number(plan.get('amount')) : 0
				offerAmount = originalAmount
			}

			if (productId) {
				const product = await db.Product.findOne({
					attributes: ['product_amount'],
					where: { id: productId, deleted_at: null },
				})
				originalAmount = product
					? Number(product.get('product_amount') ?? 0)
					: 0
				offerAmount = originalAmount - Number(offer.amount)
			}

			results.push({
				offer_id: offer.offer_id,
				offer_name: offer.offer_name ?? null,
				offer_type: offer.offer_type ?? null,
				plan_id: planId,
				product_id: productId,
				offer_title: offer.offer_title ?? null,
				offer_description: offer.offer_description ?? null,
				original_amount: originalAmount,
				offer_amount: offerAmount,
				image_url: offer.image
					? `${process.env.APP_URL || ''}/Images/${offer.image}`
					: null,
			})
		}

		return results
	}

	static async findByLanguageId(
		language_id: number,
	): Promise<OfferByLanguageResult[]> {
		// Get base offers with join
		const offers = (await db.UserOffers.findAll({
			attributes: [
				[db.sequelize.col('Offer.id'), 'offer_id'],
				[db.sequelize.col('Offer.name'), 'offer_name'],
				'offer_type',
				'plan_id',
				'product_id',
				[db.sequelize.col('Offer.title'), 'offer_title'],
				[db.sequelize.col('Offer.description'), 'offer_description'],
				[db.sequelize.col('Offer.amount'), 'amount'],
				[db.sequelize.col('Offer.image'), 'image'],
				[db.sequelize.col('Offer.language_id'), 'language_id'],
			],
			include: [
				{
					model: db.Offer,
					as: 'Offer',
					attributes: [],
					required: true,
					where: { language_id, deleted_at: null },
				},
			],
			where: { deleted_at: null },
			raw: true,
		})) as unknown as OfferByLanguageRow[]

		const results: OfferByLanguageResult[] = []

		for (const row of offers) {
			let originalAmount = 0
			let offerAmount = 0

			if (row.plan_id) {
				const plan = await db.Plan.findOne({
					attributes: ['amount'],
					where: { id: row.plan_id, deleted_at: null },
					raw: true,
				})
				originalAmount = plan
					? Number((plan as unknown as { amount: number }).amount)
					: 0
				offerAmount = originalAmount
			}

			if (row.product_id) {
				const product = await db.Product.findOne({
					attributes: ['product_amount'],
					where: { id: row.product_id, deleted_at: null },
					raw: true,
				})
				originalAmount = product
					? Number((product as { product_amount: number }).product_amount ?? 0)
					: 0
				offerAmount = originalAmount - Number(row.amount)
			}

			results.push({
				offer_id: row.offer_id,
				offer_name: row.offer_name,
				offer_type: row.offer_type,
				plan_id: row.plan_id,
				product_id: row.product_id,
				offer_title: row.offer_title,
				offer_description: row.offer_description,
				original_amount: originalAmount,
				offer_amount: offerAmount,
				image_url: row.image
					? `${process.env.APP_URL || ''}/Images/${row.image}`
					: null,
				language_id: row.language_id,
			})
		}

		return results
	}

	static async createOffer(data: {
		data: {
			name: string
			title: string
			description: string
			amount: number
			plan_id?: number
			product_id?: number
			offer_type: string
		}[]
		language_id: number
	}): Promise<void> {
		const transaction: Transaction = await db.sequelize.transaction()

		try {
			const language = await db.Language.findOne({
				where: { id: data.language_id, deleted_at: null },
			})
			if (!language) {
				throw new ValidationRequestError({
					language_id: ['The selected language id is invalid.'],
				})
			}

			const names = data.data.map((o) => o.name)
			const planIds = data.data.filter((o) => o.plan_id).map((o) => o.plan_id!)
			const productIds = data.data
				.filter((o) => o.product_id)
				.map((o) => o.product_id!)

			const existingOffers = await db.Offer.findAll({
				where: { name: names, deleted_at: null },
				attributes: ['name'],
			})

			const existingNames = new Set(existingOffers.map((o) => o.get('name')))

			const existingPlans = new Set(
				(
					await db.Plan.findAll({
						where: { id: planIds, deleted_at: null },
						attributes: ['id'],
					})
				).map((p) => p.get('id')),
			)
			const existingProducts = new Set(
				(
					await db.Product.findAll({
						where: { id: productIds, deleted_at: null },
						attributes: ['id'],
					})
				).map((p) => p.get('id')),
			)

			data.data.forEach((offer, idx) => {
				if (existingNames.has(offer.name)) {
					throw new ValidationRequestError({
						[`data.${idx}.name`]: [
							`The data.${idx}.name has already been taken.`,
						],
					})
				}
				if (offer.plan_id && !existingPlans.has(offer.plan_id)) {
					throw new ValidationRequestError({
						[`data.${idx}.plan_id`]: [
							`The selected data.${idx}.plan_id is invalid.`,
						],
					})
				}
				if (offer.product_id && !existingProducts.has(offer.product_id)) {
					throw new ValidationRequestError({
						[`data.${idx}.product_id`]: [
							`The seleceted data.${idx}.product_id is invalid.`,
						],
					})
				}
			})

			const offerData = data.data.map((o) => ({
				name: o.name,
				title: o.title,
				description: o.description,
				amount: o.amount,
				language_id: data.language_id,
			}))

			const createdOffers = await db.Offer.bulkCreate(offerData, {
				returning: true,
				transaction,
			})

			const userOffersData = createdOffers.map((offerRow, idx) => ({
				offer_id: offerRow.get('id'),
				offer_type: data.data[idx].offer_type,
				plan_id: data.data[idx].plan_id || null,
				product_id: data.data[idx].product_id || null,
			}))

			await db.UserOffers.bulkCreate(userOffersData, { transaction })

			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	}
}
