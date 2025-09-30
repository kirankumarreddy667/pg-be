import { RequestHandler } from 'express'
import { EnquireUsService } from '@/services/enquireUs.service'
import RESPONSE from '@/utils/response'

export class EnquireUsController {
	public static readonly createEnquiry: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			await EnquireUsService.create(
				req.body as {
					first_name: string
					last_name?: string
					email: string
					phone: string
					query: string
				},
			)

			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: [],
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly listAll: RequestHandler = async (_req, res, next) => {
		try {
			const enquiries = await EnquireUsService.listAll()
			RESPONSE.SuccessResponse(res, 200, {
				message: 'Success',
				data: enquiries,
			})
		} catch (error) {
			next(error)
		}
	}
}
