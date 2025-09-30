import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      ADD COLUMN \`deleted_at\` timestamp NULL DEFAULT NULL AFTER \`record_milk_refresh\`;
    `)
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      DROP COLUMN \`deleted_at\`;
    `)
	},
}
