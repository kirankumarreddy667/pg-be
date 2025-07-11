import { RequestHandler } from 'express'
import { ValidationRule } from '@/models/validation_rule.model'
import RESPONSE from '@/utils/response'
import { ValidationRuleService } from '@/services/validation_rule.service'

export class ValidationRuleController {
	public static readonly create: RequestHandler = async (req, res, next) => {
		try {
			const value = req.body as ValidationRule
			const existingRule = await ValidationRuleService.getValidationRuleByName(
				value.name,
			)
			if (existingRule) {
				return res.status(422).json({
					message: 'The given data was invalid.',
					errors: {
						farm_name: ['The validation rule name has already been taken.'],
					},
				})
			}
			await ValidationRuleService.create(value)
			return RESPONSE.SuccessResponse(res, 201, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly update: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const value = req.body as ValidationRule
			// Check for unique name, excluding current rule
			const existingRule = await ValidationRuleService.getValidationRuleByName(
				value.name,
			)
			if (existingRule && existingRule.get('id') !== Number(id)) {
				return res.status(422).json({
					message: 'The given data was invalid.',
					errors: {
						name: ['The validation rule name has already been taken.'],
					},
				})
			}
			// Update rule
			await ValidationRuleService.update(Number(id), value)
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAll: RequestHandler = async (req, res, next) => {
		try {
			const rules = await ValidationRuleService.getAll()
			return RESPONSE.SuccessResponse(res, 200, {
				data: rules,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getById: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params
			const rule = await ValidationRuleService.getById(Number(id))
			if (!rule) {
				return RESPONSE.FailureResponse(res, 404, { message: 'Not found' })
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: rule,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly deleteById: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params
			const deleted = await ValidationRuleService.deleteById(Number(id))
			if (!deleted) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
				})
			}
			return RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
