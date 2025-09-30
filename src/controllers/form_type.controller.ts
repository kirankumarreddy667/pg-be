import { RequestHandler } from 'express'
import { FormTypeService } from '@/services/form_type.service'
import RESPONSE from '@/utils/response'
import { ValidationRequestError } from '@/utils/errors'

export class FormTypeController {
	public static readonly createFormType: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { name, description } = req.body as {
				name: string
				description: string
			}
			const existingFormType = await FormTypeService.getFormTypeByName(name)
			if (existingFormType) {
				throw new ValidationRequestError({
					name: ['The name has already been taken.'],
				})
			}
			await FormTypeService.createFormType({
				name,
				description,
			})
			RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly updateFormType: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params
			const { name, description } = req.body as {
				name: string
				description: string
			}
			// Check for unique name, excluding current form type
			const existingFormType = await FormTypeService.getFormTypeByName(name)
			if (existingFormType && existingFormType.get('id') !== Number(id)) {
				throw new ValidationRequestError({
					name: ['The name has already been taken.'],
				})
			}
			const updated = await FormTypeService.updateFormType(Number(id), {
				name,
				description,
			})

			if (!updated)
				return RESPONSE.FailureResponse(res, 404, { message: 'Not found.' })

			RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getAllFormTypes: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const formTypes = await FormTypeService.getAll()
			RESPONSE.SuccessResponse(res, 200, {
				data: formTypes,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly getFormTypeById: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params
			const formType = await FormTypeService.getById(Number(id))
			if (!formType) {
				return RESPONSE.SuccessResponse(res, 200, {
					message: 'Success',
					data: null,
				})
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: formType,
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}

	public static readonly deleteFormTypeById: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { id } = req.params
			const deleted = await FormTypeService.deleteById(Number(id))
			if (!deleted) {
				return RESPONSE.FailureResponse(res, 404, {
					message: 'Not found.',
					data: [],
				})
			}
			RESPONSE.SuccessResponse(res, 200, {
				data: [],
				message: 'Success',
			})
		} catch (error) {
			next(error)
		}
	}
}
