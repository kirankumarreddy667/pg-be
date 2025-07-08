import db from '@/config/database'

export class ContactUsService {
	static async getDetail(): Promise<{
		phone: string
		email: string
		whatsapp: string
	} | null> {
		const contact = await db.ContactUs.findOne()
		if (!contact) return null
		return {
			phone: contact.get('phone_number') ?? '',
			email: contact.get('contact_email') ?? '',
			whatsapp: contact.get('whatsapp') ?? '',
		}
	}
}
