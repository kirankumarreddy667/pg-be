import { QueryInterface } from 'sequelize'
import bcrypt from 'bcryptjs'

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('users', {}, {})

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash('Adm!n@742', salt)

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

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('users', {
			id: [1],
		})
	},
}
