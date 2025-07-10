import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		const now = new Date()
		await queryInterface.bulkInsert('question_units', [
			{
				name: 'Price Per Unit',
				description: '',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'Total Cost',
				description: '',
				created_at: now,
				updated_at: now,
			},
			{
				name: 'Other',
				description: '',
				created_at: now,
				updated_at: now,
			},
		])
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.bulkDelete('question_units', {}, {})
	},
}
