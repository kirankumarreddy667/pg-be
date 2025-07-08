import db from '@/config/database'

export class AppAboutContentService {
  static async getAppAboutContents(language_id: number, type: string): Promise<Array<{ type: string; language_id: number; content: string }>> {
    const data = await db.AppAboutContent.findAll({
      where: { language_id, type },
    })
    return data.map((value) => ({
      type: value.type,
      language_id: value.language_id,
      content: value.content,
    }))
  }
}
