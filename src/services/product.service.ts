import db from '@/config/database'

export class ProductService {
	static async addProducts(
		products: Array<{
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
		}>,
	): Promise<boolean> {
		try {
			await db.Product.bulkCreate(products)
			return true
		} catch {
			return false
		}
	}

	static async getProductsByCategoryAndLanguage(
		category_id: number,
		language_id: number,
	): Promise<
		Array<{
			product_id: number
			product_category_id: number
			language: number
			product_title: string
			product_images: string[]
			product_amount?: number | null
			product_description?: string | null
			product_variants: string[]
			product_delivery_to?: string | null
			product_specifications: string[]
			thumbnail: string
		}>
	> {
		const ids = [7, 40, 20, 31]
		const data = await db.Product.findAll({
			where: {
				product_category_id: category_id,
				language: language_id,
				id: ids,
				deleted_at: null,
			},
		})

		return data.map((value) => {
			let productImage: string[] = []
			if (value.get('product_images')) {
				productImage = value
					.get('product_images')
					.split(',')
					.map((img) => `${process.env.APP_URL}/Images/${img}`)
			}
			const productVariants: string[] =
				(value.get('product_variants') as string | null)?.split(',') ?? []
			const productSpecifications: string[] =
				(value.get('product_specifications') as string | null)?.split(',') ?? []

			return {
				product_id: value.get('id'),
				product_category_id: value.get('product_category_id'),
				language: value.get('language'),
				product_title: value.get('product_title'),
				product_images: productImage,
				product_amount: value.get('product_amount'),
				product_description: value.get('product_description'),
				product_variants: productVariants,
				product_delivery_to: value.get('product_delivery_to'),
				product_specifications: productSpecifications,
				thumbnail: `${process.env.APP_URL}/Images/${value.get('thumbnail')}`,
			}
		})
	}
}
