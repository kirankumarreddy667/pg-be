'use strict'

module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('contact_us', [
			{
				phone_number: '9112219610',
				contact_email: 'support@powergotha.com',
				whatsapp: '9112219610',
				created_at: new Date(),
				updated_at: new Date(),
			},
		])
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('contact_us', null, {})
	},
}
