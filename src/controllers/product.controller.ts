import { RequestHandler } from 'express'
import { ProductService } from '@/services/product.service'
import RESPONSE from '@/utils/response'

interface Product {
	product_category_id: number
	language: number
	product_title: string
	product_images: string
	product_amount?: number | null
	product_description?: string | null
	product_variants?: string | null
	product_delivery_to?: string | null
	product_specifications?: string | null
	thumbnail: string
}
export class ProductController {
	public static readonly addProducts: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const { data } = req.body as { data: Product[] }
			await ProductService.addProducts(data)

			RESPONSE.SuccessResponse(res, 201, { message: 'Success', data: [] })
		} catch (error) {
			next(error)
		}
	}

	public static readonly getProducts: RequestHandler = async (
		req,
		res,
		next,
	) => {
		try {
			const category_id = Number(req.params.category_id)
			const language_id = Number(req.params.language_id)
			const data = await ProductService.getProductsByCategoryAndLanguage(
				category_id,
				language_id,
			)
			RESPONSE.SuccessResponse(res, 200, { message: 'Success', data })
		} catch (error) {
			next(error)
		}
	}
}
