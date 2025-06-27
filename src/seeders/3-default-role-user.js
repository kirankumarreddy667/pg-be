'use strict'

module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkDelete('role_user', null, {})

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

	async down(queryInterface) {
		await queryInterface.bulkDelete('role_user', {})
	},
}
