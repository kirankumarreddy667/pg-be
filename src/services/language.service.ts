import db from '@/config/database'
import { Language } from '@/models/language.model'

export class LanguageService {
	static async getAllLanguages(): Promise<Language[]> {
		return await db.Language.findAll()
	}

	static async createLanguage(data: {
		name: string
		language_code: string
	}): Promise<Language> {
		return await db.Language.create(data)
	}

	static async updateLanguage(id: number, data: { name?: string; language_code?: string }): Promise<Language | null> {
		const language = await db.Language.findByPk(id);
		if (!language) return null;
		await language.update(data);
		return language;
	}
}
