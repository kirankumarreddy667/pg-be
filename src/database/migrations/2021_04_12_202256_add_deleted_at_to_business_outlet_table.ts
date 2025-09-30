import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`business_outlet\`
			ADD COLUMN \`deleted_at\` timestamp NULL DEFAULT NULL AFTER \`assign_to\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`business_outlet\`
			DROP COLUMN \`deleted_at\`;
		`)
	},
}
