import { RequestHandler } from 'express'
import { ContactUsService } from '@/services/contact_us.service'
import RESPONSE from '@/utils/response'

export class ContactUsController {
	public static readonly getContactUs: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const data = await ContactUsService.getDetail()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: data || {},
			})
		} catch (error) {
			next(error)
		}
	}
}
