// Seeder for default languages
'use strict'

module.exports = {
	up: async (queryInterface) => {
		const now = new Date()
		await queryInterface.bulkInsert('languages', [
			{
				name: 'Hindi',
				language_code: 'HI',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'English',
				language_code: 'EN',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'Marathi',
				language_code: 'Mr',
				created_at: now,
				updated_at: now,
			},
		])
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('languages', null, {})
	},
}
