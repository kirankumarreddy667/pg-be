import { RequestHandler } from 'express'
import { Transaction } from 'sequelize'
import {
	Advertisement as AdvertisementModel,
	AdvertisementImage,
} from '@/models/index'
import { saveBase64Image } from '@/utils/image'
import RESPONSE from '@/utils/response'
import db from '@/config/database'

const { sequelize } = db

const BASE_URL = process.env.BASE_URL || 'http://localhost:7777'

interface AdvertisementPayload {
	id: number
	name: string
	description: string
	cost: number
	phone_number: string
	term_conditions: string
	status: boolean
	photos: string[]
}

export class AdvertisementController {
	public static readonly create: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		const {
			name,
			description,
			cost,
			phone_number,
			term_conditions,
			status,
			photos = [],
		} = req.body as AdvertisementPayload

		const t: Transaction = await sequelize.transaction()
		try {
			// Create advertisement within transaction
			const ad = await AdvertisementModel.create(
				{
					name,
					description,
					cost,
					phone_number,
					term_conditions,
					status: status === undefined ? true : Boolean(status),
				},
				{ transaction: t },
			)

			// Handle images (max 5)
			if (Array.isArray(photos) && photos.length > 0) {
				const filesToProcess = photos.slice(0, 5)
				await Promise.all(
					filesToProcess.map(async (photo) => {
						const fileName = await saveBase64Image(photo)
						await AdvertisementImage.create(
							{
								advertisement_id: ad.id,
								image: fileName,
							},
							{ transaction: t },
						)
					}),
				)
			}

			await t.commit()
			RESPONSE.SuccessResponse(res, 201, {
				message: 'Advertisement created successfully',
				data: [],
			})
		} catch (error) {
			await t.rollback()
			next(error)
		}
	}

	public static readonly index: RequestHandler = async (
		req,
		res,
	): Promise<void> => {
		const ads = await AdvertisementModel.findAll({
			include: [{ model: AdvertisementImage, as: 'images' }],
			order: [['created_at', 'DESC']],
		})
		const data = ads.map((ad) => {
			const plainAd = ad.get({ plain: true }) as {
				id: number
				name: string
				description: string
				cost: number
				phone_number: string
				term_conditions: string
				status: boolean
				images?: { image: string }[]
			}
			return {
				id: plainAd.id,
				name: plainAd.name,
				description: plainAd.description,
				cost: plainAd.cost,
				phone_number: plainAd.phone_number,
				term_conditions: plainAd.term_conditions,
				status: plainAd.status,
				images: Array.isArray(plainAd.images)
					? plainAd.images.map((img) => `${BASE_URL}/ad_images/${img.image}`)
					: [],
			}
		})
		RESPONSE.SuccessResponse(res, 200, {
			message: 'Success',
			data,
		})
	}

	public static readonly show: RequestHandler = async (
		req,
		res,
	): Promise<void> => {
		const { id } = req.params
		const ad = await AdvertisementModel.findByPk(id, {
			include: [{ model: AdvertisementImage, as: 'images' }],
		})
		if (!ad) {
			RESPONSE.FailureResponse(res, 404, { message: 'Advertisement not found' })
			return
		}
		const plainAd = ad.get({ plain: true }) as {
			id: number
			name: string
			description: string
			cost: number
			phone_number: string
			term_conditions: string
			status: boolean
			images?: { image: string }[]
		}
		const data = {
			id: plainAd.id,
			name: plainAd.name,
			description: plainAd.description,
			cost: plainAd.cost,
			phone_number: plainAd.phone_number,
			term_conditions: plainAd.term_conditions,
			status: plainAd.status,
			images: Array.isArray(plainAd.images)
				? plainAd.images.map((img) => `${BASE_URL}/ad_images/${img.image}`)
				: [],
		}
		RESPONSE.SuccessResponse(res, 200, {
			message: 'Success',
			data,
		})
	}

	public static readonly update: RequestHandler = async (
		req,
		res,
	): Promise<void> => {
		const { id } = req.params
		const t = await sequelize.transaction()
		try {
			const ad = await AdvertisementModel.findByPk(id, { transaction: t })
			if (!ad) {
				await t.rollback()
				RESPONSE.FailureResponse(res, 404, {
					message: 'Advertisement not found',
				})
				return
			}
			const {
				name,
				description,
				cost,
				phone_number,
				term_conditions,
				status,
				photos = [],
			} = req.body as AdvertisementPayload
			await ad.update(
				{
					name: name ?? ad.get('name'),
					description: description ?? ad.get('description'),
					cost: cost ?? ad.get('cost'),
					phone_number: phone_number ?? ad.get('phone_number'),
					term_conditions: term_conditions ?? ad.get('term_conditions'),
					status: status === undefined ? ad.get('status') : Boolean(status),
				},
				{ transaction: t },
			)
			// If photos provided, replace images
			if (Array.isArray(photos) && photos.length > 0) {
				await AdvertisementImage.destroy({
					where: { advertisement_id: ad.get('id') },
					transaction: t,
				})
				await Promise.all(
					photos.slice(0, 5).map(async (photo: string) => {
						const fileName = await saveBase64Image(photo)
						await AdvertisementImage.create(
							{
								advertisement_id: ad.get('id'),
								image: fileName,
							},
							{ transaction: t },
						)
					}),
				)
			}
			await t.commit()

			RESPONSE.SuccessResponse(res, 200, {
				message: 'Advertisement updated successfully',
				data: [],
			})
		} catch (error) {
			await t.rollback()
			RESPONSE.FailureResponse(res, 500, {
				message: 'Failed to update advertisement or save images',
				errors: [error instanceof Error ? error.message : String(error)],
			})
		}
	}

	public static readonly destroy: RequestHandler = async (
		req,
		res,
	): Promise<void> => {
		const { id } = req.params
		const t = await sequelize.transaction()
		try {
			const ad = await AdvertisementModel.findByPk(id, { transaction: t })
			if (!ad) {
				await t.rollback()
				RESPONSE.FailureResponse(res, 404, {
					message: 'Advertisement not found',
				})
				return
			}
			await AdvertisementImage.destroy({
				where: { advertisement_id: ad.get('id') },
				transaction: t,
			})
			await ad.destroy({ transaction: t })
			await t.commit()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Advertisement deleted',
				data: [],
			})
		} catch (error) {
			await t.rollback()
			RESPONSE.FailureResponse(res, 500, {
				message: 'Failed to delete advertisement',
				errors: [error instanceof Error ? error.message : String(error)],
			})
		}
	}
}
