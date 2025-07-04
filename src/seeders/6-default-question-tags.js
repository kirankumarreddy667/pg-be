module.exports = {
	up: async (queryInterface) => {
		const now = new Date()
		await queryInterface.bulkInsert('question_tags', [
			{ name: 'Expense', description: '', created_at: now, updated_at: now },
			{ name: 'Income', description: '', created_at: now, updated_at: now },
			{
				name: 'Milk Production Quantity',
				description: '',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'Milk Production Quality',
				description: '',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'Health Report',
				description: '',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'Weight Report',
				description: '',
				created_at: now,
				updated_at: now,
			},
		])
	},
	down: async (queryInterface) => {
		await queryInterface.bulkDelete('question_tags', null, {})
	},
}
