import db from '@/config/database'
import { QuestionUnit } from '@/models/question_unit.model'

export class QuestionUnitService {
	static async getAll(): Promise<QuestionUnit[]> {
		return await db.QuestionUnit.findAll()
	}
}
