import db from '@/config/database'

export class SliderArticleService {
	static async addArticles(
		articles: Array<{
			language_id: number
			name: string
			image: string
			web_url: string
			subtitle?: string | null
			thumbnail: string
		}>,
	): Promise<boolean> {

		await db.SliderArticle.bulkCreate(articles)
		return true
	}

	static async getArticlesByLanguage(language_id: number): Promise<
		Array<{
			sliderArticleId: number
			language_id: number
			name: string
			image: string
			web_url: string
			subtitle: string | null
			thumbnail: string
			created_at: Date
		}>
	> {
		const data = await db.SliderArticle.findAll({ where: { language_id },raw: true })
		return data.map((value) => ({
			sliderArticleId: value.id,
			language_id: value.language_id,
			name: value.name,
			image: `/Images/${value.image}`,
			web_url: value.web_url,
			subtitle: value.subtitle ?? null,
			thumbnail: `/Images/thumbnail/${value.thumbnail}`,
			created_at: value.created_at,
		}))
	}
}
