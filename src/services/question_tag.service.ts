import db from '@/config/database'
import { QuestionTag } from '@/models/question_tag.model'

export class QuestionTagService {
	static async getAll(): Promise<QuestionTag[]> {
		return await db.QuestionTag.findAll({ where: { deleted_at: null } })
	}

	static async create(tags: string[]): Promise<QuestionTag[]> {
		if (tags.length === 0) return []
		return await db.QuestionTag.bulkCreate(tags.map((tag) => ({ name: tag })))
	}
}
