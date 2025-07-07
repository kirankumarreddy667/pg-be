import db from '@/config/database'
import { QuestionTag } from '@/models/question_tag.model'

export class QuestionTagService {
	static async getAll(): Promise<QuestionTag[]> {
		return await db.QuestionTag.findAll()
	}

	static async create(data: {
		name: string
		description?: string | null
	}): Promise<QuestionTag> {
		return await db.QuestionTag.create(data)
	}
}
