import { QueryInterface } from 'sequelize'

module.exports = {
	async up(queryInterface: QueryInterface) {
		// First, delete all existing entries to ensure idempotency
		await queryInterface.bulkDelete('roles', {}, {})

		await queryInterface.bulkInsert(
			'roles',
			[
				{
					id: 1,
					name: 'SuperAdmin',
					display_name: 'Super Admin',
					description: 'Super administrator with all permissions',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					id: 2,
					name: 'User',
					display_name: 'User',
					description: 'Regular user',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					id: 3,
					name: 'Business',
					display_name: 'Business User',
					description: 'Business user with special permissions',
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('roles', { id: [1, 2, 3] })
	},
}
