import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`notification_language\`
			CHANGE \`send_notification_date\` \`send_notification_date\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		// Optional: You can define the previous definition here if needed
		await queryInterface.sequelize.query(`
			ALTER TABLE \`notification_language\`
			CHANGE \`send_notification_date\` \`send_notification_date\` TIMESTAMP NULL;
		`)
	},
}
