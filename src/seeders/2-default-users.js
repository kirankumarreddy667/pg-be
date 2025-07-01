'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkDelete('users', null, {})

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash('Admin@123', salt)

		await queryInterface.bulkInsert(
			'users',
			[
				{
					id: 1,
					name: 'Super Admin',
					email: 'admin@example.com',
					password: hashedPassword,
					phone_number: '1234567890',
					provider: JSON.stringify(['local']),
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{},
		)
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('users', {
			id: [1],
		})
	},
}
