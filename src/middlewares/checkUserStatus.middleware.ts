import { Request, Response, NextFunction } from 'express'
import { User } from '@/types/index'
import { UserService } from '@/services/user.service'
import RESPONSE from '@/utils/response'

export const checkUserStatus = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const user = req.user as User
		if (!user?.id) {
			RESPONSE.FailureResponse(res, 401, { message: 'Unauthorized action.' })
			return
		}

		const userDetails = await UserService.getUserById(Number(user.id))

		if (
			!userDetails ||
			userDetails.payment_status?.toLowerCase() !== 'premium'
		) {
			RESPONSE.FailureResponse(res, 401, {
				message: 'Unauthorized action.',
				status: 401,
			})
			return
		}

		next()
	} catch (error) {
		next(error)
	}
}
