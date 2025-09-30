import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`contact_us\`
			ADD COLUMN \`deleted_at\` timestamp NULL DEFAULT NULL
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`contact_us\`
			DROP COLUMN \`deleted_at\`
		`)
	},
}
