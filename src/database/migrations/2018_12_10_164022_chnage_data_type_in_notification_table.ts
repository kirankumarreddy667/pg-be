import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`notification\` 
      CHANGE \`send_notification_date\` \`send_notification_date\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		// Rollback assumes it was nullable without default (modify as needed)
		await queryInterface.sequelize.query(`
      ALTER TABLE \`notification\` 
      CHANGE \`send_notification_date\` \`send_notification_date\` TIMESTAMP NULL DEFAULT NULL;
    `)
	},
}
