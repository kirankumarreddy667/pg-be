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
			},
		})
		return data.map((value) => {
			// product_images
			let productImage: string[] = []
			if (value.product_images) {
				productImage = value.product_images
					.split(',')
					.map((img) => `/Images/${img}`)
			}
			// product_variants
			let productVariants: string[] = []
			if (value.product_variants) {
				productVariants = value.product_variants.split(',')
			}
			// product_specifications
			let productSpecifications: string[] = []
			if (value.product_specifications) {
				productSpecifications = value.product_specifications.split(',')
			}
			return {
				product_id: value.id,
				product_category_id: value.product_category_id,
				language: value.language,
				product_title: value.product_title,
				product_images: productImage,
				product_amount: value.product_amount,
				product_description: value.product_description,
				product_variants: productVariants,
				product_delivery_to: value.product_delivery_to,
				product_specifications: productSpecifications,
				thumbnail: `/Images/${value.thumbnail}`,
			}
		})
	}
}
