import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      DROP INDEX \`users_phone_number_unique\`,
      DROP INDEX \`users_email_unique\`;
    `)
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      ADD UNIQUE KEY \`users_phone_number_unique\` (\`phone_number\`),
      ADD UNIQUE KEY \`users_email_unique\` (\`email\`);
    `)
	},
}
