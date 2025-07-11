import { Summernote } from '@/models/summernote.model'
import db from '@/config/database'
import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'

// Type for parsed article_images
export type ArticleImage = { img: string; name: string }

export class SummernoteService {
	public static async create(summernoteInput: string): Promise<Summernote> {
		try {
			let detail = summernoteInput
			const categoryId = 1
			const languageId = 19
			const articleThumb = 'Dairy_5.jpg'
			const articleHeader =
				'उच्च प्रतीचं स्वच्छ दर्जेदार दूध-उत्पादन कसे करावे !'
			const articleSummary =
				'दुध धंद्याला वलय आणि नफा मिळवून देण्यासाठी दुधाला उच्च दर मिळणे जरुरी आहे. अर्थशास्त्रातील सामान्य गणितानुसार, एखाद्या  वस्तूला किंवा सेवेला उच्च किंमत मिळण्यासाठी त्याची ग्राहक वर्गामध्ये उच्च दर्जा किंवा दुर्मिळ वस्तू म्हणून ख्याती असली पाहिजे.  दूध हि गोष्ट दुर्मिळ नाही.  भरपूर प्रमाणात उपलब्ध आहे. म्हणजेच दुधाला देखील दर मिळण्यासाठी उच्च आणि उत्तम प्रतीचे दर्जेदार दूध निर्मितीची खूप निकड आहे.'
			const article_images =
				'[{"img":"Dairy_2.jpg","name":"पारंपरिक गोठा"},{"img":"Dairy_3.jpg","name":"पारंपरिक गोठा"},{"img":"Dairy_4.jpg","name":"मुक्त संचार गोठा"},{"img":"Dairy_5.jpg","name":"मुक्त संचार गोठा"}]'

			// Parse HTML and handle base64 images
			const dom = new JSDOM(detail)
			const { document } = dom.window
			const images = document.querySelectorAll('img')
			if (images) {
				images.forEach((img, k) => {
					const data = img.getAttribute('src')
					if (data?.startsWith('data:')) {
						const matches = data.match(/^data:(.+);base64,(.+)$/)
						if (matches?.[1] && matches?.[2]) {
							const [, mimeType, base64Data] = matches
							const ext = mimeType.split('/')[1] || 'png'
							const buffer = Buffer.from(base64Data, 'base64')
							const imageName = `${Date.now()}_${k}.${ext}`
							const imagePath = path.join(
								process.cwd(),
								'storage',
								'images',
								imageName,
							)
							fs.writeFileSync(imagePath, buffer)
							img.setAttribute('src', `/storage/images/${imageName}`)
						}
					}
				})
			}

			detail = document.body.innerHTML

			const summernote = await db.Summernote.create({
				content: detail,
				article_category_id: categoryId,
				language_id: languageId,
				article_thumb: articleThumb,
				article_header: articleHeader,
				article_summary: articleSummary,
				article_images,
			})
			return summernote
		} catch (error) {
			throw new Error(
				`Failed to create summernote article: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	public static async getLatest(): Promise<Summernote | null> {
		try {
			const article = await db.Summernote.findOne({
				order: [['created_at', 'DESC']],
			})
			return article
		} catch (error) {
			throw new Error(
				`Failed to fetch latest summernote article: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	public static async getByCategoryAndLanguage(
		categoryId: number,
		languageId: number,
	): Promise<
		{
			article_id: number
			article_thumb: string
			article_header: string
			article_summary: string
			article_images: ArticleImage[]
			article_body: string
		}[]
	> {
		try {
			const articles = await db.Summernote.findAll({
				where: { article_category_id: categoryId, language_id: languageId },
				order: [['created_at', 'DESC']],
			})

			if (articles.length === 0) {
				return []
			}
			const resData = articles.map((value) => {
				const abc = JSON.parse(
					value.article_images || '[]',
				) as unknown as ArticleImage[]
				const img = abc.map((value1) => ({
					img: `/Images/${value1.img}`,
					name: value1.name,
				}))
				return {
					article_id: value.id,
					article_thumb: `/Images/${value.article_thumb}`,
					article_header: value.article_header,
					article_summary: value.article_summary,
					article_images: img,
					article_body: value.content,
				}
			})
			return resData
		} catch (error) {
			throw new Error(
				`Failed to fetch summernote articles: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	public static async listAll(): Promise<
		{
			article_id: number
			article_thumb: string
			article_header: string
			article_summary: string
			article_images: ArticleImage[]
			article_body: string
			article_category_id: number
			language_id: number
		}[]
	> {
		try {
			const articles = await db.Summernote.findAll({
				order: [['created_at', 'DESC']],
			})

			if (articles.length === 0) {
				return []
			}
			const resData = articles.map((value) => {
				const abc = JSON.parse(
					value.article_images || '[]',
				) as unknown as ArticleImage[]
				const img = abc.map((value1) => ({
					img: `/Images/${value1.img}`,
					name: value1.name,
				}))
				return {
					article_id: value.id,
					article_thumb: `/Images/${value.article_thumb}`,
					article_header: value.article_header,
					article_summary: value.article_summary,
					article_images: img,
					article_body: value.content,
					article_category_id: value.article_category_id,
					language_id: value.language_id,
				}
			})
			return resData
		} catch (error) {
			throw new Error(
				`Failed to fetch all summernote articles: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}
}
