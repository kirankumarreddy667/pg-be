import { RequestHandler } from 'express'
import { OfferService } from '@/services/offer.service'
import RESPONSE from '@/utils/response'

export interface CreateOfferBody {
	image?: string
	additional_months?: number
	additional_years?: number
	language_id: number
}

export class OfferController {
	public static readonly getAllOffers: RequestHandler = async (
		req,
		res,
		next,
	): Promise<void> => {
		try {
			const offers = await OfferService.getAllOffers()
			RESPONSE.SuccessResponse(res, 200, {
				data: offers,
				message: 'Offers fetched successfully',
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
			const offers = await OfferService.getOffersByLanguage(Number(language_id))
			RESPONSE.SuccessResponse(res, 200, {
				data: offers,
				message: 'Offers fetched by language',
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
			const offer = await OfferService.createOffer(data)
			RESPONSE.SuccessResponse(res, 201, {
				data: offer,
				message: 'Offer created successfully',
			})
		} catch (error) {
			next(error)
		}
	}
}
