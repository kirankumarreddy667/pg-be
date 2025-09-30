import db from '@/config/database'

export class AppAboutContentService {
	static async getAppAboutContents(
		language_id: number,
		type: string,
	): Promise<Array<{ type: string; language_id: number; content: string }>> {
		const data = await db.AppAboutContent.findAll({
			where: { language_id, type, deleted_at: null },
		})
		return data.map((value) => ({
			type: value.get('type'),
			language_id: value.get('language_id'),
			content: value.get('content'),
		}))
	}
}
