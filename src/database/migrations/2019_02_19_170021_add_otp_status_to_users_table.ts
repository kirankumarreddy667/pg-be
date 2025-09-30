import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      ADD COLUMN \`otp_status\` tinyint(1) NOT NULL DEFAULT 0 AFTER \`village\`;
    `)
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      DROP COLUMN \`otp_status\`;
    `)
	},
}
