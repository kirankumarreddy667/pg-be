import { RequestHandler } from 'express'
import { AdvertisementService } from '@/services/advertisement.service'
import RESPONSE from '@/utils/response'
import { NotFoundError } from '@/utils/errors'
import db from '@/config/database'

interface AdvertisementPayload {
	name: string
	description: string
	cost: number
	phone_number: string
	term_conditions: string
	website_link?: string | null
	status: boolean
	photos: string[]
}

export class AdvertisementController {
	public static readonly create: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const payload = req.body as AdvertisementPayload
			const result = await AdvertisementService.create(payload)
			RESPONSE.SuccessResponse(res, 201, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly index: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const data = await AdvertisementService.findAll()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly show: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const { id } = req.params
			const data = await AdvertisementService.findById(Number(id))

			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: data || [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const { id } = req.params
			const payload = req.body as AdvertisementPayload
			const ad = await db.Advertisement.findByPk(Number(id))
			if (!ad) {
				throw new NotFoundError('Advertisement not found')
			}
			const result = await AdvertisementService.update(Number(id), payload)

			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly destroy: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const { id } = req.params
			const ad = await db.Advertisement.findByPk(Number(id))
			if (!ad) {
				throw new NotFoundError('Advertisement not found')
			}
			const result = await AdvertisementService.delete(Number(id))

			RESPONSE.SuccessResponse(res, 200, {
				message: result.message,
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}
}
