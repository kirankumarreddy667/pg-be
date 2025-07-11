import { RequestHandler } from 'express'
import { FormTypeService } from '@/services/form_type.service'
import RESPONSE from '@/utils/response'

export class FormTypeController {
	public static readonly createFormType: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { name, description } = req.body as {
				name: string
				description?: string | null
			}
			const existingFormType = await FormTypeService.getFormTypeByName(name)
			if (existingFormType) {
				return res.status(422).json({
					message: 'The given data was invalid.',
					errors: {
						name: ['The form type name has already been taken.'],
					},
				})
			}
			await FormTypeService.createFormType({
				name,
				description,
			})
			RESPONSE.SuccessResponse(res, 201, {
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
				description?: string | null
			}
			// Check for unique name, excluding current form type
			const existingFormType = await FormTypeService.getFormTypeByName(name)
			if (existingFormType && existingFormType.get('id') !== Number(id)) {
				return res.status(422).json({
					message: 'The given data was invalid.',
					errors: {
						name: ['The form type name has already been taken.'],
					},
				})
			}
			await FormTypeService.updateFormType(Number(id), {
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
				return res.status(404).json({ message: 'Not found.' })
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
				return res.status(404).json({ message: 'Not found' })
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
