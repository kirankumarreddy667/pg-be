import { RequestHandler } from 'express'
import { OfferService } from '@/services/offer.service'
import RESPONSE from '@/utils/response'

export interface CreateOfferBody {
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
}

export class OfferController {
	public static readonly getAllOffers: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const offers = await OfferService.listAll()
			RESPONSE.SuccessResponse(res, 200, {
				data: offers,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getOffersByLanguage: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const { language_id } = req.params
			const offers = await OfferService.findByLanguageId(Number(language_id))
			RESPONSE.SuccessResponse(res, 200, {
				data: offers,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly createOffer: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const data = req.body as CreateOfferBody
			await OfferService.createOffer(data)
			RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
