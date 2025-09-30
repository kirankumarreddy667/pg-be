import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.bulkInsert('investment_types', [
			{
				investment_type: 'Cow Purchase',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Milking Machine',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Chauff Cutter',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Silage Machine',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Bulk Cooler',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Pellet Machine',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Sprayer',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Tractor',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Dung Lifter and puller',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Milk Supply Vehicle',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Dairy Farm Software',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				investment_type: 'Semen Straw Container',
				created_at: new Date(),
				updated_at: new Date(),
			},
		])
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.bulkDelete('investment_types', {}, {})
	},
}
