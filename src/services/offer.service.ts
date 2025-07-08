import db from '@/config/database'
import { Offer } from '@/models/offer.model'

export class OfferService {
  static async getAllOffers(): Promise<Offer[]> {
    return await db.Offer.findAll()
  }

  static async getOffersByLanguage(language_id: number): Promise<Offer[]> {
    return await db.Offer.findAll({ where: { language_id } })
  }

  static async createOffer(data: {
    image?: string
    additional_months?: number
    additional_years?: number
    language_id: number
  }): Promise<Offer> {
    return await db.Offer.create(data)
  }
}