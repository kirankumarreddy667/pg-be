import { QueryInterface } from 'sequelize'

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('role_user', {}, {})

		await queryInterface.bulkInsert(
			'role_user',
			[
				{
					user_id: 1, // SuperAdmin
					role_id: 1,
				},
			],
			{},
		)
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('role_user', {})
	},
}
