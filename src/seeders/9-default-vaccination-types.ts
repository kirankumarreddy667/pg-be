import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		const now = new Date()
		await queryInterface.bulkInsert('vaccination_types', [
			{ type: 'IBR', created_at: now, updated_at: now },
			{ type: 'Theileria', created_at: now, updated_at: now },
			{ type: 'Brucellosis', created_at: now, updated_at: now },
			{ type: 'HS', created_at: now, updated_at: now },
			{ type: 'BQ', created_at: now, updated_at: now },
			{ type: 'FMD', created_at: now, updated_at: now },
			{ type: 'Other', created_at: now, updated_at: now },
		])
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.bulkDelete('vaccination_types', {}, {})
	},
}
