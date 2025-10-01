import { Request, Response, NextFunction } from 'express'
import { logger } from '@/config/logger'

// Webhook authentication middleware
export const webhookAuth = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const signature = req.headers['x-razorpay-signature'] as string

	if (!signature) {
		logger.warn('Webhook request missing required headers', {
			ip: req.ip,
			userAgent: req.get('User-Agent'),
			hasSignature: !!signature,
		})
		res.status(401).json({
			success: false,
			message: 'Unauthorized webhook request',
			data: [],
		})
		return
	}

	next()
}
