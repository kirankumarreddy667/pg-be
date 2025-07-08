'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkDelete('users', null, {})

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash('powergotha123', salt)

		await queryInterface.bulkInsert(
			'users',
			[
				{
					id: 1,
					name: 'admin',
					email: 'powergotha@powergotha.com',
					password: hashedPassword,
					phone_number: '7207063149',
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
